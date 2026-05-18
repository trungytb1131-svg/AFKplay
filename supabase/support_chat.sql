-- Bảng phòng chat hỗ trợ
CREATE TABLE IF NOT EXISTS public.support_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bảng tin nhắn
CREATE TABLE IF NOT EXISTS public.support_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.support_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_support_rooms_user ON public.support_rooms(user_id, status);
CREATE INDEX IF NOT EXISTS idx_support_messages_room ON public.support_messages(room_id, created_at);

-- RLS
ALTER TABLE public.support_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Policy: user đọc phòng của mình
DROP POLICY IF EXISTS "Users view own rooms" ON public.support_rooms;
CREATE POLICY "Users view own rooms"
  ON public.support_rooms FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: user tạo phòng
DROP POLICY IF EXISTS "Users create rooms" ON public.support_rooms;
CREATE POLICY "Users create rooms"
  ON public.support_rooms FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: user đọc tin nhắn trong phòng của mình
DROP POLICY IF EXISTS "Users view own messages" ON public.support_messages;
CREATE POLICY "Users view own messages"
  ON public.support_messages FOR SELECT
  TO authenticated
  USING (room_id IN (
    SELECT id FROM public.support_rooms WHERE user_id = auth.uid()
  ));

-- Policy: user gửi tin nhắn
DROP POLICY IF EXISTS "Users send messages" ON public.support_messages;
CREATE POLICY "Users send messages"
  ON public.support_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND room_id IN (SELECT id FROM public.support_rooms WHERE user_id = auth.uid())
  );

-- Policy: admin toàn quyền trên support_rooms
DROP POLICY IF EXISTS "Admin full access rooms" ON public.support_rooms;
CREATE POLICY "Admin full access rooms"
  ON public.support_rooms FOR ALL
  TO authenticated
  USING (auth.uid() = 'bcee7d8e-38df-4c0f-aedd-978e6efcd3ed');

-- Policy: admin toàn quyền trên support_messages
DROP POLICY IF EXISTS "Admin full access messages" ON public.support_messages;
CREATE POLICY "Admin full access messages"
  ON public.support_messages FOR ALL
  TO authenticated
  USING (auth.uid() = 'bcee7d8e-38df-4c0f-aedd-978e6efcd3ed');
