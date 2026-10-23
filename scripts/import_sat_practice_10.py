"""Build SAT Practice Test #10 migration and question images from the College Board PDFs.

Usage: python scripts/import_sat_practice_10.py TEST.pdf ANSWERS.pdf
The key below is transcribed from the official scoring worksheet for Test #10.
"""

import sys
from pathlib import Path

import pymupdf
from PIL import Image

from import_sat_practice_5 import build


SECTIONS = [
    ("reading-writing", 1, 4, 16, 33, 2, 16),
    ("reading-writing", 2, 18, 31, 33, 17, 31),
    ("math", 1, 34, 42, 27, 32, 39),
    ("math", 2, 46, 52, 27, 40, 47),
]
KEY = {
    ("reading-writing", 1): "A B B A C B D D C C C B A A A A C D C B A C C C C C A B B B B C C".split(),
    ("reading-writing", 2): "A A D A A D B B D D D A B A D A A A D B D C A D A A B D A D D A C".split(),
    ("math", 1): "C A D A D 77 25 C B B B B 1 76 A D D A A 35 113 A C C D A 29/3;9.666;9.667".split(),
    ("math", 2): "D A D D A 79 2 D D B A C 41 11875 B B B A C 5 0.25;1/4 D C C D B 104".split(),
}


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Provide TEST.pdf and ANSWERS.pdf")
    test_pdf = pymupdf.open(sys.argv[1])
    build(
        test_pdf, pymupdf.open(sys.argv[2]),
        test_number=10, sections=SECTIONS, answer_key=KEY,
        full_width_pages={11, 23, 24, 25, 26, 36},
        final_pages={16, 31, 42, 52}, migration_number="037",
    )
    # Math module 1, question 4 starts on page 36; its answer graphs fill page 37.
    image_path = Path(__file__).resolve().parent.parent / "public/sat-assets/practice-10/math-m1-q04.png"
    first = Image.open(image_path).convert("RGB")
    page = test_pdf[36]
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=pymupdf.Rect(35, 105, 578, 585), alpha=False)
    continuation = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    combined = Image.new("RGB", (max(first.width, continuation.width), first.height + continuation.height), "white")
    combined.paste(first, (0, 0))
    combined.paste(continuation, (0, first.height))
    combined.save(image_path, optimize=True)
