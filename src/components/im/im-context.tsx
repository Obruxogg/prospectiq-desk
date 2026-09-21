import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

// ============================================================
// TYPES
// ============================================================
export type Role = "admin" | "manager" | "seller";

export interface IMProfile {
  id: string;
  auth_user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  team_id: string | null;
  status: "active" | "inactive";
  must_change_password: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisualSettings {
  id: string;
  institution_name: string;
  unit_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  default_course_image: string | null;
  student_mode_copy: string;
}

// Demo profiles (used before DB migration is applied)
export const DEMO_PROFILES: IMProfile[] = [
  {
    id: "22222222-2222-2222-2222-222222222221",
    auth_user_id: null,
    name: "Roberto Albuquerque",
    email: "admin@institutomix.com.br",
    phone: "(11) 98765-4321",
    role: "admin",
    team_id: "11111111-1111-1111-1111-111111111111",
    status: "active",
    must_change_password: false,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    auth_user_id: null,
    name: "Mariana Souza",
    email: "gerente@institutomix.com.br",
    phone: "(11) 98765-4322",
    role: "manager",
    team_id: "11111111-1111-1111-1111-111111111111",
    status: "active",
    must_change_password: false,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222223",
    auth_user_id: null,
    name: "Carlos Eduardo",
    email: "carlos@institutomix.com.br",
    phone: "(11) 98765-4323",
    role: "seller",
    team_id: "11111111-1111-1111-1111-111111111111",
    status: "active",
    must_change_password: false,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222224",
    auth_user_id: null,
    name: "Fernanda Lima",
    email: "fernanda@institutomix.com.br",
    phone: "(11) 98765-4324",
    role: "seller",
    team_id: "11111111-1111-1111-1111-111111111111",
    status: "active",
    must_change_password: false,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_VISUAL_SETTINGS: VisualSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  institution_name: "Instituto Mix de Profiss├Áes",
  unit_name: "Unidade Centro Comercial",
  logo_url: null,
  favicon_url: null,
  primary_color: "#c62828",
  secondary_color: "#7f1d1d",
  accent_color: "#d97706",
  default_course_image:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  student_mode_copy:
    "Transforme seu futuro profissional com a qualidade e certifica├º├úo reconhecida do Instituto Mix. Garanta sua vaga com benef├¡cios exclusivos por tempo limitado!",
};

// ============================================================
// PERMISSIONS HELPER
// ============================================================
export function can(profile: IMProfile | null, action: string): boolean {
  if (!profile) return false;
  const { role } = profile;
  const rules: Record<string, Role[]> = {
    view_all_students: ["admin", "manager"],
    view_team_students: ["admin", "manager"],
    create_seller: ["admin", "manager"],
    deactivate_seller: ["admin", "manager"],
    transfer_wallet: ["admin", "manager"],
    manage_catalog: ["admin"],
    manage_branding: ["admin"],
    manage_rules: ["admin"],
    view_audit: ["admin", "manager"],
    pause_timer: ["admin", "manager", "seller"],
    extend_timer: ["admin", "manager"],
    override_discount: ["admin", "manager"],
  };
  return rules[action]?.includes(role) ?? true;
}

// ============================================================
// CONTEXT
// ============================================================
interface IMContextValue {
  // Auth / Profile
  authUser: User | null;
  profile: IMProfile | null;
  visualSettings: VisualSettings;
  isDemoMode: boolean;
  // Actions
  setProfile: (p: IMProfile | null) => void;
  setVisualSettings: (s: VisualSettings) => void;
  setIsDemoMode: (v: boolean) => void;
  can: (action: string) => boolean;
}

const IMContext = createContext<IMContextValue | null>(null);

export function IMProvider({
  children,
  authUser,
  initialProfile,
  initialVisualSettings,
  isDemoMode: initialDemoMode,
}: {
  children: ReactNode;
  authUser: User | null;
  initialProfile: IMProfile | null;
  initialVisualSettings?: VisualSettings;
  isDemoMode?: boolean;
}) {
  const [profile, setProfile] = useState<IMProfile | null>(initialProfile);
  const [visualSettings, setVisualSettings] = useState<VisualSettings>(
    initialVisualSettings ?? DEFAULT_VISUAL_SETTINGS
  );
  const [isDemoMode, setIsDemoMode] = useState(initialDemoMode ?? false);

  const checkCan = useCallback(
    (action: string) => can(profile, action),
    [profile]
  );

  return (
    <IMContext.Provider
      value={{
        authUser,
        profile,
        visualSettings,
        isDemoMode,
        setProfile,
        setVisualSettings,
        setIsDemoMode,
        can: checkCan,
      }}
    >
      {children}
    </IMContext.Provider>
  );
}

export function useIM() {
  const ctx = useContext(IMContext);
  if (!ctx) throw new Error("useIM must be used inside IMProvider");
  return ctx;
}
