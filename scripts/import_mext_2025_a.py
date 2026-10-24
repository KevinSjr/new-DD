"""Rebuild the MEXT 2025 Undergraduate A seed and question images from user PDFs.

Usage: python scripts/import_mext_2025_a.py ENGLISH.pdf MATH.pdf JAPANESE.pdf ANSWERS.pdf
The key below was transcribed from the supplied official answer sheets, not inferred.
The importer validates document identity, item counts, point totals and asset creation.
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "mext-assets" / "2025-a"
MIGRATION = ROOT / "db" / "migrations" / "041_mext_2025_a_seed.sql"
SOURCES = {
    "english": "https://www.studyinjapan.go.jp/ja/_mt/2026/10/exam/2025_ga_en(a).pdf",
    "math": "https://www.studyinjapan.go.jp/ja/_mt/2026/10/exam/2025_ga_math(a).pdf",
    "japanese": "https://www.studyinjapan.go.jp/ja/_mt/2026/10/exam/2025_ga_ja(a).pdf",
}
ENGLISH_KEY = {
    "I": "2 4 4 1 2 3 1 3 2 3 3 2 4 2 1".split(),
    "II": "4 2 4 3 1 2 2 2 2 4 2 1 1 4 4".split(),
    "IIIa": "7 11 2 15 4 9 12 1 14 5".split(),
    "IIIb": "9 12 15 1 3 5 6 2 8 10".split(),
    "IV": "4 2 4 3 1".split(),
    "V": "2 1 1 3 3".split(),
    "VI": "F T F T T F F T F T".split(),
}
JAPANESE_KEY = {
    "I": "B D C B C A B A A C B A D C C".split(),
    "II": "C B D B A D C A D B D D A A C".split(),
    "III": "C A B B C A B D B D".split(),
    "IV": "D A C D B".split(),
}
MATH_KEY = {
    "1": [
        ("3", 3), ("2", 3), ("0", 3), ("4", 3), ("126", 4),
        ("-3", 2), ("-4", 2), ("5", 2), ("1/5", 4), ("13", 3),
        ("2", 2), ("-8", 2), ("11", 2), ("5/16", 3), ("67/256", 3),
        ("267/896", 3), ("6", 3), ("-10", 3),
    ],
    "2": [("-2", 3), ("-1", 3), ("1", 3), ("-1", 3), ("-2", 3), ("1", 3), ("1/12", 7)],
    "3": [("0", 2), ("5", 2), ("25/4", 4), ("1", 4), ("1", 3), ("15/4", 5), ("21/4", 5)],
}


def sql(value):
    if isinstance(value, list):
        return "ARRAY[" + ",".join(sql(part) for part in value) + "]::text[]"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def save_image(page, name, rect=None):
    target = ASSETS / f"{name}.jpg"
    pix = page.get_pixmap(matrix=pymupdf.Matrix(1.8, 1.8), clip=rect, alpha=False)
    target.write_bytes(pix.tobytes("jpeg", jpg_quality=86))
    if target.stat().st_size < 1000:
        raise ValueError(f"Empty image: {target}")
    return f"/mext-assets/2025-a/{target.name}"


def page_asset(pdf, subject, page_no):
    name = f"{subject}-p{page_no:02}"
    return save_image(pdf[page_no - 1], name)


def item_crop(pdf, subject, page_no, item, marker_x, next_item=None, max_height=None):
    page = pdf[page_no - 1]
    words = page.get_text("words")
    marker = next((word for word in words if abs(word[0] - marker_x) < 7 and word[4] == item), None)
    if marker is None:
        raise ValueError(f"No {subject} item {item} on page {page_no}")
    start_y = max(0, marker[1] - 4)
    next_marker = next((word for word in words if abs(word[0] - marker_x) < 7 and word[4] == next_item and word[1] > start_y), None)
    end_y = next_marker[1] - 3 if next_marker else min(page.rect.height - 25, max(word[3] for word in words if word[1] > start_y) + 8)
    if max_height is not None:
        end_y = min(end_y, start_y + max_height)
    if end_y - start_y < 20:
        raise ValueError(f"Invalid crop for {subject} {item}")
    rect = pymupdf.Rect(55, start_y, min(page.rect.width - 45, 550), end_y)
    name = f"{subject}-p{page_no:02}-q{item.rstrip('.').zfill(2)}"
    return save_image(page, name, rect), page.get_text(clip=rect, sort=True).strip()


def main(paths):
    if len(paths) != 4:
        raise SystemExit(__doc__)
    pdfs = {name: pymupdf.open(path) for name, path in zip(("english", "math", "japanese", "answers"), paths)}
    expected_pages = {"english": 12, "math": 5, "japanese": 13, "answers": 5}
    for name, expected in expected_pages.items():
        if len(pdfs[name]) != expected:
            raise ValueError(f"{name}: expected {expected} pages, got {len(pdfs[name])}")
    for name in SOURCES:
        cover = pdfs[name][0].get_text()
        if "2025" not in cover:
            raise ValueError(f"{name}: this is not the 2025 edition")
    if "2025" not in unicodedata.normalize("NFKC", pdfs["answers"][0].get_text()):
        raise ValueError("The answer key is not the 2025 edition")
    ASSETS.mkdir(parents=True, exist_ok=True)
    rows = []

    def add(subject, section, item, answer, points, pages, prompt, kind="choice", choice_values=None, crop=None):
        assets = [page_asset(pdfs[subject], subject, page) for page in pages] if crop is None else [crop[0]]
        transcript = "\n\n".join(pdfs[subject][page - 1].get_text(sort=True).strip() for page in pages) if crop is None else crop[1]
        choices = choice_values if choice_values is not None else (["1", "2", "3", "4"] if subject == "english" else ["A", "B", "C", "D"])
        if kind == "numeric":
            choices = []
        if kind == "true-false":
            choices = ["T", "F"]
        rows.append({
            "edition": 2025, "track": "A", "subject": subject, "section": section,
            "item_code": item, "position": len([row for row in rows if row["subject"] == subject]) + 1,
            "prompt": prompt, "transcript": transcript, "asset_paths": assets,
            "answer_type": kind, "choices": choices, "accepted_answers": [answer],
            "points": points, "source_url": SOURCES[subject], "source_page": pages[0],
        })

    english = pdfs["english"]
    for section in ("I", "II"):
        for number, answer in enumerate(ENGLISH_KEY[section], 1):
            if section == "I":
                page = 2 if number <= 9 else 3
                last = 9 if page == 2 else 15
            else:
                page = 4 if number <= 14 else 5
                last = 14 if page == 4 else 15
            crop = item_crop(english, "english", page, str(number) + ".", 71, str(number + 1) + "." if number < last else None)
            add("english", section, str(number), answer, 1, [page], f"Section {section}, question {number}. Select the correct option in the original statement.", crop=crop)
    for section, page in (("IIIa", 6), ("IIIb", 7)):
        for number, answer in enumerate(ENGLISH_KEY[section]):
            letter = chr(ord("A") + number)
            add("english", section, letter, answer, 1, [page], f"Section {section}: choose the numbered word for blank [{letter}].", choice_values=[str(n) for n in range(1, 16)])
    for section, pages in (("IV", [8, 9]), ("V", [10, 11])):
        for number, answer in enumerate(ENGLISH_KEY[section], 1):
            add("english", section, f"Q{number}", answer, 3, pages, f"Section {section}, question {number}. Read the passage and choose an answer.")
    for number, answer in enumerate(ENGLISH_KEY["VI"], 1):
        add("english", "VI", str(number), answer, 2, [12], f"Section VI, statement {number}. True or false?", kind="true-false")

    for section, answers in JAPANESE_KEY.items():
        for number, answer in enumerate(answers, 1):
            if section == "I":
                page = 3 if number <= 8 else 4
                last = 8 if page == 3 else 15
            elif section == "II":
                page = 5 if number <= 4 else 6 if number <= 13 else 7
                last = 4 if page == 5 else 13 if page == 6 else 15
            elif section == "III":
                page = 7 if number <= 2 else 8 if number <= 7 else 9
                last = 2 if page == 7 else 7 if page == 8 else 10
            else:
                page = 12 if number <= 4 else 13
                last = 5
            if section == "IV":
                # The reading passage starts two pages before the questions.
                pages = [10, 11, 12, 13]
                add("japanese", section, f"Q{number}", answer, 4, pages, f"日本語(A) IV・問い{number}。本文を読んで、A〜Dから選んでください。")
            else:
                next_item = str(number + 1) if number < last else "1" if section == "II" and number == 15 else None
                crop = item_crop(pdfs["japanese"], "japanese", page, str(number), 74, next_item, 85 if section == "II" and number == 15 else None)
                add("japanese", section, str(number), answer, 2, [page], f"日本語(A) {section}・問題{number}。A〜Dから選んでください。", crop=crop)

    for section, answers in MATH_KEY.items():
        pages = [2, 3] if section == "1" else [4] if section == "2" else [5]
        for number, (answer, points) in enumerate(answers, 1):
            code = f"[{section}-{number}]"
            add("math", section, code, answer, points, pages, f"Mathematics(A), problem {section}: fill box {code}.", kind="numeric")

    counts = {subject: len([row for row in rows if row["subject"] == subject]) for subject in SOURCES}
    totals = {subject: sum(row["points"] for row in rows if row["subject"] == subject) for subject in SOURCES}
    if counts != {"english": 70, "math": 32, "japanese": 45} or any(value != 100 for value in totals.values()):
        raise ValueError(f"Unexpected questions / points: {counts}, {totals}")
    columns = "edition,track,subject,section,item_code,position,prompt,transcript,asset_paths,answer_type,choices,accepted_answers,points,source_url,source_page,status"
    statements = ["-- Generated from the four supplied MEXT 2025 Undergraduate A PDFs.", "-- Rebuild with: python scripts/import_mext_2025_a.py ENGLISH MATH JAPANESE ANSWERS"]
    for row in rows:
        values = [sql(row[key]) if key != "choices" else sql(json.dumps(row[key])) + "::jsonb" for key in columns.split(",") if key != "status"] + [sql("published")]
        statements.append(f"INSERT INTO mext_questions ({columns}) VALUES ({','.join(values)});" )
    MIGRATION.write_text("\n".join(statements) + "\n", encoding="utf-8")
    print(f"Built {len(rows)} questions; counts={counts}; points={totals}; migration={MIGRATION}")


if __name__ == "__main__":
    main(sys.argv[1:])
