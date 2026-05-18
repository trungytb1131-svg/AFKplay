import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  const { count: total } = await admin
    .from("games")
    .select("*", { count: "exact", head: true });

  const { count: featured } = await admin
    .from("games")
    .select("*", { count: "exact", head: true })
    .eq("featured", true);

  return NextResponse.json({ total, featured });
}
