create table if not exists public.settings (
  id uuid default gen_random_uuid() primary key,
  site_title text not null default '宝宝成长记录',
  site_description text default '记录宝宝成长的每一个精彩瞬间',
  baby_name text,
  baby_birthday date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint single_row check (id = '00000000-0000-0000-0000-000000000000')
);

-- 插入默认设置
insert into public.settings (id)
values ('00000000-0000-0000-0000-000000000000')
on conflict (id) do nothing;

-- 启用 RLS（行级安全）
alter table public.settings enable row level security;

-- 创建策略
create policy "Enable read access for all users" on public.settings
  for select using (true);

create policy "Enable insert/update/delete for authenticated users only" on public.settings
  for all using (auth.role() = 'authenticated');

-- 创建触发器以自动更新 updated_at 字段
create trigger handle_updated_at before update on public.settings
  for each row execute procedure moddatetime('updated_at'); 