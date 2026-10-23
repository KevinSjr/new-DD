// College Board, Scoring Your Paper SAT Practice Test #4, page 5.
// Applies only to the nondigital/paper version of Practice Test #4.
export const SAT_SCORING_SOURCE = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf'
export const SAT_SCORING_SOURCE_5 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-5-digital.pdf'
export const SAT_SCORING_SOURCE_6 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-6-digital.pdf'
export const SAT_SCORING_SOURCE_7 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-7-digital.pdf'
export const SAT_SCORING_SOURCE_8 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-8-digital.pdf'
export const SAT_SCORING_SOURCE_9 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-9-digital.pdf'
export const SAT_SCORING_SOURCE_10 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-10-digital.pdf'
export const SAT_SCORING_SOURCE_11 = 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-11-digital.pdf'

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

// College Board, Scoring Your Paper SAT Practice Test #6, page 5.
const rows6 = `
0 200 200 200 200
1 200 200 200 200
2 200 200 200 200
3 200 200 200 200
4 200 200 200 200
5 200 210 200 200
6 200 230 200 200
7 200 250 200 220
8 210 270 200 230
9 220 280 220 250
10 230 290 250 280
11 240 300 280 310
12 260 320 290 320
13 270 330 300 330
14 280 330 310 340
15 290 350 320 350
16 310 370 330 360
17 320 380 330 360
18 340 380 340 370
19 350 390 350 380
20 360 400 360 390
21 370 410 370 400
22 380 420 370 400
23 390 430 380 410
24 400 440 390 420
25 400 440 400 430
26 410 450 420 450
27 420 460 430 460
28 430 470 440 470
29 440 480 460 490
30 450 490 470 500
31 460 500 480 510
32 470 510 500 530
33 470 510 510 540
34 480 520 520 550
35 490 530 530 560
36 500 540 550 580
37 510 550 560 590
38 520 560 570 600
39 530 570 580 610
40 540 580 590 620
41 530 590 600 630
42 550 610 620 650
43 560 620 630 660
44 570 630 650 680
45 580 640 670 700
46 590 650 690 720
47 590 650 710 740
48 600 660 730 760
49 620 660 740 770
50 630 670 750 780
51 640 680 760 790
52 650 690 770 800
53 660 700 780 800
54 670 710 790 800
55 680 720
56 690 730
57 700 740
58 710 750
59 720 760
60 720 760
61 730 770
62 750 770
63 760 780
64 770 790
65 780 800
66 790 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

// College Board, Scoring Your Paper SAT Practice Test #7, page 5.
const rows7 = `
0 200 200 200 200
1 210 220 210 230
2 210 220 210 240
3 210 220 210 250
4 210 220 210 260
5 210 230 210 270
6 210 240 210 280
7 210 250 230 290
8 220 260 250 300
9 220 270 260 310
10 220 280 280 340
11 230 290 300 360
12 230 300 320 360
13 240 310 330 370
14 240 320 340 380
15 250 330 350 390
16 270 330 360 400
17 300 340 360 400
18 310 350 370 410
19 320 360 380 420
20 320 360 380 420
21 330 370 390 430
22 340 380 400 440
23 350 390 410 450
24 350 390 420 460
25 360 400 430 470
26 370 410 430 470
27 370 410 440 480
28 380 420 450 490
29 390 430 460 500
30 400 440 480 520
31 410 450 490 530
32 410 450 500 540
33 420 460 500 560
34 430 470 510 570
35 440 480 520 580
36 450 490 530 590
37 460 500 540 600
38 470 510 550 610
39 470 530 560 620
40 480 540 580 640
41 490 550 590 650
42 500 560 600 660
43 510 570 610 670
44 520 580 630 690
45 530 590 640 700
46 540 600 650 710
47 560 620 670 730
48 570 630 690 750
49 580 640 700 760
50 590 650 720 770
51 600 660 750 780
52 610 670 770 800
53 630 690 780 800
54 640 700 800 800
55 660 700
56 670 710
57 680 720
58 690 730
59 710 750
60 720 760
61 730 770
62 750 770
63 760 780
64 770 790
65 780 800
66 800 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

// College Board, Scoring Your Paper SAT Practice Test #8, page 5.
const rows8 = `
0 200 200 200 200
1 210 220 210 230
2 210 220 210 240
3 210 220 210 250
4 210 220 210 260
5 210 230 210 270
6 210 240 210 280
7 220 250 210 290
8 220 260 220 300
9 230 270 230 310
10 230 280 260 340
11 240 290 290 350
12 240 300 320 360
13 250 310 330 370
14 260 320 340 380
15 270 330 350 390
16 300 340 350 390
17 310 350 360 400
18 320 360 370 410
19 330 370 380 420
20 330 370 380 420
21 340 380 390 430
22 350 390 390 430
23 350 390 400 440
24 360 400 410 450
25 370 410 420 460
26 380 420 430 470
27 380 420 440 480
28 390 430 450 490
29 400 440 460 500
30 410 450 470 510
31 410 450 480 520
32 420 460 490 530
33 430 470 490 550
34 440 480 500 560
35 450 490 510 570
36 460 500 520 580
37 470 510 540 600
38 470 530 550 610
39 480 540 560 620
40 490 550 570 630
41 500 560 590 650
42 510 570 600 660
43 520 580 610 670
44 530 590 630 690
45 540 600 640 700
46 550 610 660 720
47 560 620 670 730
48 570 630 690 750
49 580 640 710 770
50 590 650 740 780
51 600 660 760 790
52 610 670 770 800
53 630 690 780 800
54 640 700 800 800
55 660 700
56 670 710
57 680 720
58 690 730
59 700 740
60 710 750
61 720 760
62 730 770
63 740 780
64 760 790
65 780 800
66 800 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

// College Board, Scoring Your Paper SAT Practice Test #9, page 5.
const rows9 = `
0 200 200 200 200
1 210 220 210 220
2 210 220 210 220
3 210 220 210 230
4 210 220 210 240
5 210 230 210 250
6 210 240 220 260
7 210 250 240 270
8 220 260 250 280
9 220 270 260 300
10 230 280 280 340
11 230 290 310 350
12 240 300 320 360
13 250 310 330 370
14 260 320 340 380
15 270 330 350 390
16 280 340 360 400
17 300 340 370 410
18 310 350 370 410
19 320 360 380 420
20 330 370 390 430
21 330 370 390 430
22 340 380 400 440
23 350 390 410 450
24 360 400 420 460
25 360 400 430 470
26 370 410 440 480
27 380 420 450 490
28 380 420 460 500
29 390 430 470 510
30 400 440 480 520
31 410 450 490 530
32 410 450 500 540
33 420 460 500 560
34 430 470 510 570
35 440 480 520 580
36 450 490 530 590
37 460 500 540 600
38 470 510 560 620
39 470 530 570 630
40 470 530 580 640
41 480 540 590 650
42 490 550 610 670
43 500 560 620 680
44 510 570 630 690
45 520 580 650 710
46 530 590 660 720
47 540 600 680 740
48 560 620 690 750
49 570 630 710 760
50 580 640 730 770
51 590 650 750 780
52 600 660 770 800
53 610 670 780 800
54 620 680 800 800
55 630 690
56 660 700
57 670 710
58 680 720
59 690 730
60 710 750
61 720 760
62 730 770
63 740 780
64 760 790
65 780 800
66 800 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

// College Board, Scoring Your Paper SAT Practice Test #10, page 5.
const rows10 = `
0 200 200 200 200
1 210 220 210 220
2 210 220 210 220
3 210 220 210 220
4 210 220 210 230
5 210 230 210 240
6 220 240 220 250
7 220 250 230 260
8 230 260 240 300
9 230 270 250 310
10 240 280 260 320
11 240 290 280 340
12 250 300 310 350
13 250 310 320 360
14 260 320 330 370
15 270 330 340 380
16 280 340 350 390
17 300 340 360 400
18 310 350 370 410
19 320 360 380 420
20 330 370 380 420
21 330 370 390 430
22 340 380 390 430
23 350 390 400 440
24 350 390 410 450
25 360 400 420 460
26 370 410 430 470
27 370 410 440 480
28 380 420 450 490
29 390 430 460 500
30 400 440 470 510
31 400 440 480 520
32 410 450 490 530
33 420 460 490 550
34 430 470 510 570
35 440 480 520 580
36 450 490 530 590
37 460 500 540 600
38 460 500 550 610
39 470 510 560 620
40 470 530 580 640
41 480 540 590 650
42 490 550 600 660
43 500 560 610 670
44 510 570 620 680
45 520 580 640 700
46 530 590 650 710
47 540 600 670 730
48 550 610 680 740
49 570 630 700 760
50 580 640 730 770
51 590 650 750 780
52 600 660 770 790
53 610 670 780 800
54 620 680 800 800
55 630 690
56 640 700
57 670 710
58 680 720
59 690 730
60 700 740
61 720 760
62 730 770
63 740 780
64 760 780
65 770 800
66 800 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

// College Board, Scoring Your Paper SAT Practice Test #11, page 5.
const rows11 = `
0 200 200 200 200
1 210 220 210 220
2 210 220 210 220
3 210 220 210 230
4 210 220 220 240
5 210 230 230 250
6 220 240 240 270
7 220 240 250 290
8 220 250 260 320
9 230 260 270 330
10 230 270 290 350
11 240 280 310 350
12 250 290 330 370
13 250 300 340 380
14 260 310 350 390
15 270 320 350 390
16 270 330 360 400
17 290 330 370 410
18 300 340 370 410
19 310 350 380 420
20 320 360 390 430
21 330 370 390 430
22 340 380 400 440
23 340 380 410 450
24 350 390 410 450
25 360 400 420 460
26 360 400 430 470
27 370 410 440 480
28 380 420 450 490
29 390 430 460 500
30 390 430 470 510
31 400 440 480 520
32 410 450 490 530
33 420 460 490 550
34 430 470 500 560
35 440 480 510 570
36 450 490 530 590
37 450 490 540 600
38 460 500 550 610
39 470 510 560 620
40 470 530 570 630
41 480 540 590 650
42 490 550 600 660
43 500 560 610 670
44 510 570 620 680
45 520 580 640 700
46 530 590 650 710
47 540 600 660 720
48 560 620 680 740
49 570 630 700 760
50 580 640 710 770
51 590 650 730 780
52 600 660 750 800
53 620 680 770 800
54 630 690 790 800
55 640 700
56 660 700
57 680 720
58 690 730
59 700 740
60 710 750
61 720 760
62 730 770
63 740 780
64 760 780
65 780 800
66 800 800
`.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number))

export function scoreRangeForRaw(section, correct, formCode = 'practice-4-paper') {
  const max = section === 'reading-writing' ? 66 : section === 'math' ? 54 : null
  if (max === null || !Number.isInteger(correct) || correct < 0 || correct > max) throw new RangeError('Pontuação bruta do SAT inválida.')
  const byForm = { 'practice-4-paper':rows, 'practice-5-paper':rows5, 'practice-6-paper':rows6, 'practice-7-paper':rows7, 'practice-8-paper':rows8, 'practice-9-paper':rows9, 'practice-10-paper':rows10, 'practice-11-paper':rows11 }
  if (!Object.hasOwn(byForm, formCode)) throw new RangeError('Versão do SAT inválida.')
  const row = byForm[formCode][correct]
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

export function scorePractice6(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect, 'practice-6-paper')
  const math = scoreRangeForRaw('math', mathCorrect, 'practice-6-paper')
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}

export function scorePractice7(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect, 'practice-7-paper')
  const math = scoreRangeForRaw('math', mathCorrect, 'practice-7-paper')
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}

export function scorePractice8(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect, 'practice-8-paper')
  const math = scoreRangeForRaw('math', mathCorrect, 'practice-8-paper')
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}

export function scorePractice9(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect, 'practice-9-paper')
  const math = scoreRangeForRaw('math', mathCorrect, 'practice-9-paper')
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}

export function scorePractice10(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect, 'practice-10-paper')
  const math = scoreRangeForRaw('math', mathCorrect, 'practice-10-paper')
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}

export function scorePractice11(readingWritingCorrect, mathCorrect) {
  const readingWriting = scoreRangeForRaw('reading-writing', readingWritingCorrect, 'practice-11-paper')
  const math = scoreRangeForRaw('math', mathCorrect, 'practice-11-paper')
  return {
    readingWriting,
    math,
    total:{ lower:readingWriting.lower + math.lower, upper:readingWriting.upper + math.upper },
  }
}
