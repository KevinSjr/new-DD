"""Collect the BECAS-only listing and details from Spain's public administration portal.

Usage: python scripts/scrape_spain_scholarships.py data/imports/spain-scholarships-YYYY-MM-DD.json
The checkpoint holds the unmodified Spanish source fields and supports resuming.
"""

import html
import json
import math
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests

ROOT = "https://administracion.gob.es"
LISTING = ROOT + "/ayudas/buscador-becas-avanzado"
SEARCH = ROOT + "/content/pag-home/es/ayudas/buscador-becas-avanzado/jcr:content/root/container/containerSpace/pag_front_formulario.list.html"
DETAIL_PATH = "/ayudas/buscador-becas-avanzado/detalle-de-ayuda--subvencion--beca-o-premio"
TRANSLATE = "https://translate.googleapis.com/translate_a/single"
HEADERS = {"User-Agent": "Daydreaming scholarship catalogue research"}


def fetch(method, url, **kwargs):
    for attempt in range(5):
        try:
            response = requests.request(method, url, timeout=45, headers=HEADERS, **kwargs)
            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            return response
        except (requests.Timeout, requests.ConnectionError):
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Unavailable: {url}")


def clean(value):
    value = re.sub(r"<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->", " ",
                   str(value or ""), flags=re.I | re.S)
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", value)).split())


def listing():
    page = fetch("GET", SEARCH, params={"pag_idTipo": "2", "numRegistrosMostrar": "100"}).text
    total_match = re.search(r'data-load-total="(\d+)"', page)
    if not total_match:
        raise ValueError("BECAS search result count missing")
    total = int(total_match.group(1))
    cards = re.findall(r'<div class="col-12 dnt-item">(.*?)(?=<div class="col-12 dnt-item">|</div>\s*<div class="dnt-pagination-container)', page, re.S)
    if total <= 0 or len(cards) != total:
        raise ValueError(f"Incomplete BECAS listing: {len(cards)}/{total}")
    result = []
    for card in cards:
        match = re.search(r'href="([^"]*idRegistro=(\d+)[^"]*)"', card)
        if not match:
            raise ValueError("Listing card has no reference link")
        result.append({"id": match.group(2), "url": urljoin(ROOT, html.unescape(match.group(1)))})
    if len({record["id"] for record in result}) != total:
        raise ValueError("Duplicate or missing BECAS reference")
    return total, result


def detail(record):
    page = fetch("GET", record["url"]).text
    start = page.find('<div class="pag-detail">')
    if start < 0 or f"Referencia {record['id']}" not in page[start:start + 500]:
        raise ValueError(f"Detail missing for {record['id']}")
    section = page[start:page.find('<div class="button">', start)]
    blocks = re.split(r'<div class="bloque-detail(?: [^"]*)?">', section)[1:]
    fields = {}
    for block in blocks:
        label = re.search(r'<div class="dnt-txt-body-l">(.*?)</div>', block, re.S)
        if label:
            fields[clean(label.group(1))] = block
    def value(label):
        block = fields.get(label, "")
        found = re.search(r'<div class="dnt-txt-body-l">.*?</div>\s*<div>(.*?)</div>', block, re.S)
        return clean(found.group(1)) if found else ""
    if value("Tipo") != "BECAS" or not value("Denominación"):
        raise ValueError(f"Reference {record['id']} is not a scholarship detail")
    deadline_block = fields.get("Plazos (*)", "")
    deadline_match = re.search(r'<strong>Hasta:</strong>\s*(\d{2}/\d{2}/\d{4})', deadline_block)
    start_match = re.search(r'<strong>Desde:</strong>\s*(\d{2}/\d{2}/\d{4})', deadline_block)
    source_link = re.search(r'<a href="(https?://[^"]+)"[^>]*>\s*Ampliar información', fields.get("Denominación", ""), re.S)
    publication = re.search(r'<strong>Fecha de publicación:</strong>\s*(\d{2}/\d{2}/\d{4})', fields.get("Disposiciones", ""))
    amount = next((value(label) for label in ("Cuantía", "Importe", "Dotación económica") if value(label)), "")
    return {**record,
            "title_original": value("Denominación"),
            "organization": value("Órgano convocante"),
            "geographic_scope": value("Ámbito geográfico"),
            "beneficiaries_original": value("Beneficiarios"),
            "application_original": value("Presentación"),
            "amount_original": amount,
            "deadline_start": start_match.group(1) if start_match else "",
            "deadline_end": deadline_match.group(1) if deadline_match else "",
            "publication_date": publication.group(1) if publication else "",
            "official_notice_url": html.unescape(source_link.group(1)) if source_link else None}


def translate(value):
    if not value:
        return ""
    result = fetch("GET", TRANSLATE, params={"client": "gtx", "sl": "es", "tl": "en", "dt": "t", "q": value}).json()
    translated = clean("".join(part[0] or "" for part in result[0]))
    if not translated:
        raise ValueError("Empty English translation")
    return translated


def iso_date(value):
    if not value:
        return None
    parsed = datetime.strptime(value, "%d/%m/%Y").date()
    return parsed.isoformat() if 2000 <= parsed.year <= 2100 else None


def normalize(source):
    return {
        "id": source["id"], "url": source["url"],
        "title": translate(source["title_original"]),
        "organization": source["organization"],
        "geographic_scope": translate(source["geographic_scope"]),
        "beneficiaries": translate(source["beneficiaries_original"]),
        "application_details": translate(source["application_original"]),
        "amount_detail": translate(source["amount_original"]),
        "deadline_start": iso_date(source["deadline_start"]),
        "deadline_end": iso_date(source["deadline_end"]),
        "deadline_invalid": bool(source["deadline_end"] and iso_date(source["deadline_end"]) is None),
        "publication_date": iso_date(source["publication_date"]),
        "official_notice_url": source["official_notice_url"] if source["official_notice_url"] and source["official_notice_url"].startswith("https://") else None,
        "source_original": {k: source[k] for k in ("title_original", "geographic_scope", "beneficiaries_original", "application_original", "amount_original", "deadline_start", "deadline_end", "official_notice_url")},
        "translation_method": "machine",
    }


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/scrape_spain_scholarships.py OUTPUT.json")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()) or output.suffix != ".json":
        raise SystemExit("Output must be JSON inside this project")
    checkpoint = output.with_suffix(".partial.json")
    total, listed = listing()
    completed = json.loads(checkpoint.read_text(encoding="utf-8")) if checkpoint.exists() else {}
    if completed and completed.get("reported_total") != total:
        raise ValueError("Listing total changed since checkpoint")
    raw = completed.get("records", {})
    pending = [item for item in listed if item["id"] not in raw]
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(detail, item): item["id"] for item in pending}
        for future in as_completed(futures):
            identifier = futures[future]
            raw[identifier] = future.result()
            checkpoint.parent.mkdir(parents=True, exist_ok=True)
            checkpoint.write_text(json.dumps({"reported_total": total, "records": raw}, ensure_ascii=False), encoding="utf-8")
            if len(raw) % 10 == 0:
                print(f"Details {len(raw)}/{total}", flush=True)
    translated = completed.get("translated", {})
    pending = [raw[item["id"]] for item in listed if item["id"] not in translated]
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(normalize, source): source["id"] for source in pending}
        for future in as_completed(futures):
            identifier = futures[future]
            translated[identifier] = future.result()
            checkpoint.write_text(json.dumps({"reported_total": total, "records": raw,
                                              "translated": translated}, ensure_ascii=False), encoding="utf-8")
            if len(translated) % 10 == 0:
                print(f"Translated {len(translated)}/{total}", flush=True)
    rows = [translated[item["id"]] for item in listed]
    for row in rows:
        row["source_original"]["official_notice_url"] = raw[row["id"]]["official_notice_url"]
        if row["official_notice_url"] and not row["official_notice_url"].startswith("https://"):
            row["official_notice_url"] = None
    result = {"source": "spain_administration", "listing_url": LISTING,
              "search_url": SEARCH, "filter": {"pag_idTipo": "2"},
              "fetched_at": datetime.now(timezone.utc).isoformat(),
              "reported_total": total, "records": rows}
    temporary = output.with_suffix(".writing.json")
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(output)
    print(f"Saved {total} Spanish scholarship references to {output}")


if __name__ == "__main__":
    main()
