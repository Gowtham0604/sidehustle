-- SideHustlesJob production schema.
-- This migration is intentionally schema-only: it contains no seed or demo data.

begin;

create schema if not exists extensions;
create extension if not exists postgis with schema extensions;

-- Keep trigger implementation outside the API-exposed public schema.
create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  logo_url text,
  tagline text,
  description text,
  company_type text not null,
  stage text,
  sector text,
  tags text[],
  area text not null,
  address text,
  maps_url text,
  location extensions.geography(Point, 4326) not null,
  founded_year smallint,
  team_size text,
  funding text,
  investors text[],
  founders jsonb,
  website_url text,
  linkedin_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint companies_name_not_blank check (length(btrim(name)) > 0),
  constraint companies_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint companies_slug_unique unique (slug),
  constraint companies_company_type_not_blank check (length(btrim(company_type)) > 0),
  constraint companies_area_not_blank check (length(btrim(area)) > 0),
  constraint companies_stage_not_blank check (stage is null or length(btrim(stage)) > 0),
  constraint companies_sector_not_blank check (sector is null or length(btrim(sector)) > 0),
  constraint companies_team_size_not_blank check (team_size is null or length(btrim(team_size)) > 0),
  constraint companies_funding_not_blank check (funding is null or length(btrim(funding)) > 0),
  constraint companies_founded_year_reasonable check (
    founded_year is null or founded_year between 1800 and 2100
  ),
  constraint companies_tags_limit check (tags is null or cardinality(tags) <= 50),
  constraint companies_investors_limit check (investors is null or cardinality(investors) <= 50),
  constraint companies_founders_is_array check (
    founders is null or jsonb_typeof(founders) = 'array'
  ),
  constraint companies_logo_url_not_blank check (
    logo_url is null or length(btrim(logo_url)) > 0
  ),
  constraint companies_website_url_format check (
    website_url is null or website_url ~* '^https?://[^[:space:]]+$'
  ),
  constraint companies_maps_url_format check (
    maps_url is null or maps_url ~* '^https?://[^[:space:]]+$'
  ),
  constraint companies_linkedin_url_format check (
    linkedin_url is null or linkedin_url ~* '^https?://(www\.)?linkedin\.com/[^[:space:]]+$'
  )
);

create table public.company_submissions (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  website_url text,
  description text,
  company_type text not null,
  stage text,
  sector text,
  area text,
  address text,
  maps_url text,
  submitter_name text,
  submitter_email text,
  status text not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  updated_at timestamptz not null default now(),

  constraint company_submissions_company_name_not_blank check (length(btrim(company_name)) > 0),
  constraint company_submissions_company_type_not_blank check (length(btrim(company_type)) > 0),
  constraint company_submissions_stage_not_blank check (stage is null or length(btrim(stage)) > 0),
  constraint company_submissions_sector_not_blank check (sector is null or length(btrim(sector)) > 0),
  constraint company_submissions_area_not_blank check (area is null or length(btrim(area)) > 0),
  constraint company_submissions_website_url_format check (
    website_url is null or website_url ~* '^https?://[^[:space:]]+$'
  ),
  constraint company_submissions_maps_url_format check (
    maps_url is null or maps_url ~* '^https?://[^[:space:]]+$'
  ),
  constraint company_submissions_email_format check (
    submitter_email is null or submitter_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint company_submissions_status_allowed check (status in ('pending', 'approved', 'rejected')),
  constraint company_submissions_review_state check (
    (status = 'pending' and reviewed_at is null)
    or (status in ('approved', 'rejected') and reviewed_at is not null)
  )
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete restrict,
  type text not null,
  amount_paise integer not null,
  duration_days integer not null,
  payment_method text not null,
  payment_proof_url text,
  status text not null default 'pending',
  starts_at timestamptz,
  ends_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  updated_at timestamptz not null default now(),

  constraint promotions_type_allowed check (type in ('boosted_pin')),
  constraint promotions_amount_positive check (amount_paise > 0),
  constraint promotions_duration_positive check (duration_days > 0),
  constraint promotions_payment_method_not_blank check (length(btrim(payment_method)) > 0),
  constraint promotions_status_allowed check (
    status in ('pending', 'verified', 'active', 'expired', 'rejected', 'cancelled')
  ),
  constraint promotions_schedule_valid check (
    (starts_at is null and ends_at is null)
    or (starts_at is not null and ends_at is not null and ends_at > starts_at)
  ),
  constraint promotions_active_requires_schedule check (
    status <> 'active' or (starts_at is not null and ends_at is not null)
  ),
  constraint promotions_boosted_pin_terms check (
    type <> 'boosted_pin' or (amount_paise = 250000 and duration_days = 7)
  )
);

create index companies_is_active_idx on public.companies (is_active);
create index companies_area_idx on public.companies (area);
create index companies_location_idx on public.companies using gist (location);

create index company_submissions_status_idx on public.company_submissions (status);
create index company_submissions_created_at_idx on public.company_submissions (created_at desc);

create index promotions_company_id_idx on public.promotions (company_id);
create index promotions_status_idx on public.promotions (status);
create index promotions_starts_at_idx on public.promotions (starts_at);
create index promotions_ends_at_idx on public.promotions (ends_at);

create trigger companies_set_updated_at
before update on public.companies
for each row execute function private.set_updated_at();

create trigger company_submissions_set_updated_at
before update on public.company_submissions
for each row execute function private.set_updated_at();

create trigger promotions_set_updated_at
before update on public.promotions
for each row execute function private.set_updated_at();

-- Storage buckets are part of the production configuration and are safe to
-- declare in a migration. Only the backend service credential may write them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('company-logos', 'company-logos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('payment-proofs', 'payment-proofs', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

alter table public.companies enable row level security;
alter table public.company_submissions enable row level security;
alter table public.promotions enable row level security;

revoke all on table public.companies from anon, authenticated;
revoke all on table public.company_submissions from anon, authenticated;
revoke all on table public.promotions from anon, authenticated;

grant select on table public.companies to anon, authenticated;
grant insert (
  company_name,
  website_url,
  description,
  company_type,
  stage,
  sector,
  area,
  address,
  maps_url,
  submitter_name,
  submitter_email
) on table public.company_submissions to anon, authenticated;
grant select on table public.promotions to anon, authenticated;

create policy "public can read active companies"
on public.companies
for select
to anon, authenticated
using (is_active);

create policy "public can submit pending company submissions"
on public.company_submissions
for insert
to anon, authenticated
with check (
  status = 'pending'
  and admin_notes is null
  and reviewed_at is null
);

create policy "public can read currently active promotions"
on public.promotions
for select
to anon, authenticated
using (
  status = 'active'
  and starts_at <= now()
  and ends_at > now()
  and exists (
    select 1
    from public.companies
    where companies.id = promotions.company_id
      and companies.is_active
  )
);

-- company-logos is public for read delivery. There are deliberately no direct
-- client upload/read policies for payment-proofs; service_role bypasses RLS and
-- the backend must issue short-lived signed URLs when an administrator needs one.
create policy "public can read company logo objects"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'company-logos');

commit;
