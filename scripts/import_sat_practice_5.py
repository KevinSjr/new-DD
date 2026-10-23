"""Build SAT Practice Test #5 migration and question crops from user-provided PDFs.

Usage: python scripts/import_sat_practice_5.py TEST.pdf ANSWERS.pdf
Requires PyMuPDF and Pillow. The generated SQL and PNGs are mechanical assets;
always audit the answer key and a sample of crops before publishing.
"""

import json
import re
import sys
from pathlib import Path

import pymupdf

from audit_sat_pdf import choice_texts, image_for_question, question_positions, sql_string


ROOT = Path(__file__).resolve().parent.parent
FORM = "practice-5-paper"
SOURCE = "https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-digital.pdf"
SECTIONS = [
    ("reading-writing", 1, 4, 16, 33, 2, 17),
    ("reading-writing", 2, 18, 31, 33, 18, 33),
    ("math", 1, 32, 41, 27, 34, 41),
    ("math", 2, 42, 50, 27, 42, 50),
]
# Checked against the answer explanations in the user-provided PDF.
# Semicolon separates alternative valid grid-in entries.
KEY = {
    ("reading-writing", 1): "A B B D B D B C B B D A D B C B A B A C A D B D B B D D B D A C D".split(),
    ("reading-writing", 2): "C D A A C C B A A D A D D D D B A A B A C B A C C B C D D A D D A".split(),
    ("math", 1): "C B D B B 4 29 C B B C D 6 4.51;451/100 C D B D A 11/28;.3928;.3929;0.392;0.393 336 B D D A A 25".split(),
    ("math", 2): "B B B B D 6 -30;30 D B A C D 44/3;14.66;14.67 4205 A A B B D 20 66 D D D A C 4176".split(),
}
FULL_WIDTH_PAGES = {10, 24, 25, 26, 38}
FINAL_PAGES = {16, 31, 41, 50}


def answers_from_explanations(pdf, section, module, start, end, maximum):
    joined = "\n".join(pdf[number - 1].get_text() for number in range(start, end + 1))
    parts = re.split(r"(?m)^\s*QUESTION\s+(\d+)\b", joined)
    found = {}
    for index in range(1, len(parts), 2):
        number = int(parts[index])
        content = re.sub(r"\s+", " ", parts[index + 1]).strip()
        if number in found:
            raise ValueError(f"Duplicate answer {section} {module} #{number}")
        found[number] = content
    if sorted(found) != list(range(1, maximum + 1)):
        raise ValueError(f"Missing explanations for {section} {module}: {sorted(found)}")
    for number, content in found.items():
        expected = KEY[(section, module)][number - 1].split(";")
        match = re.search(r"Choice\s+([A-D])\s+is\s+(?:the best answer|correct)", content, re.I)
        if match and (expected != [match.group(1)]):
            raise ValueError(f"Key mismatch {section} {module} #{number}: {expected} != {match.group(1)}")
        if not match and not re.search(r"The correct answer is", content, re.I):
            raise ValueError(f"No answer identified for {section} {module} #{number}")
    return found


def question_rect(positions, index):
    _, page_number, column, top = positions[index]
    next_top = next((item[3] for item in positions[index + 1:] if item[1] == page_number and item[2] == column), None)
    bottom = next_top - 4 if next_top else (610 if page_number in FINAL_PAGES else 715)
    if page_number in FULL_WIDTH_PAGES:
        return pymupdf.Rect(35, top - 3, 578, bottom)
    right = column == 1
    return pymupdf.Rect(316 if right else 35, top - 3, 578 if right else 294, bottom)


def build(test_pdf, answers_pdf):
    output = ROOT / "public" / "sat-assets" / "practice-5"
    output.mkdir(parents=True, exist_ok=True)
    rows = []
    fallbacks = []
    for section, module, first, last, maximum, answer_first, answer_last in SECTIONS:
        key = KEY[(section, module)]
        if len(key) != maximum:
            raise ValueError(f"Key length for {section} {module}: {len(key)}/{maximum}")
        explanations = answers_from_explanations(answers_pdf, section, module, answer_first, answer_last, maximum)
        positions = question_positions(test_pdf, first, last, maximum)
        if [item[0] for item in positions] != list(range(1, maximum + 1)):
            raise ValueError(f"Question positions incomplete in {section} {module}")
        for index, (number, page_number, _, _) in enumerate(positions):
            page = test_pdf[page_number - 1]
            rect = question_rect(positions, index)
            transcribed = page.get_text(sort=True, clip=rect)
            transcribed = re.sub(r"\.{12,}", "", transcribed).replace("\ufffd", "'").strip()
            transcribed = re.sub(r"(?m)^\s*Unauthorized copying or reuse.*$", "", transcribed).strip()
            transcribed = re.sub(r"(?m)^\s*\d+\s*$", "", transcribed, count=1).strip()
            if len(transcribed) < 20:
                raise ValueError(f"Short transcription in {section} {module} #{number}")
            accepted = key[number - 1].split(";")
            numeric = not (len(accepted) == 1 and accepted[0] in "ABCD")
            parsed = choice_texts(transcribed) if not numeric else {}
            choices = []
            if not numeric:
                for letter in "ABCD":
                    option = parsed.get(letter, "")
                    if not option or len(option) > 300 or "....." in option:
                        option = f"Alternativa {letter} (veja a imagem)"
                        fallbacks.append((section, module, number, letter))
                    choices.append({"key": letter, "text": option})
            image_name = f"{'rw' if section == 'reading-writing' else 'math'}-m{module}-q{number:02}.png"
            image_for_question(page, rect, output / image_name)
            explanation = re.split(r"Choice\s+[A-D]\s+is\s+incorrect", explanations[number], maxsplit=1)[0]
            explanation = re.split(r"SAT PRACTICE TEST #5 ANSWER EXPLANATIONS", explanation, maxsplit=1)[0].strip()[:2000]
            if len(explanation) < 15:
                raise ValueError(f"Short explanation in {section} {module} #{number}")
            prompt = "Digite sua resposta para a questão reproduzida na imagem." if numeric else "Escolha a melhor alternativa para a questão reproduzida na imagem."
            values = [
                sql_string(FORM), sql_string(section), str(module), str(number), sql_string(transcribed[:12000]),
                sql_string(prompt), sql_string(json.dumps(choices, ensure_ascii=False)) + "::jsonb",
                sql_string("numeric" if numeric else "multiple-choice"),
                "ARRAY[" + ",".join(sql_string(value) for value in accepted) + "]::text[]",
                sql_string(explanation), sql_string(f"/sat-assets/practice-5/{image_name}"),
                sql_string(SOURCE), str(page_number), sql_string("published"),
            ]
            rows.append("(" + ",".join(values) + ")")
    if len(rows) != 120:
        raise ValueError(f"Expected 120 rows, got {len(rows)}")
    migration = ROOT / "db" / "migrations" / "030_sat_practice_5.sql"
    migration.write_text(
        "-- Generated from the user-provided College Board SAT Practice Test #5 and answer explanations.\n"
        "-- Images preserve charts and notation; text is an automatic transcription.\n"
        "INSERT INTO sat_questions\n"
        "  (form_code,section,module_number,question_number,passage,prompt,choices,answer_type,accepted_answers,explanation,image_path,source_url,source_page,status)\n"
        "VALUES\n" + ",\n".join(rows) + ";\n", encoding="utf-8",
    )
    print(f"Built {len(rows)} questions and {len(list(output.glob('*.png')))} images")
    print(f"Fallback alternative labels: {len(fallbacks)}")
    print(migration)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf")
    build(pymupdf.open(sys.argv[1]), pymupdf.open(sys.argv[2]))
