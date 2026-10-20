"""Coleta o catálogo público Study Australia, preservando dados para revisão.

Uso: python scripts/scrape_study_australia.py data/imports/study-australia-AAAA-MM-DD.json
Um arquivo .partial.json permite retomar uma coleta interrompida; ele não deve ser importado.
"""

import html
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

import requests

BASE = "https://search.studyaustralia.gov.au"
LIST = f"{BASE}/scholarships"
PAGE_SIZE = 10


def fetch(session, url, **kwargs):
    for attempt in range(4):
        try:
            response = session.get(url, timeout=45, **kwargs)
            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            return response
        except (requests.Timeout, requests.ConnectionError):
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Fonte indisponível após quatro tentativas: {url}")


def clean(value):
    return " ".join(html.unescape(str(value or "")).split())


def transform(item):
    source_id = clean(item.get("id"))
    slug = clean(item.get("slug"))
    levels = [clean(level.get("name")) for level in item.get("level_of_studies") or []]
    fields = [clean(field.get("name")) for field in item.get("field_of_studies") or []]
    providers = [clean(org.get("name")) for org in item.get("organisations") or []]
    return {
        "id": source_id,
        "url": f"{BASE}/scholarship/{quote(slug)}/{source_id}",
        "title": clean(item.get("name")),
        "description": clean(item.get("description")),
        "eligibility": clean(item.get("eligibility")),
        "providers": sorted(set(filter(None, providers))),
        "deadline": clean(item.get("closing_date")),
        "amount_annual": item.get("amount_annual"),
        "amount_max": item.get("amount_max"),
        "amount_comment": clean(item.get("amount_comment")),
        "nationality": item.get("country_of_citizenship") or {},
        "nationality_label": clean(item.get("scholarship_country_name")),
        "international_students": item.get("is_for_international_students"),
        "australian_students": item.get("is_for_australian_students"),
        "tenable_overseas": item.get("is_tenable_overseas"),
        "study_levels": sorted(set(filter(None, levels))),
        "fields_of_study": sorted(set(filter(None, fields))),
        "provider_url": clean(item.get("web_address")),
    }


def save(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    for attempt in range(6):
        try:
            temporary.replace(path)
            return
        except PermissionError:
            if attempt == 5:
                raise
            time.sleep(0.5 * (attempt + 1))


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/scrape_study_australia.py CAMINHO_DO_JSON")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()) or output.suffix != ".json":
        raise SystemExit("Use um caminho .json dentro do projeto.")
    partial = output.with_suffix(".partial.json")
    session = requests.Session()
    markup = fetch(session, LIST).text
    match = re.search(r'data-page="([^\"]+)', markup)
    if not match:
        raise RuntimeError("A página não contém dados estruturados; verifique o formato.")
    page = json.loads(html.unescape(match.group(1)))
    version = page["version"]
    listing = page["props"]["scholarships"]
    total = listing["meta"]["total"]
    pages = (total + PAGE_SIZE - 1) // PAGE_SIZE
    if not isinstance(total, int) or total < 1 or listing["meta"]["page"] != 1:
        raise RuntimeError("Paginação inicial inválida.")

    if partial.exists():
        state = json.loads(partial.read_text(encoding="utf-8"))
        if state.get("source") != "study_australia" or state.get("reported_total") != total:
            raise RuntimeError("A coleta parcial não corresponde ao catálogo atual.")
        records = {record["id"]: record for record in state["records"]}
        next_page = state["next_page"]
        print(f"Retomando na página {next_page}/{pages}.", flush=True)
    else:
        records = {}
        next_page = 1

    headers = {
        "X-Inertia": "true", "X-Inertia-Version": version,
        "X-Requested-With": "XMLHttpRequest",
        "X-Inertia-Partial-Component": "Scholarship/List",
        "X-Inertia-Partial-Data": "scholarships",
    }
    for number in range(next_page, pages + 1):
        if number > 1:
            time.sleep(0.35)
            response = fetch(session, LIST, params={"page": number}, headers=headers)
            if "application/json" not in response.headers.get("Content-Type", ""):
                raise RuntimeError(f"A página {number} não retornou JSON.")
            listing = response.json()["props"]["scholarships"]
        if listing["meta"] != {"total": total, "page": number}:
            raise RuntimeError(f"Paginação alterada na página {number}; coleta suspensa.")
        expected = min(PAGE_SIZE, total - (number - 1) * PAGE_SIZE)
        if len(listing["data"]) != expected:
            raise RuntimeError(f"Página {number}: esperados {expected}, recebidos {len(listing['data'])}.")
        for item in listing["data"]:
            record = transform(item)
            if not re.fullmatch(r"[a-f0-9]{32}", record["id"]) or not record["title"]:
                raise RuntimeError(f"Registro inválido na página {number}.")
            if record["id"] in records:
                raise RuntimeError(f"ID repetido entre páginas: {record['id']}.")
            records[record["id"]] = record
        save(partial, {"source": "study_australia", "reported_total": total,
                       "next_page": number + 1, "records": list(records.values())})
        if number % 10 == 0 or number == pages:
            print(f"Página {number}/{pages}: {len(records)} registros únicos.", flush=True)

    if len(records) != total:
        raise RuntimeError(f"Coleta incompleta: {len(records)} de {total}.")
    save(output, {
        "source": "study_australia", "source_url": LIST,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "reported_total": total,
        "caveat": "Resultados do buscador oficial; prazos, valores e elegibilidade individual exigem confirmação no provedor.",
        "records": list(records.values()),
    })
    partial.unlink()
    print(f"Coleta completa salva: {output} ({total} registros).")


if __name__ == "__main__":
    main()
