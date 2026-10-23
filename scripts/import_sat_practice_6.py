"""Build SAT Practice Test #6 migration and question crops from user PDFs.

Usage: python scripts/import_sat_practice_6.py TEST.pdf ANSWERS.pdf
The key is transcribed from the College Board scoring worksheet for Test #6.
"""

import sys

import pymupdf

from import_sat_practice_5 import build


SECTIONS = [
    ("reading-writing", 1, 4, 17, 33, 2, 17),
    ("reading-writing", 2, 18, 30, 33, 18, 33),
    ("math", 1, 32, 42, 27, 34, 43),
    ("math", 2, 44, 52, 27, 44, 52),
]
KEY = {
    ("reading-writing", 1): "D B B D D A B B D D A A A C B D D B A C D D D C B D D C C B A B C".split(),
    ("reading-writing", 2): "C D C B B C D C C C C C C D D B A D C A A C B A D B D A B C D B C".split(),
    ("math", 1): "A D D D A 31 11 D B B A B .5;1/2 7.5;15/2 B C D D D 189/5;37.8 -24 D A C D A 54".split(),
    ("math", 2): "B A B A B 6 10 B A A D C 774 5 B A D B A .2916;.2917;7/24 1677 B A D A A -28".split(),
}


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf")
    build(
        pymupdf.open(sys.argv[1]), pymupdf.open(sys.argv[2]),
        test_number=6, sections=SECTIONS, answer_key=KEY,
        full_width_pages={10, 24}, final_pages={17, 30, 42, 52},
        migration_number="033",
    )
