-- Preserve existing daily attempts as legacy; new challenges are independent by area.
ALTER TABLE sat_daily_runs ADD COLUMN section text NOT NULL DEFAULT 'legacy';
ALTER TABLE sat_daily_runs DROP CONSTRAINT sat_daily_runs_pkey;
ALTER TABLE sat_daily_runs ADD CONSTRAINT sat_daily_runs_section_check
  CHECK (section IN ('legacy', 'reading-writing', 'math'));
ALTER TABLE sat_daily_runs ADD PRIMARY KEY (token_hash, day, section);
