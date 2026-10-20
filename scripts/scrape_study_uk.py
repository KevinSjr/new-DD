"""Coleta bolsas do buscador Study UK para a nacionalidade Brazilian.

Uso: python scripts/scrape_study_uk.py data/imports/study-uk-brazil-YYYY-MM-DD.json
Requer requests. Os resultados são pistas para revisão, não prova de elegibilidade.
"""
import json
import re
import sys
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import requests

BASE = "https://search-study-uk.britishcouncil.org"
PAGE_SIZE = 20


def get_json(session, method, url, **kwargs):
    for attempt in range(4):
        try:
            response = session.request(method, url, timeout=45, **kwargs)
            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            return response.json()
        except (requests.Timeout, requests.ConnectionError):
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"A fonte não respondeu após quatro tentativas: {url}")


def clean(value):
    return " ".join(str(value or "").split())


def transform(item):
    provider = item.get("provider") or {}
    provider_id = provider.get("id")
    countries = sorted({clean(venue.get("country", {}).get("name"))
                        for venue in provider.get("venues") or [] if venue.get("country")})
    source_id = clean(item.get("id"))
    path = f"{provider_id}/{source_id}" if provider_id else source_id
    return {
        "id": source_id,
        "url": f"{BASE}/scholarships/{path}",
        "title": clean(item.get("name")),
        "institution": clean(provider.get("name") or item.get("providerName")),
        "grant": clean(item.get("grant")),
        "provider_countries": countries,
        "country_basis": "institution_uk" if "United Kingdom" in countries else "not_specified",
    }


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/scrape_study_uk.py CAMINHO_DO_JSON")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()):
        raise SystemExit("O JSON de saída deve ficar dentro do projeto.")
    session = requests.Session()
    tenant = get_json(session, "GET", f"{BASE}/api/tenant")
    api_base = f"{tenant['apiBaseUrl'].rstrip('/')}/{tenant['apiVersion']}"
    session.headers.update({
        "Authorization": f"Bearer {tenant['apiKey']}",
        "Partner-Id": tenant["partnerId"],
        "Origin": BASE,
        "Referer": f"{BASE}/scholarships",
    })
    filters = get_json(session, "GET", f"{api_base}/static-data/filters")
    nationality = next(group for group in filters if group.get("filterType") == "nationalities")
    brazilian = next(value for value in nationality["values"] if value.get("name") == "Brazilian")
    if "scholarships" not in nationality.get("searchTypes", []):
        raise RuntimeError("A fonte não oferece nacionalidade como filtro de bolsas.")

    def page(number):
        data = get_json(session, "POST", f"{api_base}/search/scholarships",
                        json={"filters": {"nationalities": [brazilian["id"]]}, "pageNumber": number})
        if not isinstance(data.get("totalResults"), int) or not isinstance(data.get("scholarships"), list):
            raise RuntimeError(f"Resposta de busca inválida na página {number}.")
        return data

    first = page(1)
    total = first["totalResults"]
    pages = (total + PAGE_SIZE - 1) // PAGE_SIZE
    items = {}
    raw_count = 0
    duplicate_count = 0

    def add_batch(batch):
        nonlocal raw_count, duplicate_count
        for item in batch:
            raw_count += 1
            key = clean(item["id"])
            previous = items.get(key)
            if previous is not None:
                duplicate_count += 1
                if previous.get("name") != item.get("name") or (previous.get("provider") or {}).get("id") != (item.get("provider") or {}).get("id"):
                    raise RuntimeError(f"ID {key} representa bolsas diferentes; nada foi salvo.")
            items[key] = item

    add_batch(first["scholarships"])
    print(f"Study UK informa {total} resultados para Brazilian em {pages} páginas.", flush=True)
    for number in range(2, pages + 1):
        time.sleep(0.4)
        data = page(number)
        if data["totalResults"] != total:
            raise RuntimeError("O total da fonte mudou durante a coleta; nada foi salvo.")
        add_batch(data["scholarships"])
        if number % 10 == 0 or number == pages:
            print(f"Página {number}/{pages}: {len(items)} IDs únicos.", flush=True)
    if raw_count != total or len(items) + duplicate_count != total:
        raise RuntimeError(f"Coleta incompleta: esperadas {total} linhas, recebidas {raw_count}.")
    print(f"{duplicate_count} linhas repetem IDs, nome e instituição; {len(items)} registros únicos.", flush=True)

    records = []
    excluded = Counter()
    for item in items.values():
        record = transform(item)
        if not record["id"] or not record["title"] or not re.fullmatch(r"https://search-study-uk\.britishcouncil\.org/scholarships/(?:\d+/)?\d+", record["url"]):
            raise RuntimeError(f"Registro inválido: {record['id']}")
        countries = record["provider_countries"]
        if countries and "United Kingdom" not in countries:
            excluded.update(countries)
            continue
        records.append(record)
    payload = {
        "source": "study_uk_british_council",
        "source_url": f"{BASE}/scholarships",
        "filter": "Brazilian",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "reported_total": total,
        "unique_total": len(items),
        "duplicate_rows": duplicate_count,
        "retained_total": len(records),
        "excluded_non_uk": total - len(records),
        "excluded_countries": dict(excluded),
        "caveat": "Resultados do filtro Brazilian; elegibilidade individual, status e prazos não verificados. Registros sem país da instituição foram mantidos como destino não confirmado.",
        "records": records,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Salvos {len(records)} registros; {total - len(records)} excluídos por instituição explicitamente fora do Reino Unido.")


if __name__ == "__main__":
    main()
