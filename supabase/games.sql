-- ============================================================================
-- Chạy file này trong Supabase SQL Editor TRƯỚC KHI chạy script import-games.ts
-- ============================================================================

-- 1. Tạo bảng games
create table if not exists public.games (
  id          text primary key,
  slug        text unique not null,
  title       text not null,
  description text not null default '',
  instructions text not null default '',
  url         text not null,
  category_id text not null default 'action',
  tags        text[] not null default '{}',
  thumb       text not null default '',
  width       integer not null default 800,
  height      integer not null default 600,
  source      text not null default 'gamemonetize',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. Index
create index if not exists idx_games_category_id on public.games (category_id);
create index if not exists idx_games_slug on public.games (slug);

-- 3. Enable RLS
alter table public.games enable row level security;

-- 4. READ: Public catalog — anon & authenticated
create policy "Games are viewable by everyone"
  on public.games
  for select
  to anon, authenticated
  using (true);

-- 5. WRITE: KHÔNG tạo policy INSERT/UPDATE/DELETE cho public/anon.
--    Khi RLS được bật + không có policy = anon bị chặn hoàn toàn.
--    Script import-games.ts dùng service_role key (bypass RLS) để ghi.
--    Nếu cần service_role cũng bị giới hạn, tạo policy với `to service_role`.
