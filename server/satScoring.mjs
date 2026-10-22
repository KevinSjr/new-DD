// College Board, Scoring Your Paper SAT Practice Test #4, page 5.
// Applies only to the nondigital/paper version of Practice Test #4.
export const SAT_SCORING_SOURCE = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf'

// Raw score, Reading and Writing lower/upper, Math lower/upper.
// The Math section has only 54 questions, so rows 55–66 omit its range.
const rows = `
0 200 200 200 200
1 200 200 200 200
2 200 200 200 200
3 200 200 200 200
4 200 200 200 200
5 200 200 200 200
6 200 200 200 200
7 200 210 200 220
8 200 220 200 230
9 210 230 220 250
10 230 250 250 280
11 240 260 280 310
12 250 270 290 320
13 260 280 300 330
14 280 300 310 340
15 290 310 320 350
16 320 340 330 360
17 340 360 330 360
18 350 370 340 370
19 360 380 350 380
20 370 390 360 390
21 370 390 370 400
22 380 400 370 400
23 390 410 380 410
24 400 420 390 420
25 410 430 400 430
26 420 440 420 450
27 420 440 430 460
28 430 450 440 470
29 440 460 460 490
30 450 470 470 500
31 460 480 480 510
32 460 480 500 530
33 470 490 510 540
34 480 500 520 550
35 490 510 530 560
36 490 510 550 580
37 500 520 560 590
38 510 530 570 600
39 520 540 580 610
40 530 550 590 620
41 540 560 600 630
42 540 560 620 650
43 550 570 630 660
44 560 580 650 680
45 570 590 670 700
46 580 600 690 720
47 590 610 710 740
48 590 610 730 760
49 600 620 740 770
50 610 630 750 780
51 620 640 760 790
52 630 650 770 800
53 630 650 780 800
54 640 660 790 800
55 650 670
56 660 680
57 670 690
58 680 700
59 690 710
60 700 720
61 710 730
62 720 740
63 730 750
64 750 770
65 770 790
66 790 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

export function scoreRangeForRaw(section, correct) {
  const max = section === 'reading-writing' ? 66 : section === 'math' ? 54 : null
  if (max === null || !Number.isInteger(correct) || correct < 0 || correct > max) throw new RangeError('Pontuação bruta do SAT inválida.')
  const row = rows[correct]
  if (!row || row[0] !== correct || row.length !== (correct <= 54 ? 5 : 3)) throw new Error('Tabela de conversão do SAT incompleta.')
  const offset = section === 'reading-writing' ? 1 : 3
  return { lower:row[offset], upper:row[offset + 1] }
}

export function scorePractice4(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect)
  const math = scoreRangeForRaw('math', mathCorrect)
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}
