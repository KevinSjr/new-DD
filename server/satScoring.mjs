// College Board, Scoring Your Paper SAT Practice Test #4, page 5.
// Applies only to the nondigital/paper version of Practice Test #4.
export const SAT_SCORING_SOURCE = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf'
export const SAT_SCORING_SOURCE_5 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-5-digital.pdf'

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

// College Board, Scoring Your Paper SAT Practice Test #5, page 5.
// Same report metrics as #4, with the conversion table specific to #5.
const rows5 = `
0 200 200 200 200
1 200 200 200 200
2 200 200 200 200
3 200 200 200 210
4 200 200 200 220
5 200 210 200 240
6 200 230 210 260
7 200 240 220 270
8 200 250 230 290
9 200 260 270 330
10 220 280 290 330
11 230 290 300 340
12 240 300 310 350
13 250 310 320 360
14 260 320 330 370
15 270 330 340 380
16 290 350 340 380
17 310 370 350 390
18 330 370 350 390
19 340 380 360 400
20 350 390 370 410
21 360 400 380 420
22 360 400 380 420
23 370 410 390 430
24 380 420 400 440
25 390 430 410 450
26 390 430 420 460
27 400 440 430 470
28 410 450 440 480
29 420 460 450 510
30 430 470 460 520
31 440 480 470 530
32 450 490 480 540
33 450 490 490 550
34 460 500 510 570
35 470 510 520 580
36 480 520 530 590
37 490 530 540 600
38 500 540 550 610
39 500 540 560 620
40 510 550 570 630
41 520 560 580 640
42 530 570 600 660
43 530 590 610 670
44 540 600 630 690
45 550 610 640 700
46 560 620 660 720
47 570 630 680 740
48 580 640 700 760
49 590 650 720 780
50 600 660 750 790
51 620 660 760 800
52 630 670 780 800
53 640 680 790 800
54 650 690 790 800
55 660 700
56 680 720
57 690 730
58 700 740
59 710 750
60 720 760
61 730 770
62 750 770
63 760 780
64 770 790
65 780 800
66 790 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

export function scoreRangeForRaw(section, correct, formCode = 'practice-4-paper') {
  const max = section === 'reading-writing' ? 66 : section === 'math' ? 54 : null
  if (max === null || !Number.isInteger(correct) || correct < 0 || correct > max) throw new RangeError('Pontuação bruta do SAT inválida.')
  if (!['practice-4-paper', 'practice-5-paper'].includes(formCode)) throw new RangeError('Versão do SAT inválida.')
  const row = (formCode === 'practice-5-paper' ? rows5 : rows)[correct]
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

export function scorePractice5(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect, 'practice-5-paper')
  const math = scoreRangeForRaw('math', mathCorrect, 'practice-5-paper')
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}
