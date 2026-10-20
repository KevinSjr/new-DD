"""Coleta os programas públicos da base DAAD, com links e campos para o catálogo.

Uso: python scripts/scrape_daad.py data/imports/daad-AAAA-MM-DD.json
Uma coleta interrompida deixa .partial.json para retomada; nunca importe o parcial.
"""

import html
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

BASE = "https://www2.daad.de"
SEARCH = f"{BASE}/deutschland/stipendium/datenbank/en/21148-scholarship-database/"
ASSET = "/bundles/daadstipendiendatenbanklsh/data/a/js/"


def fetch(session, url):
    for attempt in range(4):
        try:
            response = session.get(url, timeout=45)
            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            response.encoding = "utf-8"
            return response.text
        except (requests.Timeout, requests.ConnectionError):
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Fonte indisponível após quatro tentativas: {url}")


def plain(value):
    value = re.sub(r"<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->", " ",
                   str(value or ""), flags=re.I | re.S)
    value = re.sub(r"<[^>]+>", " ", value)
    return " ".join(html.unescape(value).replace("\u00ad", "").split())


def section(markup, title):
    match = re.search(r"<h3\b[^>]*>\s*" + title +
                      r"\s*</h3>(.*?)(?=<h3\b|</div>\s*<!--! end of)",
                      markup, flags=re.I | re.S)
    return plain(match.group(1))[:1500] if match else ""


def asset_data(session, markup, filename):
    match = re.search(r'<script[^>]+src="(' + re.escape(ASSET) +
                      re.escape(filename) + r'\?[^\"]+)"', markup)
    if not match:
        raise RuntimeError(f"Arquivo público {filename} não encontrado na página.")
    url = BASE + html.unescape(match.group(1))
    source = fetch(session, url)
    match_data = re.fullmatch(r"\s*var\s+\w+\s*=\s*TAFFY\((\[.*\])\);?\s*", source, re.S)
    if not match_data:
        raise RuntimeError(f"Formato de {filename} mudou; coleta interrompida.")
    return json.loads(match_data.group(1)), url


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
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
        raise SystemExit("Uso: python scripts/scrape_daad.py CAMINHO_DO_JSON")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()) or output.suffix != ".json":
        raise SystemExit("Use um caminho .json dentro do projeto.")
    partial = output.with_suffix(".partial.json")
    session = requests.Session()
    markup = fetch(session, SEARCH)
    datasets = {}
    asset_urls = {}
    for name in ("origin", "scholarships", "status", "subjectgroups", "intentions", "deadlines"):
        datasets[name], asset_urls[name] = asset_data(session, markup, f"{name}.js")
    origin = {entry["id"]: entry["nameEn"] for entry in datasets["origin"]}
    brazil_ids = [code for code, name in origin.items() if name == "Brazil"]
    if len(brazil_ids) != 1:
        raise RuntimeError("Brasil ausente ou duplicado no filtro de países DAAD.")
    brazil_id = brazil_ids[0]
    status = {entry["id"]: entry["nameEn"] for entry in datasets["status"]}
    subjects = {entry["code"]: entry["nameEn"] for entry in datasets["subjectgroups"]}
    intentions = {entry["id"]: entry["nameEn"] for entry in datasets["intentions"]}
    deadlines = {entry["id"]: entry for entry in datasets["deadlines"]}
    source = datasets["scholarships"]
    source_ids = [str(entry["sapProgid"]) for entry in source]
    if len(source_ids) != len(set(source_ids)) or len(source) != len(deadlines):
        raise RuntimeError("Contagem ou IDs inconsistentes nos arquivos DAAD.")

    if partial.exists():
        state = json.loads(partial.read_text(encoding="utf-8"))
        if state.get("source") != "daad" or state.get("reported_total") != len(source) or state.get("source_ids") != source_ids:
            raise RuntimeError("Coleta parcial não corresponde à versão atual do catálogo DAAD.")
        records = state["records"]
        if [record["id"] for record in records] != source_ids[:len(records)]:
            raise RuntimeError("Ordem da coleta parcial não corresponde ao catálogo atual.")
        print(f"Retomando no registro {len(records) + 1}/{len(source)}.", flush=True)
    else:
        records = []

    for index in range(len(records), len(source)):
        entry = source[index]
        source_id = str(entry["sapProgid"])
        if not source_id.isdecimal() or not entry.get("nameEn") or not isinstance(entry.get("origin"), list):
            raise RuntimeError(f"Registro DAAD inválido: {source_id}.")
        country_ids = entry["origin"]
        # The DAAD programme file still contains a few country IDs absent from
        # the current options file; keep the original count without guessing names.
        deadline_data = deadlines.get(entry["sapProgid"])
        if not deadline_data:
            raise RuntimeError(f"Prazo sem programa correspondente: {source_id}.")
        detail_url = f"{SEARCH}?detail={source_id}"
        if brazil_id in country_ids:
            detail_url += f"&origin={brazil_id}"
        time.sleep(0.35)
        detail = fetch(session, detail_url)
        # The detail heading may use a longer programme name than the list entry.
        if 'id="ifa-stipendien-detail"' not in detail or f"stipa{source_id}" not in detail:
            raise RuntimeError(f"Página de detalhes não corresponde a {source_id}.")
        origin_deadlines = (deadline_data.get("countries") or {}).get(str(brazil_id), []) if brazil_id in country_ids else []
        brazil_deadline = "; ".join(filter(None, (plain(item.get("en")) for item in origin_deadlines)))
        general_deadline = plain((deadline_data.get("general") or {}).get("en"))
        detail_deadline = section(detail, r"Application Deadlines?")
        record = {
            "id": source_id,
            "url": detail_url,
            "title": plain(entry["nameEn"]),
            "description": plain((entry.get("introduction") or {}).get("en")),
            "is_daad": entry.get("isDaad") == 1,
            "brazil_listed": brazil_id in country_ids,
            "origin_count": len(country_ids),
            "study_levels": [status[code] for code in entry["status"] if code in status],
            "fields_of_study": [subjects[code] for code in entry["subjectGrps"] if code in subjects],
            "purposes": [intentions[code] for code in entry["intentions"] if code in intentions],
            "deadline_brazil": brazil_deadline,
            "deadline_general": general_deadline,
            "deadline_detail": detail_deadline,
            "amount_detail": section(detail, r"Scholarship Value"),
        }
        records.append(record)
        if len(records) % 5 == 0 or len(records) == len(source):
            save(partial, {"source": "daad", "reported_total": len(source),
                           "source_ids": source_ids, "records": records})
        if len(records) % 10 == 0 or len(records) == len(source):
            print(f"Detalhes {len(records)}/{len(source)} coletados.", flush=True)

    if len(records) != len(source):
        raise RuntimeError("Coleta DAAD incompleta.")
    save(output, {
        "source": "daad", "source_url": SEARCH, "source_asset_urls": asset_urls,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "reported_total": len(source), "brazil_origin_filter_id": brazil_id,
        "unmapped_origin_ids": sorted({code for entry in source for code in entry["origin"] if code not in origin}),
        "caveat": "País de origem é o país de residência/candidatura; não prova nacionalidade nem elegibilidade final. Destino e abertura exigem confirmação no edital.",
        "records": records,
    })
    partial.unlink()
    print(f"Coleta DAAD completa: {len(records)} programas salvos em {output}.")


if __name__ == "__main__":
    main()
