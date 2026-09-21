import { useState } from "react";
import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useIM } from "@/components/im/im-context";
import {
  ChevronRight,
  Columns3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings2,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/simulation", label: "Nova Simulação", icon: Plus },
  { to: "/contacts", label: "Meus Contatos", icon: UsersRound },
  { to: "/crm", label: "Meu CRM", icon: Columns3 },
  { to: "/proposals", label: "Minhas Propostas", icon: WalletCards },
  { to: "/catalog", label: "Configurações", icon: Settings2 },
] as const;

export function IMShell() {
  const { profile, visualSettings, isDemoMode } = useIM();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.info("Você saiu do sistema.");
  }

  const logoUrl = visualSettings?.logo_url;
  const institutionName = visualSettings?.institution_name ?? "Instituto Mix";
  const unitName = visualSettings?.unit_name ?? "";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-[#7f1d1d] text-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex
        `}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          {logoUrl ? (
            <img src={logoUrl} alt={institutionName} className="h-9 w-auto object-contain" />
          ) : (
            <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight truncate">{institutionName}</p>
            {unitName && (
              <p className="text-xs text-white/60 truncate">{unitName}</p>
            )}
          </div>
          <button
            className="ml-auto md:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isDemoMode && (
          <div className="mx-4 mt-3 rounded-md bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 text-center">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Modo Demonstração
            </span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath === to || currentPath.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to as any}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-150 group
                  ${isActive
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <UserRound className="h-4 w-4 text-white/80" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {profile?.name ?? "Usuário"}
              </p>
              <p className="text-xs text-white/50 truncate">
                {profile?.role === "admin"
                  ? "Administrador"
                  : profile?.role === "manager"
                    ? "Gerente"
                    : "Consultor"}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sair"
              className="text-white/50 hover:text-white transition-colors p-1 rounded"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-4 h-14 border-b border-border bg-white md:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">{institutionName}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
