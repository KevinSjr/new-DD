"""Build MEXT 2025 Undergraduate B questions from the seven supplied PDFs.

Usage: python scripts/import_mext_2025_b.py JAPANESE ENGLISH MATH PHYSICS CHEMISTRY BIOLOGY ANSWERS
Keys and weights below were transcribed from the supplied answer booklet. The PDF
images remain the authoritative rendering of formulas, figures and Japanese text.
"""

import json
import sys
import unicodedata
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public/mext-assets/2025-b"
MIGRATION = ROOT / "db/migrations/043_mext_2025_b_seed.sql"
IMAGE_UPDATE = ROOT / "db/migrations/044_mext_2025_b_japanese_crops.sql"
BASE = "https://www.studyinjapan.go.jp/ja/_mt/2026/10/exam/"
FILES = {
    "japanese": "2025_ga_ja(b).pdf", "english": "2025_ga_en(b).pdf",
    "math": "2025_ga_math(b).pdf", "physics": "2025_ga_phy.pdf",
    "chemistry": "2025_ga_che.pdf", "biology": "2025_ga_bio.pdf",
}
PAGES = {"japanese": 11, "english": 14, "math": 3, "physics": 13, "chemistry": 8, "biology": 11, "answers": 10}
ENGLISH = {
    "I": "C D A B A D A D B B", "II": "A B A C B C C B C D",
    "III": "C D B A A B D B D C", "IV": "B A D B A A A C C C",
    "V-I": "A C B C D", "V-II": "B A D B C",
}
JAPANESE = {
    "I": "C D D C B C B D A C C B A D B A A",
    "II": "D D A B D A B B A A C D B A C D A",
    "III": "C D A B D B C B D C",
    "IV": "C D A A",
}
PHYSICS = {
    "1": "a d d e b", "2": "c f a e c", "3": "b f d c c",
    "4": "f b e b e", "5": "f a e c",
}
BIOLOGY = {
    "I-1": "B S E Q V O F C X L K J", "I-2": "F T T F",
    "I-3": "A L H J R U Q N O G P W", "I-4": "T F T T F",
    "II-1": "Q P E N D O A S T R", "II-2": "G", "II-3": "C H",
    "II-4": "T T F F", "II-5": "T F F",
    "III-1": "C", "III-2": "D", "III-3": "B", "III-4": "E", "III-5": "D",
    "III-6": "P L O S A H U N M D Q J I C K",
}


def sql(value):
    if isinstance(value, list):
        return "ARRAY[" + ",".join(sql(part) for part in value) + "]::text[]"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def main(paths):
    if len(paths) != 7:
        raise SystemExit(__doc__)
    docs = dict(zip((*FILES, "answers"), (pymupdf.open(path) for path in paths)))
    for subject, doc in docs.items():
        if len(doc) != PAGES[subject] or "2025" not in unicodedata.normalize("NFKC", doc[0].get_text()):
            raise ValueError(f"Wrong PDF for {subject}: expected 2025 with {PAGES[subject]} pages")
    ASSETS.mkdir(parents=True, exist_ok=True)
    page_paths = {}
    for subject, doc in docs.items():
        if subject == "answers":
            continue
        for page_no in range(2, len(doc) + 1):
            name = f"{subject}-p{page_no:02}.jpg"
            target = ASSETS / name
            target.write_bytes(doc[page_no - 1].get_pixmap(matrix=pymupdf.Matrix(1.7, 1.7), alpha=False).tobytes("jpeg", jpg_quality=85))
            if target.stat().st_size < 1000:
                raise ValueError(f"Empty image: {target}")
            page_paths[subject, page_no] = f"/mext-assets/2025-b/{name}"

    rows = []

    def japanese_crop(section, number, page_no, next_number=None, max_height=None):
        page = docs["japanese"][page_no - 1]
        markers = [word for word in page.get_text("words") if abs(word[0] - 74) <= 7 and word[4] == str(number)]
        if len(markers) != 1:
            raise ValueError(f"Japanese {section}-{number}: expected one item marker on page {page_no}, got {len(markers)}")
        start_y = max(0, markers[0][1] - 7)
        next_markers = [word for word in page.get_text("words") if abs(word[0] - 74) <= 7 and word[4] == str(next_number) and word[1] > start_y] if next_number else []
        end_y = next_markers[0][1] - 6 if next_markers else page.rect.height - 36
        if max_height:
            end_y = min(end_y, start_y + max_height)
        rect = pymupdf.Rect(55, start_y, page.rect.width - 45, end_y)
        name = f"japanese-{section.lower()}-q{number:02}.jpg"
        target = ASSETS / name
        target.write_bytes(page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=rect, alpha=False).tobytes("jpeg", jpg_quality=88))
        if target.stat().st_size < 1000:
            raise ValueError(f"Empty Japanese crop: {target}")
        return f"/mext-assets/2025-b/{name}", page.get_text(clip=rect, sort=True).strip()

    def add(subject, section, code, answer, points, pages, choices=None, kind="choice", prompt=None):
        if isinstance(answer, str):
            answer = [answer]
        if isinstance(pages, int):
            pages = [pages]
        if choices is None:
            choices = [] if kind in ("numeric", "text") else ["T", "F"] if kind == "true-false" else ["A", "B", "C", "D"]
        rows.append({
            "edition": 2025, "track": "B", "subject": subject, "section": section,
            "item_code": code, "position": sum(row["subject"] == subject for row in rows) + 1,
            "prompt": prompt or f"Prova de { {'japanese':'Japonês', 'english':'Inglês', 'math':'Matemática', 'physics':'Física', 'chemistry':'Química', 'biology':'Biologia'}[subject] } B, seção {section}, item {code}. Consulte o enunciado original.",
            "transcript": "\n\n".join(docs[subject][n-1].get_text(sort=True).strip() for n in pages),
            "asset_paths": [page_paths[subject, n] for n in pages],
            "answer_type": kind, "choices": choices, "accepted_answers": answer,
            "points": points, "source_url": BASE + FILES[subject], "source_page": pages[0],
        })

    for section, values in ENGLISH.items():
        for n, answer in enumerate(values.split(), 1):
            if section == "I":
                pages = [2] if n <= 5 else [3]
            elif section == "II":
                pages = [3, 4]
            elif section == "III":
                pages = [5] if n <= 5 else [6]
            elif section == "IV":
                pages = [7] if n <= 5 else [8]
            elif section == "V-I":
                pages = list(range(8, 12))
            else:
                pages = list(range(11, 15))
            add("english", section, str(n), answer, 2, pages)

    for section, values in JAPANESE.items():
        for n, answer in enumerate(values.split(), 1):
            if section == "I":
                page = 3 if n <= 8 else 4
                last = 8 if page == 3 else 17
            elif section == "II":
                page = 5 if n <= 6 else 6 if n <= 16 else 7
                last = 6 if page == 5 else 16 if page == 6 else 17
            elif section == "III":
                page = 7 if n <= 2 else 8 if n <= 7 else 9
                last = 2 if page == 7 else 7 if page == 8 else 10
            else:
                page, last = 10, 4
            pages = [10, 11] if section == "IV" else [page]
            add("japanese", section, str(n), answer, 3 if section == "IV" else 2, pages)
            if section != "IV":
                path, transcript = japanese_crop(section, n, page, n + 1 if n < last else None, 100 if section == "II" and n == 17 else 130 if n == last else None)
                rows[-1]["asset_paths"] = [path]
                rows[-1]["transcript"] = transcript

    math = [
        ("1", "(1)-i", ["5/6", "log8(4sqrt2)", "log_8(4sqrt(2))"], "numeric"),
        ("1", "(1)-ii", ["root4(10)/2", "10^(1/4)/2", "sqrt(sqrt(10))/2"], "text"),
        ("1", "(2)", ["sqrt(3)", "√3"], "text"),
        ("1", "(3)", ["(-1,2)", "x=-1,y=2", "-1,2"], "text"),
        ("1", "(4)", ["40/9", "4.444"], "numeric"),
        ("1", "(5)-i", ["5/8"], "numeric"),
        ("1", "(5)-ii", ["n+7"], "text"),
        ("1", "(6)-i", ["-7"], "numeric"),
        ("1", "(6)-ii", ["5"], "numeric"),
        ("2", "(1)-i", ["2"], "numeric"),
        ("2", "(1)-ii", ["3/2"], "numeric"),
        ("2", "(1)-iii", ["8/3", "2.666"], "numeric"),
        ("2", "(2)-i", ["sqrt(e)", "√e", "e^(1/2)"], "text"),
        ("2", "(2)-ii", ["2"], "numeric"),
        ("3", "(1)", ["46"], "numeric"),
        ("3", "(2)-i", ["22"], "numeric"),
        ("3", "(2)-ii", ["99"], "numeric"),
        ("3", "(3)-i", ["26"], "numeric"),
        ("3", "(3)-ii", ["28"], "numeric"),
        ("3", "(3)-iii", ["52"], "numeric"),
    ]
    for section, code, answer, kind in math:
        add("math", section, code, answer, 5, 2 if section == "1" else 3, kind=kind)

    for section, values in PHYSICS.items():
        pages = {"1": list(range(2, 6)), "2": [6, 7], "3": [8, 9], "4": [10, 11], "5": [12, 13]}[section]
        for n, answer in enumerate(values.split(), 1):
            add("physics", section, f"({n})", answer, 5 if section == "5" else 4, pages, choices=list("abcdef"))

    for n, answer in enumerate("4 1 2 4 4 1 3".split(), 1):
        add("chemistry", "I", f"({n})", answer, 2, 2 if n <= 5 else 3, choices=list("1234"))
    chem = [
        ("II", "(A)", ["PbO2+4H+ +SO4^2-+2e- ->PbSO4+2H2O"], 4, 3, "text"),
        ("II", "(a)", ["48", "4.8*10^1"], 4, 3, "numeric"),
        ("II", "(b)", ["1"], 3, 3, "numeric"),
        ("II", "(c)", ["2"], 3, 3, "numeric"),
        ("II", "(d)", ["4"], 3, 3, "numeric"),
        ("II", "(e)", ["0.23", "2.3*10^-1"], 4, 3, "numeric"),
        ("III", "(1)", ["NaHCO3+HCl->NaCl+H2O+CO2"], 3, 4, "text"),
        ("III", "(2)", ["B"], 2, 4, "choice"),
        ("III", "(3)", ["C"], 2, 4, "choice"),
        ("III", "(4)-i", ["B"], 2, 4, "choice"),
        ("III", "(4)-ii", ["E"], 2, 4, "choice"),
        ("III", "(5)", ["0.5", "5*10^-1"], 4, 4, "numeric"),
        ("IV", "(1)-A", ["0.4"], 3, 5, "numeric"),
        ("IV", "(1)-B", ["0.2"], 3, 5, "numeric"),
        ("IV", "(2-1)-CH3COOH", ["C(1-alpha)", "C(1-α)"], 2, 5, "text"),
        ("IV", "(2-1)-CH3COO", ["Calpha", "Cα"], 2, 5, "text"),
        ("IV", "(2-1)-H", ["Calpha", "Cα"], 2, 5, "text"),
        ("IV", "(2-2)-K", ["Calpha^2/(1-alpha)", "Cα^2/(1-α)"], 2, 5, "text"),
        ("IV", "(2-2)-approx", ["Calpha^2", "Cα^2"], 2, 5, "text"),
        ("IV", "(2-3)-H", ["0.0005", "5*10^-4"], 2, 5, "numeric"),
        ("IV", "(2-3)-pH", ["3.3"], 2, 5, "numeric"),
        ("V", "(1)", ["c"], 2, 6, "choice"),
        ("V", "(2)", ["d"], 2, 6, "choice"),
        ("V", "(3-1)", ["C4H4O4"], 3, [6, 7], "text"),
        ("V", "(3-2)", ["1"], 2, [6, 7], "choice"),
        ("V", "(3-3)", ["3"], 3, 7, "numeric"),
        ("V", "(3-4)", ["5"], 3, 7, "numeric"),
        ("V", "(4)", ["217", "2.17*10^2"], 3, 7, "numeric"),
        ("V", "(5-1)", ["4"], 2, 7, "choice"),
        ("V", "(5-2)", ["4"], 2, [7, 8], "choice"),
        ("V", "(6)", ["3"], 2, 8, "choice"),
        ("V", "(7-1)", ["C8H14N4O5"], 3, 8, "text"),
        ("V", "(7-2)", ["22.8"], 3, 8, "numeric"),
    ]
    for section, code, answers, points, pages, kind in chem:
        options = list("ABC") if section == "III" and code in ("(2)", "(3)") else list("ABCD") if section == "III" and code == "(4)-i" else list("EFGH") if section == "III" and code == "(4)-ii" else list("abcdef") if section == "V" and code in ("(1)", "(2)") else list("123456") if section == "V" and code == "(5-2)" else list("12345")
        add("chemistry", section, code, answers, points, pages, choices=options if kind == "choice" else None, kind=kind)

    biology_pages = {
        "I-1": [2, 3], "I-2": [3], "I-3": [4], "I-4": [5],
        "II-1": [6], "II-2": [6, 7], "II-3": [7], "II-4": [8], "II-5": [8],
        "III-1": [9], "III-2": [9], "III-3": [9, 10], "III-4": [9, 10], "III-5": [9, 10], "III-6": [11],
    }
    for section, values in BIOLOGY.items():
        for n, answer in enumerate(values.split(), 1):
            code = f"({n})" if len(values.split()) > 1 else "1"
            points = 1 if section in ("I-1", "I-3", "II-4", "II-5", "III-6") else 2
            kind = "true-false" if section in ("I-2", "I-4", "II-4", "II-5") else "choice"
            choices = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ") if kind == "choice" else None
            if section == "II-3":
                choices = list("ABCDEFGHI")
            if section.startswith("III-") and section != "III-6":
                choices = list("ABCDE")
            add("biology", section, code, ["C", "H"] if section == "II-3" else answer, points, biology_pages[section], choices=choices, kind=kind)

    expected = {"japanese": 48, "english": 50, "math": 20, "physics": 24, "chemistry": 40, "biology": 73}
    counts = {subject: sum(row["subject"] == subject for row in rows) for subject in FILES}
    totals = {subject: sum(row["points"] for row in rows if row["subject"] == subject) for subject in FILES}
    if counts != expected or any(value != 100 for value in totals.values()):
        raise ValueError(f"Unexpected counts or weights: {counts}, {totals}")
    columns = "edition,track,subject,section,item_code,position,prompt,transcript,asset_paths,answer_type,choices,accepted_answers,points,source_url,source_page,status"
    statements = ["-- Generated from the seven supplied MEXT 2025 Undergraduate B PDFs.", "-- Rebuild with scripts/import_mext_2025_b.py and the source PDFs in the documented order."]
    for row in rows:
        values = [sql(row[key]) if key != "choices" else sql(json.dumps(row[key])) + "::jsonb" for key in columns.split(",") if key != "status"] + [sql("published")]
        statements.append(f"INSERT INTO mext_questions ({columns}) VALUES ({','.join(values)});")
    MIGRATION.write_text("\n".join(statements) + "\n", encoding="utf-8")
    updates = ["-- Bring existing MEXT B installations in line with the per-item Japanese crops."]
    for row in rows:
        if row["subject"] == "japanese" and row["section"] != "IV":
            updates.append(
                f"UPDATE mext_questions SET transcript={sql(row['transcript'])}, asset_paths={sql(row['asset_paths'])} "
                f"WHERE edition=2025 AND track='B' AND subject='japanese' AND section={sql(row['section'])} AND item_code={sql(row['item_code'])};"
            )
    IMAGE_UPDATE.write_text("\n".join(updates) + "\n", encoding="utf-8")
    print(f"Built {len(rows)} questions; counts={counts}; points={totals}; migration={MIGRATION}")


if __name__ == "__main__":
    main(sys.argv[1:])
