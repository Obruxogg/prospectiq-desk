import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ensureInitialRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true });
    if (countError) throw countError;
    if ((count ?? 0) === 0) {
      const { error } = await supabaseAdmin.from("user_roles").insert({
        user_id: context.userId,
        role: "admin",
      });
      if (error) throw error;
      return { role: "admin" as const };
    }
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("active", true)
      .maybeSingle();
    if (error) throw error;
    return { role: data?.role ?? null };
  });
