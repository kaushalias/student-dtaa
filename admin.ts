import { serverSupabase } from "@/lib/supabase";

export async function requireAdmin(request: Request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return { error: "Unauthorized", status: 401 as const };
  const supabase = serverSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return { error: "Invalid session", status: 401 as const };
  const { data: admin, error } = await supabase.from("admins").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  if (error || !admin) return { error: "Admin access required", status: 403 as const };
  return { supabase, user: userData.user };
}
