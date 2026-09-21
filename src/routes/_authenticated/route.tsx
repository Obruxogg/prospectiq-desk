import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { IMShell } from "@/components/im/app-shell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Check if we are in demo mode via localStorage (client side only)
    if (typeof window !== "undefined") {
      const isDemo = localStorage.getItem("im_demo_mode") === "true";
      if (isDemo) return { user: null };
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
});

function ProtectedLayout() {
  const { user } = Route.useRouteContext();
  return <IMShell />;
}
