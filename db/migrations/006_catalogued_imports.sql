-- Imported listings are visible immediately; this status does not certify eligibility or dates.
ALTER TABLE scholarship_imports RENAME COLUMN review_status TO catalog_status;
ALTER TABLE scholarship_imports DROP CONSTRAINT scholarship_imports_review_status_check;
ALTER TABLE scholarship_imports ALTER COLUMN catalog_status SET DEFAULT 'listed';
UPDATE scholarship_imports SET catalog_status = 'listed' WHERE catalog_status = 'pending';
ALTER TABLE scholarship_imports ADD CONSTRAINT scholarship_imports_catalog_status_check
  CHECK (catalog_status IN ('listed', 'reviewed', 'rejected'));

ALTER TABLE scholarship_america_imports RENAME COLUMN review_status TO catalog_status;
ALTER TABLE scholarship_america_imports DROP CONSTRAINT scholarship_america_imports_review_status_check;
ALTER TABLE scholarship_america_imports ALTER COLUMN catalog_status SET DEFAULT 'listed';
UPDATE scholarship_america_imports SET catalog_status = 'listed' WHERE catalog_status = 'pending';
ALTER TABLE scholarship_america_imports ADD CONSTRAINT scholarship_america_imports_catalog_status_check
  CHECK (catalog_status IN ('listed', 'reviewed', 'rejected'));

ALTER TABLE study_australia_imports RENAME COLUMN review_status TO catalog_status;
ALTER TABLE study_australia_imports DROP CONSTRAINT study_australia_imports_review_status_check;
ALTER TABLE study_australia_imports ALTER COLUMN catalog_status SET DEFAULT 'listed';
UPDATE study_australia_imports SET catalog_status = 'listed' WHERE catalog_status = 'pending';
ALTER TABLE study_australia_imports ADD CONSTRAINT study_australia_imports_catalog_status_check
  CHECK (catalog_status IN ('listed', 'reviewed', 'rejected'));
