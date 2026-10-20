"""Coleta as bolsas mostradas no catálogo público da Scholarship America.

Uso: python scripts/scrape_scholarship_america.py data/imports/scholarship-america-YYYY-MM-DD.json
Os dados são pistas para revisão, não uma afirmação de elegibilidade ou edital aberto.
"""
import json
import re
import sys
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API = "https://scholarshipamerica.org/wp-json/wp/v2/scholarship"
CATALOG = "https://scholarshipamerica.org/students/browse-scholarships/"
PER_PAGE = 100
SHOWN_TERM = 246


class TextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def plain(value):
    parser = TextParser()
    parser.feed(str(value or ""))
    return " ".join(" ".join(parser.parts).split())


def flatten(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [part for item in value for part in flatten(item)]
    if isinstance(value, dict):
        return [part for item in value.values() for part in flatten(item)]
    return []


def fetch(page):
    query = urlencode({"listing-status": SHOWN_TERM, "per_page": PER_PAGE, "page": page,
                       "_fields": "id,link,title,acf,scholarship-status,listing-status"})
    request = Request(f"{API}?{query}", headers={"User-Agent": "DaydreamingResearch/1.0"})
    with urlopen(request, timeout=90) as response:
        data = json.load(response)
        total = int(response.headers["X-WP-Total"])
        pages = int(response.headers["X-WP-TotalPages"])
    return total, pages, data


def transform(item):
    acf = item.get("acf") or {}
    eligibility = plain(" ".join(flatten(acf.get("scholarship_content_eligibility"))))
    open_date = acf.get("scholarship_details_open_date_time") or {}
    close_date = acf.get("scholarship_details_close_date_time") or {}
    status_terms = item.get("scholarship-status") or []
    status = "open" if 250 in status_terms else "closed" if 249 in status_terms else "unknown"
    return {
        "id": item["id"],
        "url": item["link"],
        "title": plain((item.get("title") or {}).get("rendered")),
        "description": plain(acf.get("scholarship_details_hero_description")),
        "eligibility": eligibility,
        "award_amount": plain(acf.get("scholarship_details_award_amount")),
        "listing_status": status,
        "open_date": open_date.get("date_time") if isinstance(open_date, dict) else None,
        "close_date": close_date.get("date_time") if isinstance(close_date, dict) else None,
        "date_timezone": (close_date.get("timezone_timezone_select_timezone") or open_date.get("timezone_timezone_select_timezone")) if isinstance(close_date, dict) and isinstance(open_date, dict) else None,
        "brazil_mentioned": bool(re.search(r"\b(?:Brazil|Brasil)\b", eligibility, re.I)),
    }


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/scrape_scholarship_america.py CAMINHO_DO_JSON")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()):
        raise SystemExit("O JSON de saída deve ficar dentro do projeto.")
    total, pages, first = fetch(1)
    records = {item["id"]: transform(item) for item in first}
    print(f"Catálogo: {total} registros mostrados em {pages} páginas da API.", flush=True)
    for page in range(2, pages + 1):
        time.sleep(1)
        reported, reported_pages, batch = fetch(page)
        if reported != total or reported_pages != pages:
            raise RuntimeError("O catálogo mudou durante a coleta; nada foi salvo.")
        records.update((item["id"], transform(item)) for item in batch)
        print(f"Página {page}/{pages}: {len(batch)} registros.", flush=True)
    if len(records) != total or any(not r["title"] or not r["url"].startswith("https://scholarshipamerica.org/scholarship/") for r in records.values()):
        raise RuntimeError("Coleta incompleta ou registro inválido; nada foi salvo.")
    payload = {
        "source": "scholarship_america",
        "source_url": CATALOG,
        "api_url": API,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "reported_total": total,
        "caveat": "Catálogo público, não filtrado por nacionalidade. Menção ao Brasil não comprova elegibilidade. Status e prazos exigem revalidação na fonte.",
        "records": list(records.values()),
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Salvos {len(records)} registros em {output} ({sum(r['brazil_mentioned'] for r in records.values())} mencionam Brasil nos critérios).")


if __name__ == "__main__":
    main()
