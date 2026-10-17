-- Execute somente este arquivo no SQL Editor (uma vez).
-- Mantém as tabelas já criadas.
create table if not exists public.site_content (
 section text primary key,
 records jsonb not null default '[]'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
drop policy if exists "gantus_public_read_content" on public.site_content;
create policy "gantus_public_read_content" on public.site_content for select to anon, authenticated using (true);
drop policy if exists "gantus_admin_insert_content" on public.site_content;
create policy "gantus_admin_insert_content" on public.site_content for insert to authenticated with check ((select public.is_gantus_admin()));
drop policy if exists "gantus_admin_update_content" on public.site_content;
create policy "gantus_admin_update_content" on public.site_content for update to authenticated using ((select public.is_gantus_admin())) with check ((select public.is_gantus_admin()));
drop policy if exists "gantus_admin_delete_content" on public.site_content;
create policy "gantus_admin_delete_content" on public.site_content for delete to authenticated using ((select public.is_gantus_admin()));
-- Bucket existente no SQL original; garanta que seja público para fotos de anúncios.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('gantus-media','gantus-media',true,47185920,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'])
on conflict (id) do update set public=true,file_size_limit=47185920,allowed_mime_types=excluded.allowed_mime_types;
