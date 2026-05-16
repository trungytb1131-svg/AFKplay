-- ============================================================================
-- 🔒 SECURITY FIX: Chạy NGAY trong Supabase SQL Editor
--    Xoá các policy INSERT/UPDATE mở toang cho anon trên bảng games.
-- ============================================================================

-- 1. Xoá policy cũ (mở cho anon)
drop policy if exists "Allow insert for import script" on public.games;
drop policy if exists "Allow update for import script" on public.games;
drop policy if exists "Only service_role can insert" on public.games;
drop policy if exists "Only service_role can update" on public.games;
drop policy if exists "Only service_role can delete" on public.games;

-- 2. Bật RLS trên bảng profiles (nếu chưa bật)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Thêm policy SELECT cho authenticated (leaderboard)
DROP POLICY IF EXISTS "Authenticated can read all profiles" ON public.profiles;
CREATE POLICY "Authenticated can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Thêm policy UPDATE (chỉ được sửa profile của mình)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 5. Xác nhận hoàn tất
--    - games: chỉ SELECT cho anon, không có INSERT/UPDATE/DELETE
--    - profiles: SELECT cho authenticated, UPDATE chỉ profile của mình
