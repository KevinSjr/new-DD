"""Collect the complete ScholarshipChina scholarship-program listing.

Usage: python scripts/scrape_scholarship_china.py data/imports/scholarship-china-YYYY-MM-DD.json
Only the public listing is collected. Individual programme requirements and fees
must be checked on the linked detail page before an application.
"""

import json
import math
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

import requests

API = "https://center.istudyedu.com/api/sc/products"
DETAIL = "https://scholarshipchina.com/scholarship/details?id="
PAGE_SIZE = 500
HEADERS = {
    "Accept": "application/x.istudyerp.v1+json",
    "User-Agent": "Daydreaming scholarship catalogue research",
}


def fetch_page(page):
    params = {"type": 1, "page": page, "limit": PAGE_SIZE,
              "is_accept_minors": 9, "is_need_csca": 9}
    for attempt in range(5):
        try:
            response = requests.get(API, params=params, headers=HEADERS, timeout=60)
            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            payload = response.json()
            if payload.get("code") != 200 or not isinstance(payload.get("data"), list):
                raise ValueError(f"Unexpected API response on page {page}")
            return payload
        except (requests.Timeout, requests.ConnectionError):
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Page {page} unavailable")


def english_text(value):
    text = str(value or "").strip()
    if re.search(r"[\u3400-\u9fff\u3040-\u30ff]", text):
        extracted = re.sub(r"[\u3400-\u9fff\u3040-\u30ff\uff08\uff09]+", " ", text)
        extracted = " ".join(extracted.split()).strip(" -—,;:()")
        if not re.search(r"[A-Za-z]{3}", extracted):
            raise ValueError(f"No English segment in source text: {text[:120]}")
        return extracted
    return text


def normalize(row):
    identifier = row.get("id")
    if not isinstance(identifier, int) or identifier <= 0:
        raise ValueError("Listing record has no numeric ID")
    title = english_text(row.get("en_name"))
    if not title:
        raise ValueError(f"Record {identifier} has no English title")
    year = row.get("arrival_year")
    if year is not None and (not isinstance(year, int) or not 2000 <= year <= 2100):
        raise ValueError(f"Record {identifier} has invalid intake year")
    keys = {"product_sn": "program_id", "school_name": "institution", "city": "city",
            "province": "province", "subject": "field_of_study", "education": "study_level",
            "language": "teaching_language", "arrival_season": "intake_season",
            "scholarship_type": "scholarship_type", "tuition_fee": "regular_tuition",
            "tuition_last_fee": "tuition_after_scholarship", "tuition_fee_unit": "regular_tuition_unit",
            "tuition_last_fee_unit": "tuition_after_unit", "scholarship_room_fee": "accommodation_after_scholarship",
            "end_at": "deadline_text"}
    deadline = english_text(row.get("end_at"))
    try:
        deadline_date = datetime.strptime(deadline, "%b %d,%Y").date().isoformat() if deadline else None
    except ValueError:
        deadline_date = None
    original = {"title": row.get("en_name") or ""}
    record = {"id": str(identifier), "url": DETAIL + str(identifier),
              "title": title, "intake_year": year, "deadline_date": deadline_date}
    for source_key, normalized in keys.items():
        raw = str(row.get(source_key) or "").strip()
        record[normalized] = english_text(raw)
        if raw != record[normalized]:
            original[normalized] = raw
    if title == original["title"]:
        original.pop("title")
    record["source_original"] = original or None
    record["translation_method"] = "source_en_extract" if original else "source_en"
    return record


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/scrape_scholarship_china.py OUTPUT.json")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()) or output.suffix != ".json":
        raise SystemExit("Output must be a JSON file inside this project")
    raw_path = output.with_suffix(".raw.partial.json")
    if raw_path.exists():
        raw = json.loads(raw_path.read_text(encoding="utf-8"))
        first = raw["pages"]["1"]
        collected = {int(page): result for page, result in raw["pages"].items()}
    else:
        first = fetch_page(1)
        collected = {1: first}
    total = first.get("total")
    pages = first.get("total_pages")
    if not isinstance(total, int) or total <= 0 or pages != math.ceil(total / PAGE_SIZE):
        raise ValueError("Invalid listing count or pagination")
    if not raw_path.exists():
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = {executor.submit(fetch_page, page): page for page in range(2, pages + 1)}
            for future in as_completed(futures):
                page = futures[future]
                collected[page] = future.result()
                print(f"Collected page {page}/{pages}", flush=True)
        raw_path.parent.mkdir(parents=True, exist_ok=True)
        raw_path.write_text(json.dumps({"pages": collected}, ensure_ascii=False), encoding="utf-8")
    records = []
    for page in range(1, pages + 1):
        payload = collected[page]
        expected = min(PAGE_SIZE, total - (page - 1) * PAGE_SIZE)
        if payload.get("total") != total or payload.get("total_pages") != pages or len(payload["data"]) != expected:
            raise ValueError(f"Listing changed or page {page} is incomplete")
        records.extend(normalize(row) for row in payload["data"])
    if len(records) != total or len({record["id"] for record in records}) != total:
        raise ValueError("Duplicate or missing programme IDs")
    result = {"source": "scholarship_china", "listing_url": "https://scholarshipchina.com/scholarship?type=1",
              "api_url": API, "fetched_at": datetime.now(timezone.utc).isoformat(),
              "reported_total": total, "records": records}
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(".partial.json")
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(output)
    print(f"Saved {total} scholarship programmes to {output}")


if __name__ == "__main__":
    main()
