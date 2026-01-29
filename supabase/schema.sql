-- Flow State Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  cycle_length integer default 28,
  period_length integer default 5,
  last_period_start date,
  chronotype text check (chronotype in ('early_bird', 'night_owl', 'third_bird')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Energy logs
create table public.energy_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  timestamp timestamptz default now(),
  energy_level integer check (energy_level >= 1 and energy_level <= 10),
  mood text check (mood in ('great', 'good', 'okay', 'low', 'rough')),
  focus text check (focus in ('sharp', 'good', 'scattered', 'foggy')),
  notes text,
  cycle_day integer,
  cycle_phase text check (cycle_phase in ('menstrual', 'follicular', 'ovulation', 'luteal')),
  created_at timestamptz default now()
);

-- Symptom logs
create table public.symptom_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  timestamp timestamptz default now(),
  date date default current_date,
  cycle_day integer,
  cycle_phase text check (cycle_phase in ('menstrual', 'follicular', 'ovulation', 'luteal')),
  -- Symptoms (0 = none, 1 = mild, 2 = moderate, 3 = severe)
  cramps integer default 0 check (cramps >= 0 and cramps <= 3),
  headache integer default 0 check (headache >= 0 and headache <= 3),
  bloating integer default 0 check (bloating >= 0 and bloating <= 3),
  breast_tenderness integer default 0 check (breast_tenderness >= 0 and breast_tenderness <= 3),
  acne integer default 0 check (acne >= 0 and acne <= 3),
  fatigue integer default 0 check (fatigue >= 0 and fatigue <= 3),
  cravings integer default 0 check (cravings >= 0 and cravings <= 3),
  mood_swings integer default 0 check (mood_swings >= 0 and mood_swings <= 3),
  anxiety integer default 0 check (anxiety >= 0 and anxiety <= 3),
  -- Sleep
  sleep_hours numeric(3,1),
  sleep_quality text check (sleep_quality in ('great', 'good', 'okay', 'poor', 'terrible')),
  -- Exercise
  exercised boolean default false,
  exercise_type text,
  exercise_minutes integer,
  -- Notes
  notes text,
  created_at timestamptz default now()
);

-- Period tracking
create table public.period_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  start_date date not null,
  end_date date,
  flow_intensity text check (flow_intensity in ('light', 'medium', 'heavy')),
  notes text,
  created_at timestamptz default now()
);

-- Goals
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  cognitive_load text check (cognitive_load in ('deep', 'medium', 'light', 'autopilot')),
  status text default 'active' check (status in ('active', 'completed', 'paused')),
  progress integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.energy_logs enable row level security;
alter table public.symptom_logs enable row level security;
alter table public.period_logs enable row level security;
alter table public.goals enable row level security;

-- RLS Policies (users can only see their own data)
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can view own energy logs" on public.energy_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own energy logs" on public.energy_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can view own symptom logs" on public.symptom_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own symptom logs" on public.symptom_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can view own period logs" on public.period_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own period logs" on public.period_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can update own period logs" on public.period_logs
  for update using (auth.uid() = user_id);

create policy "Users can view own goals" on public.goals
  for select using (auth.uid() = user_id);

create policy "Users can insert own goals" on public.goals
  for insert with check (auth.uid() = user_id);

create policy "Users can update own goals" on public.goals
  for update using (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'User'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index energy_logs_user_timestamp on public.energy_logs(user_id, timestamp desc);
create index symptom_logs_user_date on public.symptom_logs(user_id, date desc);
create index period_logs_user_start on public.period_logs(user_id, start_date desc);
