import { createClient } from '@supabase/supabase-js';

// Sử dụng .trim() để loại bỏ mọi khoảng trắng hoặc ký tự xuống dòng dư thừa
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

// Kiểm tra xem chìa khóa có tồn tại không trước khi khởi tạo
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);