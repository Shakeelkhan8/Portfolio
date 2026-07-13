-- About page Languages section visibility (admin toggle on Languages page)

alter table public.site_settings
  add column if not exists languages_visible boolean not null default true;

comment on column public.site_settings.languages_visible is
  'When false, the About page hides the Languages section. Language rows are kept.';
