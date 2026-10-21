"""Collect the public Study in Korea scholarship search and linked university records."""

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

ROOT = "https://www.studyinkorea.go.kr"
LISTING = ROOT + "/ko/search_v1.do"
DETAIL = ROOT + "/ko/search/universityInfo.do"
TRANSLATE = "https://translate.googleapis.com/translate_a/single"
PAGE_SIZE = 100
HEADERS = {"User-Agent": "Daydreaming scholarship catalogue research"}


def request(method, url, **kwargs):
    for attempt in range(5):
        try:
            response = requests.request(method, url, timeout=40, headers=HEADERS, **kwargs)
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


def english(value, originals, field):
    value = clean(value)
    if not re.search(r"[\uac00-\ud7af]", value):
        return value
    originals[field] = value
    response = request("GET", TRANSLATE, params={"client": "gtx", "sl": "ko", "tl": "en", "dt": "t", "q": value})
    result = clean("".join(part[0] or "" for part in response.json()[0]))
    if not result or re.search(r"[\uac00-\ud7af]", result):
        raise ValueError(f"Translation failed: {field}")
    return result


def listing_page(page):
    body = request("POST", LISTING, data={"menu": "장학금", "section": "", "nh": PAGE_SIZE,
                                          "st": page, "rf": "@date", "field": "@all"}).text
    total_match = re.search(r'<span class="total">\s*(\d+)\s*</span>', body)
    if not total_match or 'title="Menu \'장학금\' Search"' not in body:
        raise ValueError(f"Scholarship search changed on page {page}")
    total = int(total_match.group(1))
    cards = re.findall(r'<div class="card-title-item">(.*?)(?=<div class="card-title-item">|<div class="board-pagination)', body, re.S)
    records = []
    for card in cards:
        link = re.search(r'<a href="([^"]*scholarshipId=(?:SCL_)?\d+)"', card)
        university = re.search(r'<strong class="notranslate">(.*?)</strong>', card, re.S)
        title = re.search(r'<span class="title">(.*?)(?:</span>|</p>)', card, re.S)
        updated = re.search(r'Last update\s*:\s*<span>(\d{4}/\d{2}/\d{2})</span>', card)
        location = re.search(r'<p class="local">(.*?)</p>', card, re.S)
        criteria = re.search(r'<strong>Eligibility for application</strong>\s*<div class="division-items">\s*<p>(.*?)</p>', card, re.S)
        univ = re.search(r'<div class="universityCode"[^>]*>(\d+)</div>', card)
        if not all((link, university, title, univ)):
            raise ValueError(f"Incomplete card on page {page}: link={bool(link)} university={bool(university)} "
                             f"title={bool(title)} code={bool(univ)} sample={card[:350]!r}")
        identifier = link.group(1).split("scholarshipId=", 1)[1]
        originals = {}
        records.append({
            "id": identifier, "university_id": univ.group(1),
            "url": urljoin(ROOT, html.unescape(link.group(1))),
            "title": english(title.group(1), originals, "title"),
            "institution": english(university.group(1), originals, "institution"),
            "location": english(location.group(1) if location else "", originals, "location"),
            "listing_eligibility": english(criteria.group(1) if criteria else "", originals, "listing_eligibility"),
            "source_updated_at": updated.group(1).replace("/", "-") if updated else None,
            "source_original": originals,
        })
    expected = min(PAGE_SIZE, total - (page - 1) * PAGE_SIZE)
    if len(records) != expected:
        raise ValueError(f"Page {page}: expected {expected} cards, found {len(records)}")
    return total, records


def university_details(university_id, sample_id):
    body = request("GET", DETAIL, params={"tab": "univ-basic-info", "univCd": university_id,
                                          "scholarshipId": sample_id}).text
    blocks = re.findall(r'<div id="scholarship-((?:SCL_)?\d+)"[^>]*>(.*?)(?=<div id="scholarship-|</section>)', body, re.S)
    if not blocks or sample_id not in {identifier for identifier, _ in blocks}:
        raise ValueError(f"Scholarship detail unavailable: {sample_id}")
    result = {}
    for identifier, block in blocks:
        items = {}
        for label, value in re.findall(r'<p class="title">(.*?)</p>\s*<(?:p|div) class="desc(?: [^"]*)?">(.*?)(?=</p>|</div>)', block, re.S):
            items[clean(label).lower()] = clean(value)
        result[identifier] = items
    return result


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/scrape_study_korea.py data/imports/study-korea-YYYY-MM-DD.json")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()) or output.suffix != ".json":
        raise SystemExit("Output must be JSON inside this project")
    checkpoint = output.with_suffix(".partial.json")
    if checkpoint.exists():
        saved = json.loads(checkpoint.read_text(encoding="utf-8"))
        total, pages, details = saved["total"], saved["pages"], saved["details"]
    else:
        total, first = listing_page(1)
        pages, details = {"1": first}, {}
    page_count = math.ceil(total / PAGE_SIZE)
    for page in range(1, page_count + 1):
        if str(page) not in pages:
            observed, records = listing_page(page)
            if observed != total:
                raise ValueError("Listing total changed during collection")
            pages[str(page)] = records
            checkpoint.parent.mkdir(parents=True, exist_ok=True)
            checkpoint.write_text(json.dumps({"total": total, "pages": pages, "details": details}, ensure_ascii=False), encoding="utf-8")
            print(f"Listing page {page}/{page_count}", flush=True)
    records = [record for page in range(1, page_count + 1) for record in pages[str(page)]]
    if len(records) != total or len({r["id"] for r in records}) != total:
        raise ValueError("Duplicate or missing scholarship IDs")
    universities = {}
    for record in records:
        universities.setdefault(record["university_id"], record["id"])
    pending = [(univ, sample) for univ, sample in universities.items() if univ not in details]
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(university_details, univ, sample): univ for univ, sample in pending}
        for future in as_completed(futures):
            univ = futures[future]
            details[univ] = future.result()
            checkpoint.write_text(json.dumps({"total": total, "pages": pages, "details": details}, ensure_ascii=False), encoding="utf-8")
            if len(details) % 10 == 0:
                print(f"University details {len(details)}/{len(universities)}", flush=True)
    for record in records:
        items = details[record["university_id"]].get(record["id"])
        if items is None:
            raise ValueError(f"Scholarship {record['id']} absent from university detail")
        originals = record["source_original"]
        record["qualifications"] = english(items.get("qualifications", ""), originals, "qualifications")
        record["benefits"] = english(items.get("scholarship benefits", ""), originals, "benefits")
        record["personal_support"] = english(items.get("personal support amount", ""), originals, "personal_support")
        record["translation_method"] = "machine" if originals else "source_en"
        record["source_original"] = originals or None
    result = {"source": "study_korea", "listing_url": LISTING,
              "fetched_at": datetime.now(timezone.utc).isoformat(),
              "reported_total": total, "records": records}
    temporary = output.with_suffix(".writing.json")
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(output)
    print(f"Saved {total} scholarships from {len(universities)} universities to {output}")


if __name__ == "__main__":
    main()
