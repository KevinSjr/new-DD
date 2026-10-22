"""Audit the question positions and official answers in SAT Practice Test 4 PDFs.

Usage: python scripts/audit_sat_pdf.py TEST.pdf ANSWERS.pdf
Requires PyMuPDF (install outside the repository or provide PYTHONPATH).
"""

import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageChops


SECTIONS = [
    ("reading-writing", 1, 4, 17, 33, 2, 17),
    ("reading-writing", 2, 18, 30, 33, 18, 33),
    ("math", 1, 34, 39, 27, 34, 43),
    ("math", 2, 42, 48, 27, 44, 53),
]

# Official key, worksheet page 4:
# https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf
OFFICIAL_KEY = {
    ("reading-writing", 1): "B A A C A B D B B D C D A B C A A A A D D D B C B A C D A A D D C".split(),
    ("reading-writing", 2): "D D B B B B A C C A A B D C C A B D C A B D D A B B A A C C A A B".split(),
    ("math", 1): "B A B D A 9 10 A B D A C 1/5;.2 80 D B B A C 100 361/8;45.12;45.13 B D C C D 5".split(),
    ("math", 2): "B B C A A 15;-5 50 B D A A B .3;3/10 2 A C B D A 15/17;.8824;.8823 51 A C C D B 600".split(),
}


def question_positions(pdf, start, end, maximum):
    found = []
    for number in range(start, end + 1):
        page = pdf[number - 1]
        words = page.get_text("words")
        labels = []
        for x0, y0, _, _, value, *_ in words:
            if not value.isdigit() or not 1 <= int(value) <= maximum or not 110 <= y0 <= 705:
                continue
            column = 0 if (39 <= x0 <= 44 or 57 <= x0 <= 61) else 1 if (317 <= x0 <= 322 or 335 <= x0 <= 340) else None
            if column is not None:
                labels.append((int(value), number, column, round(y0, 2)))
        found.extend(sorted(labels, key=lambda row: (row[2], row[3])))
    return found


def question_rect(positions, index):
    _, page_number, column, top = positions[index]
    following = next((item[3] for item in positions[index + 1:] if item[1] == positions[index][1] and item[2] == column), None)
    if not any(item[1] == positions[index][1] and item[2] == 1 for item in positions) and column == 0:
        return pymupdf.Rect(35, top - 3, 578, 580 if page_number == 23 else 715)
    right = column == 1
    final_page = page_number in (17, 30, 39, 48)
    return pymupdf.Rect(316 if right else 35, top - 3, 578 if right else 294, (following - 4) if following else (610 if final_page else 715))


def choice_texts(text):
    markers = list(re.finditer(r"(?m)^\s*([A-D])\)\s*", text))
    found = {}
    for index, marker in enumerate(markers):
        end = markers[index + 1].start() if index + 1 < len(markers) else len(text)
        found[marker.group(1)] = re.sub(r"\s+", " ", text[marker.end():end]).strip()
    return found


def answer_sections(pdf):
    result = {}
    for section, module, _, _, maximum, start, end in SECTIONS:
        chunks = []
        for number in range(start, end + 1):
            chunks.append(pdf[number - 1].get_text(sort=True))
        joined = "\n".join(chunks)
        parts = re.split(r"(?m)^\s*QUESTION\s+(\d+)\b[^\n]*\n", joined)
        answers = {}
        for index in range(1, len(parts), 2):
            question = int(parts[index])
            content = re.sub(r"\s+", " ", parts[index + 1]).strip()
            answer_match = re.search(r"(?:Choice\s+([A-D])\s+is\s+(?:(?:\d+\s*)?correct|the best answer)|The correct answer is\s+(.+?)(?:\.|\s+It|\s+This))", content, re.I)
            answers[question] = (answer_match.groups() if answer_match else None, content)
        result[(section, module)] = answers
        print(f"ANSWERS {section} {module}: {len(answers)}/{maximum}")
        print(f"OFFICIAL KEY {section} {module}: {len(OFFICIAL_KEY[(section, module)])}/{maximum}")
        for number in range(1, maximum + 1):
            if number not in answers or answers[number][0] is None:
                print("  NEEDS REVIEW", number, str(answers.get(number))[:200])
            elif len(OFFICIAL_KEY[(section, module)]) == maximum:
                from_explanation = answers[number][0][0] or answers[number][0][1]
                from_key = OFFICIAL_KEY[(section, module)][number - 1]
                if from_explanation and from_explanation not in from_key.split(";"):
                    print("  KEY MISMATCH", number, from_explanation, from_key)
    return result


def sql_string(value):
    return "'" + value.replace("'", "''") + "'"


def image_for_question(page, rect, destination):
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=rect, alpha=False)
    image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    bounds = ImageChops.difference(image, Image.new("RGB", image.size, "white")).getbbox()
    if not bounds:
        raise ValueError(f"Question image is blank: {destination}")
    image = image.crop((max(0, bounds[0] - 12), max(0, bounds[1] - 8), min(image.width, bounds[2] + 12), min(image.height, bounds[3] + 12)))
    image.save(destination, optimize=True)
    return image.size


def build(question_pdf, answers, root):
    import json

    assets = root / "public" / "sat-assets" / "practice-4"
    assets.mkdir(parents=True, exist_ok=True)
    rows = []
    choice_fallbacks = []
    for section, module, start, end, maximum, _, _ in SECTIONS:
        positions = question_positions(question_pdf, start, end, maximum)
        if [item[0] for item in positions] != list(range(1, maximum + 1)):
            raise ValueError(f"Question order incomplete in {section} module {module}")
        for index, (number, page_number, _, _) in enumerate(positions):
            if section == "reading-writing" and module == 1 and number <= 5:
                continue
            page = question_pdf[page_number - 1]
            rect = question_rect(positions, index)
            text = page.get_text(sort=True, clip=rect)
            text = re.sub(r"\.{12,}", "", text).replace("\ufffd", "'").strip()
            text = re.sub(r"(?m)^\s*Unauthorized copying or reuse.*$", "", text).strip()
            text = re.sub(r"(?m)^\s*\d+\s*$", "", text, count=1).strip()
            if len(text) < 20:
                raise ValueError(f"Transcription too short for {section} {module} #{number}")
            key = OFFICIAL_KEY[(section, module)][number - 1]
            numeric = not (len(key) == 1 and key in "ABCD")
            choices = []
            parsed_choices = choice_texts(text) if not numeric else {}
            if not numeric:
                for letter in "ABCD":
                    alternative = parsed_choices.get(letter, "")
                    if not alternative or len(alternative) > 300 or "....." in alternative:
                        alternative = f"Alternativa {letter} (veja a imagem)"
                        choice_fallbacks.append((section, module, number, letter))
                    choices.append({"key": letter, "text": alternative})
            image_name = f"{'rw' if section == 'reading-writing' else 'math'}-m{module}-q{number:02}.png"
            destination = assets / image_name
            dimensions = image_for_question(page, rect, destination)
            if dimensions[0] < 150 or dimensions[1] < 40:
                raise ValueError(f"Image suspiciously small: {destination} {dimensions}")
            answer_data = answers[(section, module)][number]
            if answer_data[0] is None:
                raise ValueError(f"Missing explanation: {section} {module} #{number}")
            explanation = answer_data[1]
            explanation = re.split(r"Choice\s+[A-D]\s+is\s+incorrect", explanation, maxsplit=1)[0]
            explanation = re.split(r"SAT PRACTICE TEST #4 ANSWER EXPLANATIONS", explanation, maxsplit=1)[0]
            explanation = explanation.strip()[:2000]
            if len(explanation) < 15:
                raise ValueError(f"Explanation too short: {section} {module} #{number}")
            accepted = key.split(";")
            prompt = "Digite sua resposta para a questão reproduzida na imagem." if numeric else "Escolha a melhor alternativa para a questão reproduzida na imagem."
            rows.append("(" + ",".join([
                sql_string("practice-4-paper"), sql_string(section), str(module), str(number),
                sql_string(text[:12000]), sql_string(prompt), sql_string(json.dumps(choices, ensure_ascii=False)) + "::jsonb",
                sql_string("numeric" if numeric else "multiple-choice"),
                "ARRAY[" + ",".join(sql_string(value) for value in accepted) + "]::text[]",
                sql_string(explanation), sql_string(f"/sat-assets/practice-4/{image_name}"),
                sql_string("https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf"),
                str(page_number), sql_string("published")
            ]) + ")")
    if len(rows) != 115:
        raise ValueError(f"Expected 115 new rows, got {len(rows)}")
    sql = "-- Generated from the user-supplied College Board SAT Practice Test #4 PDFs.\n"
    sql += "-- Keep alongside 028_sat_practice_4_starter.sql: together they publish 120 items.\n"
    sql += "-- The associated PNGs preserve charts and notation; text is an automatic transcription.\n"
    sql += "INSERT INTO sat_questions\n  (form_code,section,module_number,question_number,passage,prompt,choices,answer_type,accepted_answers,explanation,image_path,source_url,source_page,status)\nVALUES\n"
    sql += ",\n".join(rows) + ";\n"
    migration = root / "db" / "migrations" / "029_sat_practice_4_complete.sql"
    migration.write_text(sql, encoding="utf-8")
    print(f"BUILT {len(rows)} rows, {len(choice_fallbacks)} fallback choice labels, {len(list(assets.glob('*.png')))} images")
    print("FALLBACKS:", choice_fallbacks)
    print("MIGRATION:", migration, migration.stat().st_size, "bytes")


def main():
    if len(sys.argv) not in (3, 4):
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf [--build]")
    question_pdf = pymupdf.open(Path(sys.argv[1]))
    answer_pdf = pymupdf.open(Path(sys.argv[2]))
    for section, module, start, end, maximum, _, _ in SECTIONS:
        positions = question_positions(question_pdf, start, end, maximum)
        numbers = [row[0] for row in positions]
        print(f"QUESTIONS {section} {module}: {len(positions)}/{maximum}")
        if numbers != list(range(1, maximum + 1)):
            print("  POSITION NUMBERS:", numbers)
            print("  POSITIONS:", positions)
        for index, item in enumerate(positions):
            page = question_pdf[item[1] - 1]
            excerpt = page.get_text(sort=True, clip=question_rect(positions, index))
            choices = choice_texts(excerpt)
            key = OFFICIAL_KEY[(section, module)][item[0] - 1]
            if key in "ABCD" and len(key) == 1 and set(choices) != set("ABCD"):
                print("  CHOICES NEED REVIEW", item[0], sorted(choices), re.sub(r"\s+", " ", excerpt[-140:]).encode("ascii", "replace").decode())
            if key not in "ABCD" and choices:
                print("  NUMERIC HAS CHOICES", item[0], sorted(choices))
    answers = answer_sections(answer_pdf)
    if len(sys.argv) == 4:
        if sys.argv[3] != "--build":
            raise SystemExit("Unknown option")
        build(question_pdf, answers, Path(__file__).resolve().parent.parent)


if __name__ == "__main__":
    main()
