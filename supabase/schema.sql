create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (
    category in ('筋力', '柔軟性', 'バランス', '体幹', '腰痛予防', '肩こり', 'ストレス発散', '初心者向け')
  ),
  difficulty text not null check (difficulty in ('かんたん', 'ふつう', 'しっかり')),
  target_scores text[] not null default '{}',
  body_issues text[] not null default '{}',
  job_types text[] not null default '{}',
  age_groups text[] not null default '{}',
  video_url text,
  thumbnail_url text,
  caution text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exercises_active_idx on public.exercises (is_active);
create index if not exists exercises_category_idx on public.exercises (category);
create index if not exists exercises_difficulty_idx on public.exercises (difficulty);

alter table public.exercises enable row level security;

drop policy if exists "Public can read active exercises" on public.exercises;
create policy "Public can read active exercises"
on public.exercises
for select
to anon
using (is_active = true);

drop policy if exists "Service role can manage exercises" on public.exercises;
create policy "Service role can manage exercises"
on public.exercises
for all
to service_role
using (true)
with check (true);
