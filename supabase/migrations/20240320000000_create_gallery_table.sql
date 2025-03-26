create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 RLS（行级安全）
alter table public.gallery enable row level security;

-- 创建策略
create policy "Enable read access for all users" on public.gallery
  for select using (true);

create policy "Enable insert for authenticated users only" on public.gallery
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.gallery
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.gallery
  for delete using (auth.role() = 'authenticated');

-- 创建触发器以自动更新 updated_at 字段
create trigger handle_updated_at before update on public.gallery
  for each row execute procedure moddatetime('updated_at'); 