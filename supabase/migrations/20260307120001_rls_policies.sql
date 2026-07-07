-- Row Level Security policies for Portfolio CMS

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.philosophy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_category_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_future_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_architecture_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_meta ENABLE ROW LEVEL SECURITY;

-- Admin users: admins can read their own row; service role manages inserts
CREATE POLICY admin_users_select_own
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY admin_users_admin_all
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Macro for public-readable CMS tables (published content or visible items)
-- Site-wide settings: public read, admin write
CREATE POLICY site_settings_public_read ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY site_settings_admin_write ON public.site_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY theme_settings_public_read ON public.theme_settings FOR SELECT USING (TRUE);
CREATE POLICY theme_settings_admin_write ON public.theme_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY seo_defaults_public_read ON public.seo_defaults FOR SELECT USING (TRUE);
CREATE POLICY seo_defaults_admin_write ON public.seo_defaults FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY analytics_settings_public_read ON public.analytics_settings FOR SELECT USING (TRUE);
CREATE POLICY analytics_settings_admin_write ON public.analytics_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY custom_scripts_public_read ON public.custom_scripts FOR SELECT USING (enabled = TRUE);
CREATE POLICY custom_scripts_admin_write ON public.custom_scripts FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY social_links_public_read ON public.social_links FOR SELECT USING (visible = TRUE);
CREATE POLICY social_links_admin_write ON public.social_links FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY navigation_items_public_read ON public.navigation_items FOR SELECT USING (visible = TRUE);
CREATE POLICY navigation_items_admin_write ON public.navigation_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY section_headers_public_read ON public.section_headers FOR SELECT USING (visible = TRUE);
CREATE POLICY section_headers_admin_write ON public.section_headers FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY cta_sections_public_read ON public.cta_sections FOR SELECT USING (visible = TRUE);
CREATE POLICY cta_sections_admin_write ON public.cta_sections FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY philosophy_items_public_read ON public.philosophy_items FOR SELECT USING (TRUE);
CREATE POLICY philosophy_items_admin_write ON public.philosophy_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY expertise_items_public_read ON public.expertise_items FOR SELECT USING (TRUE);
CREATE POLICY expertise_items_admin_write ON public.expertise_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY about_paragraphs_public_read ON public.about_paragraphs FOR SELECT USING (TRUE);
CREATE POLICY about_paragraphs_admin_write ON public.about_paragraphs FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY languages_public_read ON public.languages FOR SELECT USING (TRUE);
CREATE POLICY languages_admin_write ON public.languages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY achievements_public_read ON public.achievements FOR SELECT USING (TRUE);
CREATE POLICY achievements_admin_write ON public.achievements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY media_files_public_read ON public.media_files FOR SELECT USING (TRUE);
CREATE POLICY media_files_admin_write ON public.media_files FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY skill_categories_public_read ON public.skill_categories FOR SELECT USING (TRUE);
CREATE POLICY skill_categories_admin_write ON public.skill_categories FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY skills_public_read ON public.skills FOR SELECT USING (TRUE);
CREATE POLICY skills_admin_write ON public.skills FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY experiences_public_read ON public.experiences FOR SELECT USING (TRUE);
CREATE POLICY experiences_admin_write ON public.experiences FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY experience_highlights_public_read ON public.experience_highlights FOR SELECT USING (TRUE);
CREATE POLICY experience_highlights_admin_write ON public.experience_highlights FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY experience_technologies_public_read ON public.experience_technologies FOR SELECT USING (TRUE);
CREATE POLICY experience_technologies_admin_write ON public.experience_technologies FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY educations_public_read ON public.educations FOR SELECT USING (TRUE);
CREATE POLICY educations_admin_write ON public.educations FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY education_achievements_public_read ON public.education_achievements FOR SELECT USING (TRUE);
CREATE POLICY education_achievements_admin_write ON public.education_achievements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_categories_public_read ON public.project_categories FOR SELECT USING (TRUE);
CREATE POLICY project_categories_admin_write ON public.project_categories FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY projects_public_read ON public.projects FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY projects_admin_all ON public.projects FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_category_map_public_read ON public.project_category_map FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
        AND p.status = 'published'
        AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_category_map_admin_write ON public.project_category_map FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Child project tables inherit published visibility via project join
CREATE POLICY project_tags_public_read ON public.project_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_tags_admin_write ON public.project_tags FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_technologies_public_read ON public.project_technologies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_technologies_admin_write ON public.project_technologies FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_links_public_read ON public.project_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_links_admin_write ON public.project_links FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_metrics_public_read ON public.project_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_metrics_admin_write ON public.project_metrics FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_challenges_public_read ON public.project_challenges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_challenges_admin_write ON public.project_challenges FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_decisions_public_read ON public.project_decisions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_decisions_admin_write ON public.project_decisions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_results_public_read ON public.project_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_results_admin_write ON public.project_results FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_lessons_public_read ON public.project_lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_lessons_admin_write ON public.project_lessons FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_future_improvements_public_read ON public.project_future_improvements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_future_improvements_admin_write ON public.project_future_improvements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_gallery_public_read ON public.project_gallery FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_gallery_admin_write ON public.project_gallery FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY project_architecture_diagrams_public_read ON public.project_architecture_diagrams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.status = 'published' AND p.deleted_at IS NULL
    )
  );
CREATE POLICY project_architecture_diagrams_admin_write ON public.project_architecture_diagrams FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY articles_public_read ON public.articles FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY articles_admin_all ON public.articles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY article_tags_public_read ON public.article_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_id AND a.status = 'published' AND a.deleted_at IS NULL
    )
  );
CREATE POLICY article_tags_admin_write ON public.article_tags FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY certifications_public_read ON public.certifications FOR SELECT USING (visible = TRUE);
CREATE POLICY certifications_admin_write ON public.certifications FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY testimonials_public_read ON public.testimonials FOR SELECT USING (visible = TRUE);
CREATE POLICY testimonials_admin_write ON public.testimonials FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY services_public_read ON public.services FOR SELECT USING (visible = TRUE);
CREATE POLICY services_admin_write ON public.services FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY resume_versions_public_read ON public.resume_versions FOR SELECT USING (is_active = TRUE);
CREATE POLICY resume_versions_admin_write ON public.resume_versions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY contact_submissions_public_insert ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY contact_submissions_admin_all ON public.contact_submissions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY github_settings_public_read ON public.github_settings FOR SELECT USING (TRUE);
CREATE POLICY github_settings_admin_write ON public.github_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY curated_repos_public_read ON public.curated_repos FOR SELECT USING (hidden = FALSE);
CREATE POLICY curated_repos_admin_write ON public.curated_repos FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY pages_public_read ON public.pages FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY pages_admin_all ON public.pages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY audit_logs_admin_read ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin());
CREATE POLICY audit_logs_admin_insert ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY app_meta_admin_read ON public.app_meta FOR SELECT TO authenticated
  USING (public.is_admin());

-- app_meta writes only via service role (seed script)
