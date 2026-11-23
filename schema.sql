-- Run this entire file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_codes (
  code text primary key,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.student_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  mobile_number text not null,
  whatsapp_number text not null,
  promo_code text not null references public.promo_codes(code),
  consent boolean not null default false,
  lead_status text not null default 'New'
    check (lead_status in ('New','Contacted','Interested','Converted','Not Interested')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create index if not exists student_leads_created_at_idx on public.student_leads(created_at desc);
create index if not exists student_leads_email_idx on public.student_leads(email);
create index if not exists student_leads_promo_idx on public.student_leads(promo_code);

alter table public.admins enable row level security;
alter table public.promo_codes enable row level security;
alter table public.student_leads enable row level security;

-- No public table access. The server uses the service-role key only after
-- checking the authenticated user against the admins table.
revoke all on public.admins from anon, authenticated;
revoke all on public.student_leads from anon, authenticated;
revoke all on public.promo_codes from anon, authenticated;

-- Add your first promo code. Change START2026 to the code you want students to use.
insert into public.promo_codes(code,description,active)
values ('START2026','Default campaign promo code',true)
on conflict (code) do nothing;

-- After creating an admin user in Supabase Authentication > Users,
-- copy that user's UUID and run:
-- insert into public.admins(user_id) values ('PASTE-AUTH-USER-UUID-HERE');
