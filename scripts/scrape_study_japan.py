"""Collect every English Study in Japan scholarship/tuition-reduction record.

Usage: python scripts/scrape_study_japan.py data/imports/study-japan-YYYY-MM-DD.json
An interrupted collection leaves a resumable .partial.json; do not import it.
"""

import html
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

import requests

BASE = "https://www.studyinjapan.go.jp"
PATH = "/en/search-for-scholarships/"
SEARCH = BASE + PATH + "tuition-reduction_search.php"
DETAIL = BASE + PATH + "detail.php"
PAGE_SIZE = 25
JAPANESE_NOTE = ("本学に正規に入学を認められた外国人留学生が、経済的理由により修学困難となった場合、"
                 "学費の一部又は全部を免除する。身元保証人は国内に居住し、学生の修学及び生活について保証できる者とする。")
ENGLISH_NOTE = ("If an international student admitted as a regular student cannot continue studying "
                "for financial reasons, part or all of the tuition fees may be waived. "
                "The guarantor must reside in Japan and be able to guarantee the student's studies and living expenses.")


def fetch(url, params=None):
    for attempt in range(5):
        try:
            response = requests.get(url, params=params, timeout=60,
                                    headers={"User-Agent": "Daydreaming scholarship catalogue research"})
            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            response.encoding = "utf-8"
            return response.text
        except (requests.Timeout, requests.ConnectionError):
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Source unavailable: {url}")


def plain(markup):
    markup = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", " ",
                    str(markup or ""), flags=re.I | re.S)
    value = html.unescape(re.sub(r"<[^>]+>", " ", markup))
    value = value.translate(str.maketrans({"・": "·", "：": ":", "（": "(", "）": ")"}))
    value = re.sub(r"(\d+)\s*年\s*Year\(s\)", r"\1 Year(s)", value)
    return " ".join(value.split())


def translate_embedded_japanese(value):
    original = value
    value = value.replace(JAPANESE_NOTE, ENGLISH_NOTE).replace("【", "[").replace("】", "]")
    value = re.sub(r"(\d[\d,]*)円", r"\1 yen", value)
    if re.search(r"[\u3040-\u30ff\u4e00-\u9fff]", value):
        raise RuntimeError("Untranslated Japanese prose remains in an English detail record")
    return value, original if value != original else ""


def content(markup, pattern):
    match = re.search(pattern, markup, re.I | re.S)
    return plain(match.group(1)) if match else ""


def class_text(markup, class_name):
    return content(markup, rf'<[\w]+\b[^>]*class="[^"]*\b{re.escape(class_name)}\b[^"]*"[^>]*>(.*?)</[\w]+>')


def table_value(markup, label):
    match = re.search(rf'<tr\b[^>]*>\s*<th\b[^>]*>\s*{re.escape(label)}\s*</th>(.*?)</tr>',
                      markup, re.I | re.S)
    if not match:
        return ""
    values = re.findall(r'<td\b[^>]*>(.*?)</td>', match.group(1), re.I | re.S)
    return plain(values[-1]) if values else ""


def segment(markup, start_pattern, end_pattern):
    match = re.search(start_pattern + r'(.*?)' + end_pattern, markup, re.I | re.S)
    return match.group(1) if match else ""


def page_params(offset):
    return {"lang": "en", "offset": offset, "go": "go" if offset == 0 else "ofs",
            "limit": PAGE_SIZE, "narabikae": 2, "school_name": ""}


def listing_page(offset):
    markup = fetch(SEARCH, page_params(offset))
    total_match = re.search(r'<p\s+class="result-num">.*?class="num">\s*([\d,]+)\s*</span>', markup, re.S)
    if not total_match:
        raise RuntimeError(f"Result count missing at offset {offset}")
    total = int(total_match.group(1).replace(",", ""))
    cards = []
    pattern = r'<a\s+href=[\'"]detail\.php\?lang=en&amp;mid=([^\'"]+)[\'"][^>]*class="school-result-item"[^>]*>(.*?)</a>'
    # The site currently uses a literal & instead of &amp; in these links.
    pattern = pattern.replace('en&amp;mid=', 'en(?:&|&amp;)mid=')
    for match in re.finditer(pattern, markup, re.I | re.S):
        body = match.group(2)
        levels = [plain(item) for item in re.findall(
            r'<li\s+class="target-course-item">(.*?)</li>', body, re.I | re.S)]
        kinds = [plain(item) for item in re.findall(
            r'<li\s+class="scholarship-type-item[^\"]*">(.*?)</li>', body, re.I | re.S)]
        cards.append({"id": match.group(1), "title": class_text(body, "scholarship-name"),
                      "organization": class_text(body, "school-name"),
                      "study_levels": levels, "support_types": kinds,
                      "source_updated_at": class_text(body, "date").split(":")[-1].strip().replace("/", "-")})
    if len(cards) != min(PAGE_SIZE, total - offset):
        raise RuntimeError(f"Expected {min(PAGE_SIZE, total-offset)} cards at {offset}; got {len(cards)}")
    return total, cards


def detail_record(card):
    identifier = card["id"]
    markup = fetch(DETAIL, {"lang": "en", "mid": identifier})
    title = class_text(markup, "mainTitle")
    if title != card["title"]:
        raise RuntimeError(f"Detail title mismatch for {identifier}: {title!r}")
    basic = segment(markup, r'<section\b[^>]*id="nyugaku"[^>]*>', r'</section>')
    recruitment = segment(markup, r'<section\b[^>]*id="jyuken"[^>]*>', r'</section>')
    amount = table_value(basic, "Amount of scholarship (yen)")
    unit = table_value(basic, "Unit of receiving period")
    benefit = table_value(basic, "Benefit period")
    amount_parts = [amount, unit, f"Benefit period: {benefit}" if benefit else ""]
    amount_text = "; ".join(part for part in amount_parts if part)
    tuition = segment(basic, r'<dt>Reduction and exception of tuition</dt>\s*<dd>', r'</dd>')
    tuition_text = plain(tuition)
    if tuition_text and not tuition_text.lower().startswith("no"):
        amount_text += ("; " if amount_text else "") + "Tuition reduction: " + tuition_text
    amount_text, original_amount = translate_embedded_japanese(amount_text)
    region = segment(recruitment, r'<h3\b[^>]*>Designated Region</h3>', r'<h3\b|<section\b|</section>')
    regions = content(region, r'<th\b[^>]*scope="row"[^>]*>(.*?)</th>')
    countries = table_value(recruitment, "Specific countries/regions")
    app = segment(recruitment, r'<h3\b[^>]*>Application period</h3>', r'<h3\b|</section>')
    period = table_value(app, "Period")
    period_note = table_value(app, "Special notes")
    deadline = "; ".join(part for part in [period, period_note] if part)
    major = segment(recruitment, r'<h3\b[^>]*>Major of Study</h3>', r'<h3\b|</section>')
    field = table_value(major, "Note") or table_value(major, "Specifying major subject")
    extra = table_value(recruitment, "Other")
    link = re.search(r'<div\s+class="search-contact-bnr ex-site[^\"]*".*?<a\b[^>]*href="(https?://[^\"]+)"',
                     markup, re.I | re.S)
    application_url = html.unescape(link.group(1)) if link else ""
    return {
        **card, "url": f"{DETAIL}?{urlencode({'lang': 'en', 'mid': identifier})}",
        "description": extra[:1500], "amount": amount_text[:1500], "deadline": deadline[:600],
        "fields_of_study": field[:600], "designated_regions": regions,
        "specific_countries": countries[:1500], "brazil_mentioned": bool(re.search(r'\bBrazil\b', countries, re.I)),
        "application_url": application_url,
        "source_original_amount": original_amount,
    }


def save(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/scrape_study_japan.py OUTPUT.json")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()) or output.suffix != ".json":
        raise SystemExit("Output must be a JSON file inside this project")
    partial = output.with_suffix(".partial.json")
    first_total, first_cards = listing_page(0)
    pages = {0: first_cards}
    offsets = list(range(PAGE_SIZE, first_total, PAGE_SIZE))
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(listing_page, offset): offset for offset in offsets}
        for future in as_completed(futures):
            offset = futures[future]
            total, cards = future.result()
            if total != first_total:
                raise RuntimeError("Result count changed during pagination")
            pages[offset] = cards
            if len(pages) % 5 == 0:
                print(f"Listing pages: {len(pages)}/{len(offsets)+1}", flush=True)
    cards = [card for offset in sorted(pages) for card in pages[offset]]
    if len(cards) != first_total or len({card["id"] for card in cards}) != first_total:
        raise RuntimeError("Incomplete or duplicate listing")
    previous = json.loads(partial.read_text(encoding="utf-8")) if partial.exists() else {}
    done = {record["id"]: record for record in previous.get("records", [])}
    if previous and previous.get("reported_total") != first_total:
        raise RuntimeError("Source total changed since partial collection; review before resuming")
    payload = {"source": "study_japan", "source_url": SEARCH,
               "reported_total": first_total, "fetched_at": datetime.now(timezone.utc).isoformat(),
               "records": list(done.values())}
    remaining = [card for card in cards if card["id"] not in done]
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(detail_record, card): card["id"] for card in remaining}
        try:
            for future in as_completed(futures):
                record = future.result()
                done[record["id"]] = record
                if len(done) % 25 == 0:
                    payload["records"] = sorted(done.values(), key=lambda row: row["id"])
                    save(partial, payload)
                    print(f"Details: {len(done)}/{first_total}", flush=True)
        except Exception:
            payload["records"] = sorted(done.values(), key=lambda row: row["id"])
            save(partial, payload)
            raise
    payload["records"] = sorted(done.values(), key=lambda row: row["id"])
    if len(payload["records"]) != first_total:
        raise RuntimeError("Detail count mismatch")
    save(output, payload)
    if partial.exists():
        partial.unlink()
    print(f"Saved {first_total} records")


if __name__ == "__main__":
    main()
