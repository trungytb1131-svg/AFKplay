-- Chạy trong Supabase SQL Editor (một lần)

alter table public.profiles
  add column if not exists coins integer not null default 100,
  add column if not exists stars integer not null default 5,
  add column if not exists rank text not null default 'bronze',
  add column if not exists last_coin_at timestamptz not null default now();

-- Tài khoản cũ: gán mặc định nếu null
update public.profiles
set
  coins = coalesce(coins, 100),
  stars = coalesce(stars, 5),
  rank = coalesce(rank, 'bronze'),
  last_coin_at = coalesce(last_coin_at, created_at, now())
where coins is null or stars is null or rank is null or last_coin_at is null;

-- 1. Enable RLS trên profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Authenticated users đọc được mọi profile (cần cho leaderboard)
CREATE POLICY "Authenticated can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Policy: Người dùng chỉ cập nhật được profile của chính mình
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 4. Policy: Cho phép insert (trigger handle_new_user + đăng ký mới)
CREATE POLICY "Allow insert"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Trigger tạo profile khi đăng ký (nếu chưa có)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, coins, stars, rank, last_coin_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    100,
    5,
    'bronze',
    now()
  )
  on conflict (id) do update set
    username = coalesce(excluded.username, profiles.username),
    email = coalesce(excluded.email, profiles.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
