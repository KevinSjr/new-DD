-- The official scoring worksheet also accepts 451/100 for Math M1 Q14.
UPDATE sat_questions
SET accepted_answers = ARRAY['4.51', '451/100'], updated_at = now()
WHERE form_code = 'practice-5-paper'
  AND section = 'math' AND module_number = 1 AND question_number = 14
  AND deleted_at IS NULL;
