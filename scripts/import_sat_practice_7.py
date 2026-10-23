"""Build SAT Practice Test #7 migration and question crops from user PDFs.

Usage: python scripts/import_sat_practice_7.py TEST.pdf ANSWERS.pdf
The key is transcribed from the College Board scoring worksheet for Test #7.
"""

import sys

import pymupdf

from import_sat_practice_5 import build


SECTIONS = [
    ("reading-writing", 1, 4, 18, 33, 2, 16),
    ("reading-writing", 2, 20, 31, 33, 17, 30),
    ("math", 1, 34, 40, 27, 31, 38),
    ("math", 2, 44, 50, 27, 39, 46),
]
KEY = {
    ("reading-writing", 1): "A D B B A A A C A A D D A B A B C D A D D C C A D D A D A C B C D".split(),
    ("reading-writing", 2): "C D C D B A B B D B B D C C D D B B D D C C C A B D B D A D C A C".split(),
    ("math", 1): "B D B A D 9 14;-5;-4 A B D C D 294 3 A C B B D 5 87 B A B C A -13/2;-6.5".split(),
    ("math", 2): "A B C A B 2850 11/4;2.75 C C D D D 4.41;441/100 153 C A A D B 120 1660 B C B C B 14".split(),
}


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf")
    build(
        pymupdf.open(sys.argv[1]), pymupdf.open(sys.argv[2]),
        test_number=7, sections=SECTIONS, answer_key=KEY,
        full_width_pages={9, 10, 11, 12}, final_pages={18, 31, 40, 50},
        migration_number="034",
    )
