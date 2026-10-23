"""Build SAT Practice Test #9 migration and question crops from user PDFs.

Usage: python scripts/import_sat_practice_9.py TEST.pdf ANSWERS.pdf
The key is transcribed from the College Board scoring worksheet for Test #9.
"""

import sys

import pymupdf

from import_sat_practice_5 import build


SECTIONS = [
    ("reading-writing", 1, 4, 16, 33, 2, 16),
    ("reading-writing", 2, 18, 30, 33, 17, 30),
    ("math", 1, 34, 39, 27, 31, 39),
    ("math", 2, 42, 48, 27, 40, 47),
]
KEY = {
    ("reading-writing", 1): "A D C C B C A A C A D C D C A D B A A A B C C C A B A B D B B A C".split(),
    ("reading-writing", 2): "B C B B C D D D A A D A D C C D B D C D C C B D C C C A B C D C B".split(),
    ("math", 1): "B C B A A 9 224 A C B A B 40 14 C D B D D 52 -3 B D A D B 1260".split(),
    ("math", 2): "B B D B D 70 1 D A D C D 45 2;-12 B C B B C 410 -19 D D A C D 50".split(),
}


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf")
    build(
        pymupdf.open(sys.argv[1]), pymupdf.open(sys.argv[2]),
        test_number=9, sections=SECTIONS, answer_key=KEY,
        full_width_pages={8, 9, 10}, final_pages={16, 30, 39, 48},
        migration_number="036",
    )
