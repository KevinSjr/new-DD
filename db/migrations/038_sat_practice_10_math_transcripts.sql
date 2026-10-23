-- Correct the accessible text for two questions sharing page 49 of Test #10.
-- The question images and official answer key remain unchanged.
UPDATE sat_questions
SET passage = 'In right triangle RST, the sum of the measures of angle R and angle S is 90 degrees. The value of sin(R) is √15/4. What is the value of cos(S)? A) √15/15 B) √15/4 C) 4√15/15 D) √15'
WHERE form_code = 'practice-10-paper' AND section = 'math' AND module_number = 2 AND question_number = 15;

UPDATE sat_questions
SET passage = 'The graph shows a line relating shares of Company A (x) and Company B (y). It passes through (0, 40) and (60, 0). Which equation could represent this relationship? A) y = 8x + 12 B) 8x + 12y = 480 C) y = 12x + 8 D) 12x + 8y = 480'
WHERE form_code = 'practice-10-paper' AND section = 'math' AND module_number = 2 AND question_number = 16;
