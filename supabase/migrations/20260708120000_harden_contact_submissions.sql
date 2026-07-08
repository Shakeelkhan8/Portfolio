-- Harden contact_submissions:
-- 1) Remove anon/authenticated INSERT so spam cannot bypass /api/contact.
--    Inserts must go through the service role from the Next.js API route.
-- 2) Index ip_hash for rate-limit COUNT queries.

DROP POLICY IF EXISTS contact_submissions_public_insert ON public.contact_submissions;

CREATE INDEX IF NOT EXISTS contact_submissions_ip_hash_created_at_idx
  ON public.contact_submissions (ip_hash, created_at DESC);
