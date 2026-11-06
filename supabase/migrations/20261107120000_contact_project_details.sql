-- Contact form: project type and estimated budget.
--
-- Additive and nullable: existing rows keep NULL, and inserts that omit the
-- columns still work. The API route also retries without these columns if
-- they are missing, so deploying the code before this migration does not
-- break the contact form.
--
-- Values are validated in the API (src/lib/validators/contact.ts); the CHECKs
-- only stop oversized values written by anything else with the service role.
--
-- Rollback:
--   ALTER TABLE public.contact_submissions
--     DROP COLUMN IF EXISTS project_type,
--     DROP COLUMN IF EXISTS budget;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS project_type TEXT
    CHECK (project_type IS NULL OR char_length(project_type) <= 60),
  ADD COLUMN IF NOT EXISTS budget TEXT
    CHECK (budget IS NULL OR char_length(budget) <= 60);
