import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
}

function hasCredentials(): boolean {
  return !!(getSupabaseUrl() && getSupabaseAnonKey());
}

let _client: SupabaseClient | null = null;

function initClient(): SupabaseClient {
  if (_client) return _client;

  if (!hasCredentials()) {
    const msg = "Supabase URL or Anon Key is missing";
    if (typeof window === "undefined") {
      console.warn(msg + " — build/SSG context, client deferred");
    } else {
      console.error(msg + " in .env.local");
    }
    throw new Error(msg);
  }

  _client = createClient(getSupabaseUrl(), getSupabaseAnonKey());
  return _client;
}

function createSafeProxy(): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_, prop) {
      const client = initClient();
      const value = (client as any)[prop];
      if (typeof value === "function") {
        return value.bind(client);
      }
      return value;
    },
  });
}

export const supabase = createSafeProxy();
