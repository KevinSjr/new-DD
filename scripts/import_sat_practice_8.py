"""Build SAT Practice Test #8 migration and question crops from user PDFs.

Usage: python scripts/import_sat_practice_8.py TEST.pdf ANSWERS.pdf
The key is transcribed from the College Board scoring worksheet for Test #8.
"""

import sys

import pymupdf

from import_sat_practice_5 import build


SECTIONS = [
    ("reading-writing", 1, 4, 16, 33, 2, 16),
    ("reading-writing", 2, 18, 30, 33, 17, 31),
    ("math", 1, 34, 40, 27, 32, 40),
    ("math", 2, 44, 50, 27, 41, 48),
]
KEY = {
    ("reading-writing", 1): "B D A C C C D A A D B C A A D C A D C B B A D C C D A B C A C A D".split(),
    ("reading-writing", 2): "B A B D D A C A A D B C D B C A C D A B C A C A B A A A C B D B D".split(),
    ("math", 1): "C C D D A 0.2;1/5 240 A B B B D 25 6 C D A D C 7 182 D B C C B 284/3;94.66;94.67".split(),
    ("math", 2): "C C D C D 9 68 B D D C B 986 24 D D A B A 46 1.8;9/5 A B C B D 168".split(),
}


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf")
    build(
        pymupdf.open(sys.argv[1]), pymupdf.open(sys.argv[2]),
        test_number=8, sections=SECTIONS, answer_key=KEY,
        full_width_pages={15, 16, 23, 24}, final_pages={16, 30, 40, 50},
        migration_number="035",
    )
