"""Collect the public CampusBourses catalogue in English.

Usage: python scripts/scrape_campusbourses.py data/imports/campusbourses-YYYY-MM-DD.json
The source's English version is preferred. Entries with no English version are
machine-translated from the source text, with originals retained in the JSON.
"""

import html
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

import requests

API = "https://bourses-api.campusfrance.org"
CATALOG = "https://campusbourses.campusfrance.org"
TRANSLATE = "https://translate.googleapis.com/translate_a/single"
LEVELS = {1: "Bachelor", 2: "Master", 3: "PhD", 4: "Postdoctoral"}
DOMAINS = {
    10000: "Agronomy - Agroalimentary", 20000: "Architecture - Urban and Regional Planning",
    30000: "Arts - Culture - Design - Fashion", 40000: "Biology", 50000: "Chemistry",
    60000: "Communication - Journalism", 70000: "Law", 80000: "Environment",
    90000: "Computer Science", 100000: "Literature - Languages",
    110000: "Management - Business Administration - Finances", 120000: "Mathematics",
    130000: "Physical Sciences", 140000: "Health - Community Services", 150000: "Education",
    160000: "Engineering", 170000: "Economics - Politics",
    180000: "Humanities - Social Sciences", 190000: "Sports",
    200000: "Tourism and Hospitality - Food Service", 210000: "Transportation - Logistics",
}


def get_json(url, params=None):
    for attempt in range(5):
        try:
            response = requests.get(url, params=params, timeout=35,
                                    headers={"User-Agent": "Daydreaming scholarship catalogue research"})
            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            return response.json()
        except (requests.Timeout, requests.ConnectionError):
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Source unavailable: {url}")


def clean(value):
    value = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", " ",
                   str(value or ""), flags=re.I | re.S)
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", value)).split())


def ids(value):
    return [int(part) for part in str(value or "").split(",") if part.strip().isdigit()]


def english(value):
    value = clean(value)
    if not value:
        return ""
    result = get_json(TRANSLATE, {"client": "gtx", "sl": "auto", "tl": "en", "dt": "t", "q": value})
    translated = clean("".join(part[0] or "" for part in result[0]))
    if not translated:
        raise RuntimeError("Translation service returned empty text")
    return translated


def source_country_names():
    page = requests.get(CATALOG, timeout=35)
    page.raise_for_status()
    match = re.search(r'src="(js/ilangular\.[^"]+\.js)"', page.text)
    if not match:
        raise RuntimeError("CampusBourses country dictionary script not found")
    script = requests.get(f"{CATALOG}/{match.group(1)}", timeout=35)
    script.raise_for_status()
    section = script.content.decode("utf-8").split('boursesearch.iwcountry",[]).factory', 1)[1]
    section = section.split('boursesearch.iwcart",[]).factory', 1)[0]
    names = {int(identifier): html.unescape(label.replace('\\"', '"')) for identifier, label in
             re.findall(r'\{id:(\d+),[^}]*?en:"((?:\\.|[^"\\])*)"', section)}
    if len(names) < 170 or names.get(73) != "Brazil":
        raise RuntimeError(f"CampusBourses country dictionary format changed: {len(names)} names; Brazil={names.get(73)}")
    return names


def record_from_listing(item, country_names):
    identifier = item["bourseId"]
    detail = get_json(f"{API}/sgetgrant/{identifier}/en")
    if detail.get("op") != 1 or detail.get("bourseId") != identifier:
        raise RuntimeError(f"Invalid detail for programme {identifier}")
    fallback = not bool(item.get("fullLang")) or not bool(detail.get("fullLang"))
    original = {
        "title": clean(detail.get("title") or item.get("title")),
        "summary": clean(detail.get("synthese") or item.get("synthese")),
        "amount": clean(detail.get("montant")),
    }
    translated = {key: english(value) for key, value in original.items()} if fallback else original
    level_ids = ids(detail.get("levelListId"))
    domain_ids = ids(detail.get("domainListId"))
    country_ids = ids(detail.get("countryListId"))
    if not translated["title"] or not translated["summary"]:
        raise RuntimeError(f"Missing title or summary for programme {identifier}")
    if any(value not in LEVELS for value in level_ids) or any(value not in DOMAINS for value in domain_ids):
        raise RuntimeError(f"Unknown level/domain for programme {identifier}")
    if any(value not in country_names for value in country_ids):
        raise RuntimeError(f"Unknown country for programme {identifier}")
    return {
        "id": identifier,
        "url": f"{CATALOG}/#/program/{identifier}&lang=en",
        "title": translated["title"],
        "summary": translated["summary"],
        "amount": translated["amount"],
        "deadline": detail.get("dateEnd") or item.get("endAt") or "",
        "study_levels": [LEVELS[value] for value in level_ids],
        "fields_of_study": [DOMAINS[value] for value in domain_ids],
        "country_ids": country_ids,
        "nationalities": [country_names[value] for value in country_ids],
        "brazil_listed": 73 in country_ids,
        "source_has_english_version": not fallback,
        "translation_method": "machine" if fallback else "source_en",
        "source_original": original if fallback else None,
        "source_updated_at": detail.get("updatedAt") or item.get("updatedAt") or "",
    }


def save(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/scrape_campusbourses.py OUTPUT.json")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()) or output.suffix != ".json":
        raise SystemExit("Output must be a JSON path inside this project")
    listing = get_json(f"{API}/sgetgrants/en")
    country_names = source_country_names()
    items = listing.get("programs") or []
    if listing.get("count") != len(items) or len({item["bourseId"] for item in items}) != len(items):
        raise RuntimeError("Incomplete or duplicate CampusBourses listing")
    records = []
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(record_from_listing, item, country_names): item["bourseId"] for item in items}
        for future in as_completed(futures):
            records.append(future.result())
            if len(records) % 25 == 0:
                print(f"Collected {len(records)}/{len(items)}", flush=True)
    records.sort(key=lambda record: record["id"])
    payload = {
        "source": "campusbourses", "source_url": f"{CATALOG}/#/catalog",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "reported_total": listing["count"], "records": records,
    }
    save(output, payload)
    print(f"Saved {len(records)} programmes; {sum(r['translation_method'] == 'machine' for r in records)} translated")


if __name__ == "__main__":
    main()
