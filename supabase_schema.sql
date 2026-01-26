-- Create professors table
create table professors (
  id text primary key,
  name text not null,
  designation text not null,
  department text not null,
  image_url text,
  detail_url text,
  qualifications text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table reviews (
  id uuid default gen_random_uuid() primary key,
  professor_id text references professors(id) on delete cascade not null,
  user_email text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  difficulty integer not null check (difficulty >= 1 and difficulty <= 5),
  would_take_again boolean not null,
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index reviews_professor_id_idx on reviews(professor_id);
create index professors_name_idx on professors(name);
create index professors_department_idx on professors(department);

-- Enable Row Level Security (RLS)
alter table professors enable row level security;
alter table reviews enable row level security;

-- Policies for Professors
-- Everyone can view professors
create policy "Public professors are viewable by everyone"
  on professors for select
  using ( true );

-- Only authenticated backend can insert (we'll just use anon key with policy or service role for seeding, 
-- but simpler for now: allow anon insert for seeding then disable, or just allow anyone to insert if we trust the seeding script)
-- Better: Public Read, Authenticated Insert (but we are seeding from script which is 'anon' usually unless using service role)

-- Let's stick to simple policies for this MVP
-- Allow anyone to read
create policy "Everyone can read professors" on professors for select using (true);
create policy "Everyone can insert professors (for seeding)" on professors for insert with check (true);

-- Policies for Reviews
-- Everyone can read
create policy "Reviews are viewable by everyone" on reviews for select using (true);
-- Authenticated users can insert
create policy "Authenticated users can insert reviews" on reviews for insert with check (auth.role() = 'authenticated' or true); 
-- (Note: 'or true' is insecure for production but enables our local seed/test easily. 
-- In production remove 'or true' and assume users are logged in via Supabase Auth.
-- Since we use Auth0, 'auth.role()' might not match unless we sync tokens.
-- For this starter, we'll allow public inserts but in the app we only show form when logged in.)

create policy "Anyone can insert reviews" on reviews for insert with check (true);
