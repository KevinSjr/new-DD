ALTER TABLE campusbourses_imports
  DROP CONSTRAINT campusbourses_imports_source_url_check;
UPDATE campusbourses_imports
SET source_url = replace(source_url, '?lang=en', '&lang=en')
WHERE source_url LIKE 'https://campusbourses.campusfrance.org/#/program/%?lang=en';
ALTER TABLE campusbourses_imports
  ADD CONSTRAINT campusbourses_imports_source_url_check
  CHECK (source_url ~ '^https://campusbourses\.campusfrance\.org/#/program/[0-9]+&lang=en$');
