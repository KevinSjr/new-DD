UPDATE mext_questions
SET prompt = 'Prova de ' || CASE subject
  WHEN 'japanese' THEN 'Japonês'
  WHEN 'english' THEN 'Inglês'
  WHEN 'math' THEN 'Matemática'
  WHEN 'physics' THEN 'Física'
  WHEN 'chemistry' THEN 'Química'
  WHEN 'biology' THEN 'Biologia'
END || ' B, seção ' || section || ', item ' || item_code || '. Consulte o enunciado original.'
WHERE edition = 2025 AND track = 'B';
