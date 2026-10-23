"""Build SAT Practice Test #11 migration and question crops from the College Board PDFs.

Usage: python scripts/import_sat_practice_11.py TEST.pdf ANSWERS.pdf
The key is transcribed from the official scoring worksheet for Test #11.
"""

import sys

print('Loading PDF import dependencies...', flush=True)

import pymupdf

import import_sat_practice_5 as importer
from audit_sat_pdf import question_positions as standard_positions


SECTIONS = [
    ("reading-writing", 1, 4, 16, 33, 2, 17),
    ("reading-writing", 2, 18, 30, 33, 18, 33),
    ("math", 1, 34, 41, 27, 34, 42),
    ("math", 2, 44, 51, 27, 43, 51),
]
KEY = {
    ("reading-writing", 1): "A C D D A B B D D C B D A D B A D D D D A B B A D D D A A C A D B".split(),
    ("reading-writing", 2): "C C C D B B B A B C B D C B C C A A B B B B B B A B D B C B C A A".split(),
    ("math", 1): "D A C A B 75 30 A C C D B 13 15000 A A C B D 100 29 B B A C B 3331".split(),
    ("math", 2): "C B D D A 8.6;43/5 3600 A B D C A 45 13 B C D B A .5061;.5062;41/81 1512/5;302.4 C A B B D 157.8;789/5".split(),
}


def question_positions(pdf, start, end, maximum):
    positions = standard_positions(pdf, start, end, maximum)
    if (start, end, maximum) == (34, 41, 27):
        # These two printed labels sit 0.4–0.5 pt outside the shared parser's bounds.
        positions.extend([(1, 34, 0, 112.62), (7, 35, 1, 112.62)])
        positions.sort(key=lambda item: (item[1], item[2], item[3]))
    return positions


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf")
    importer.question_positions = question_positions
    print('Extracting and checking 120 questions...', flush=True)
    importer.build(
        pymupdf.open(sys.argv[1]), pymupdf.open(sys.argv[2]),
        test_number=11, sections=SECTIONS, answer_key=KEY,
        full_width_pages={24, 38}, final_pages={16, 30, 41, 51},
        migration_number="039",
    )
