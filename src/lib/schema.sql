create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- 2. ACADEMIC HUB
-- ==========================================

-- Subjects Table
create table public.subjects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  semester_label text, -- e.g., "Fall 2025"
  professor_name text,
  credits int default 3,
  target_attendance int default 75,
  created_at timestamptz default now()
);

-- Chapters / Syllabus Table
create table public.chapters (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  title text not null,
  status text check (status in ('not_started', 'learning', 'reviewing', 'mastered')) default 'not_started',
  revision_count int default 0,
  created_at timestamptz default now()
);

-- Attendance Logs Table
create table public.attendance_logs (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  date date default current_date,
  status text check (status in ('present', 'absent', 'cancelled')) not null,
  created_at timestamptz default now()
);

-- Enable RLS for Academic Hub
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.attendance_logs enable row level security;

-- Policies
create policy "Users can manage their own subjects"
  on public.subjects for all using (auth.uid() = user_id);

create policy "Users can manage chapters for their subjects"
  on public.chapters for all using (
    exists (select 1 from public.subjects where subjects.id = chapters.subject_id and subjects.user_id = auth.uid())
  );

create policy "Users can manage attendance for their subjects"
  on public.attendance_logs for all using (
    exists (select 1 from public.subjects where subjects.id = attendance_logs.subject_id and subjects.user_id = auth.uid())
  );


-- ==========================================
-- 3. PRODUCTIVITY HUB
-- ==========================================

-- Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  deadline timestamptz,
  color_tag text default '#3b82f6', -- blue-500
  status text check (status in ('active', 'completed', 'archived')) default 'active',
  created_at timestamptz default now()
);

-- Tasks Table (Kanban)
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  project_id uuid references public.projects(id) on delete set null, -- Can be standalone
  title text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('backlog', 'todo', 'in_progress', 'review', 'done')) default 'todo',
  due_date timestamptz,
  is_recurring boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS for Productivity Hub
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Policies
create policy "Users can manage their own projects"
  on public.projects for all using (auth.uid() = user_id);

create policy "Users can manage their own tasks"
  on public.tasks for all using (auth.uid() = user_id);


-- ==========================================
-- 4. VITALITY HUB
-- ==========================================

-- Daily Metrics Table
create table public.daily_metrics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  date date default current_date,
  calories_consumed int default 0,
  protein_consumed int default 0, -- in grams
  water_intake int default 0, -- in ml
  mood_rating int check (mood_rating >= 1 and mood_rating <= 10),
  sleep_hours numeric(3, 1),
  created_at timestamptz default now(),
  unique(user_id, date) -- One entry per day per user
);

-- Enable RLS for Vitality Hub
alter table public.daily_metrics enable row level security;

-- Policies
-- ==========================================
-- 5. INSTITUTIONS
-- ==========================================

create table public.institutions (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  type text, -- 'college', 'school', 'university', etc.
  created_at timestamptz default now()
);

-- Add institution_id to profiles
alter table public.profiles add column institution_id uuid references public.institutions(id);

-- Enable RLS for Institutions
alter table public.institutions enable row level security;

-- Policies
create policy "Institutions are viewable by everyone"
  on public.institutions for select
  using (true);

create policy "Authenticated users can insert institutions"
  on public.institutions for insert
  with check (auth.role() = 'authenticated');


-- ==========================================
-- 6. RESOURCES
-- ==========================================

create table public.resources (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  type text check (type in ('pdf', 'word', 'image', 'link')) not null,
  url text not null,
  project_id uuid references public.projects(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete cascade,
  created_at timestamptz default now(),
  -- Ensure a resource belongs to EITHER a project OR a chapter, not both (optional, but good practice)
  constraint resource_belongs_to_one_entity check (
    (project_id is not null and chapter_id is null) or
    (project_id is null and chapter_id is not null)
  )
);

-- Enable RLS for Resources
alter table public.resources enable row level security;

-- Policies
create policy "Users can manage their own resources"
  on public.resources for all
  using (auth.uid() = user_id);

-- Update resources type check to allow 'other'
-- Run this in your Supabase SQL Editor if you have already created the table
-- alter table public.resources drop constraint if exists resources_type_check;
-- alter table public.resources add constraint resources_type_check check (type in ('pdf', 'word', 'image', 'link', 'other'));
