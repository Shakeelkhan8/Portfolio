-- Portfolio QR code: CMS-managed image + target URL (no hardcoded site asset)

alter table public.site_settings
  add column if not exists qr_code_media_id uuid references public.media_files (id) on delete set null,
  add column if not exists qr_target_url text,
  add column if not exists qr_label text,
  add column if not exists qr_enabled boolean not null default true;

comment on column public.site_settings.qr_code_media_id is
  'Media file (SVG/PNG) shown as the public portfolio QR code.';
comment on column public.site_settings.qr_target_url is
  'URL encoded when generating the QR; informational for admins.';
comment on column public.site_settings.qr_label is
  'Caption under the QR on the public site.';
comment on column public.site_settings.qr_enabled is
  'When false, the public site hides the QR even if media is set.';

create index if not exists site_settings_qr_code_media_id_idx
  on public.site_settings (qr_code_media_id);
