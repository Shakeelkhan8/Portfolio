-- Portfolio CMS initial schema
-- Phase 1 foundation: tables, indexes, helper functions

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.content_status AS ENUM ('draft', 'published');
CREATE TYPE public.availability_status AS ENUM ('available', 'unavailable', 'limited');
CREATE TYPE public.contact_status AS ENUM ('unread', 'read', 'archived');
CREATE TYPE public.nav_group AS ENUM ('main', 'utility', 'footer', 'social');
CREATE TYPE public.script_placement AS ENUM ('head', 'body_end');
CREATE TYPE public.skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- ---------------------------------------------------------------------------
-- Admin registry (links Supabase Auth users to admin access)
-- ---------------------------------------------------------------------------

CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Site settings (singleton rows use fixed UUIDs in seed)
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  city TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  years_of_experience INTEGER NOT NULL DEFAULT 0,
  copyright_text TEXT,
  availability_status public.availability_status NOT NULL DEFAULT 'available',
  availability_message TEXT NOT NULL,
  github_username TEXT,
  resume_summary TEXT,
  maintenance_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  maintenance_message TEXT,
  response_time_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_media_id UUID,
  favicon_media_id UUID,
  primary_color TEXT NOT NULL DEFAULT '#2563eb',
  accent_color TEXT,
  background_color TEXT,
  foreground_color TEXT,
  font_heading TEXT NOT NULL DEFAULT 'Geist',
  font_body TEXT NOT NULL DEFAULT 'Geist',
  font_mono TEXT NOT NULL DEFAULT 'Geist Mono',
  custom_css TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.seo_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_title TEXT NOT NULL,
  default_description TEXT NOT NULL,
  default_og_image_id UUID,
  default_robots TEXT NOT NULL DEFAULT 'index, follow',
  twitter_card_type TEXT NOT NULL DEFAULT 'summary_large_image',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.analytics_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plausible_domain TEXT,
  plausible_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ga4_measurement_id TEXT,
  ga4_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.custom_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  script_content TEXT NOT NULL,
  placement public.script_placement NOT NULL DEFAULT 'head',
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nav_group public.nav_group NOT NULL,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  external BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.section_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (page_key, section_key)
);

CREATE TABLE public.cta_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  primary_label TEXT,
  primary_href TEXT,
  secondary_label TEXT,
  secondary_href TEXT,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.philosophy_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.expertise_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.about_paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Media (referenced by theme; FK added after table exists)
-- ---------------------------------------------------------------------------

CREATE TABLE public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.theme_settings
  ADD CONSTRAINT theme_settings_logo_media_id_fkey
  FOREIGN KEY (logo_media_id) REFERENCES public.media_files (id) ON DELETE SET NULL;

ALTER TABLE public.theme_settings
  ADD CONSTRAINT theme_settings_favicon_media_id_fkey
  FOREIGN KEY (favicon_media_id) REFERENCES public.media_files (id) ON DELETE SET NULL;

ALTER TABLE public.seo_defaults
  ADD CONSTRAINT seo_defaults_default_og_image_id_fkey
  FOREIGN KEY (default_og_image_id) REFERENCES public.media_files (id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------------

CREATE TABLE public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.skill_categories (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  level public.skill_level,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX skills_category_id_idx ON public.skills (category_id);

-- ---------------------------------------------------------------------------
-- Experience & education
-- ---------------------------------------------------------------------------

CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id TEXT UNIQUE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.experience_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES public.experiences (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.experience_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES public.experiences (id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.education_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  education_id UUID NOT NULL REFERENCES public.educations (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------

CREATE TABLE public.project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  problem TEXT NOT NULL,
  role TEXT NOT NULL,
  context TEXT NOT NULL,
  overview TEXT NOT NULL,
  architecture_text TEXT NOT NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  completion_date DATE,
  demo_url TEXT,
  github_url TEXT,
  thumbnail_media_id UUID REFERENCES public.media_files (id) ON DELETE SET NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_id UUID REFERENCES public.media_files (id) ON DELETE SET NULL,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX projects_status_idx ON public.projects (status);
CREATE INDEX projects_featured_idx ON public.projects (featured);

CREATE TABLE public.project_category_map (
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.project_categories (id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

CREATE TABLE public.project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  rationale TEXT NOT NULL,
  tradeoff TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_future_improvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media_files (id) ON DELETE CASCADE,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_architecture_diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES public.projects (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  nodes_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  edges_json JSONB NOT NULL DEFAULT '[]'::JSONB
);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_json JSONB,
  content_html TEXT,
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  reading_time_minutes INTEGER NOT NULL DEFAULT 1,
  meta_title TEXT,
  meta_description TEXT,
  og_image_id UUID REFERENCES public.media_files (id) ON DELETE SET NULL,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles (id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Certifications, testimonials, services
-- ---------------------------------------------------------------------------

CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_id TEXT,
  verification_url TEXT,
  image_media_id UUID REFERENCES public.media_files (id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_company TEXT,
  content TEXT NOT NULL,
  rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  avatar_media_id UUID REFERENCES public.media_files (id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------------
-- Resume, contact, open source
-- ---------------------------------------------------------------------------

CREATE TABLE public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_media_id UUID NOT NULL REFERENCES public.media_files (id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status public.contact_status NOT NULL DEFAULT 'unread',
  ip_hash TEXT,
  user_agent TEXT,
  read_at TIMESTAMPTZ,
  read_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contact_submissions_status_idx ON public.contact_submissions (status);
CREATE INDEX contact_submissions_created_at_idx ON public.contact_submissions (created_at DESC);

CREATE TABLE public.github_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  show_live_stats BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.curated_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_full_name TEXT NOT NULL UNIQUE,
  github_repo_id BIGINT,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  override_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Custom pages
-- ---------------------------------------------------------------------------

CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content_json JSONB,
  content_html TEXT,
  template TEXT NOT NULL DEFAULT 'default',
  status public.content_status NOT NULL DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  og_image_id UUID REFERENCES public.media_files (id) ON DELETE SET NULL,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Audit log
-- ---------------------------------------------------------------------------

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

-- ---------------------------------------------------------------------------
-- Seed tracking
-- ---------------------------------------------------------------------------

CREATE TABLE public.app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER theme_settings_updated_at
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER seo_defaults_updated_at
  BEFORE UPDATE ON public.seo_defaults
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER analytics_settings_updated_at
  BEFORE UPDATE ON public.analytics_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
