import { supabase } from "@/integrations/supabase/client";
import type { IMProfile, VisualSettings } from "@/components/im/im-context";
import { DEFAULT_VISUAL_SETTINGS, DEMO_PROFILES } from "@/components/im/im-context";

// ============================================================
// VISUAL SETTINGS
// ============================================================
export async function fetchVisualSettings(): Promise<VisualSettings> {
  try {
    const { data, error } = await supabase
      .from("visual_settings")
      .select("*")
      .limit(1)
      .single();
    if (error || !data) return DEFAULT_VISUAL_SETTINGS;
    return data as unknown as VisualSettings;
  } catch {
    return DEFAULT_VISUAL_SETTINGS;
  }
}

export async function updateVisualSettings(
  id: string,
  updates: Partial<VisualSettings>
): Promise<VisualSettings> {
  const { data, error } = await supabase
    .from("visual_settings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as VisualSettings;
}

// ============================================================
// PROFILES
// ============================================================
export async function fetchProfileByAuthId(authUserId: string): Promise<IMProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .eq("status", "active")
      .single();
    if (error || !data) return null;
    return data as unknown as IMProfile;
  } catch {
    return null;
  }
}

export async function fetchProfileById(id: string): Promise<IMProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as unknown as IMProfile;
  } catch {
    return null;
  }
}

export async function fetchAllProfiles(teamId?: string): Promise<IMProfile[]> {
  try {
    let query = supabase.from("profiles").select("*").order("name");
    if (teamId) query = query.eq("team_id", teamId);
    const { data, error } = await query;
    if (error || !data) return DEMO_PROFILES;
    return data as unknown as IMProfile[];
  } catch {
    return DEMO_PROFILES;
  }
}

export async function createProfile(profile: Omit<IMProfile, "id" | "created_at" | "updated_at">): Promise<IMProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as IMProfile;
}

export async function updateProfile(id: string, updates: Partial<IMProfile>): Promise<IMProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as IMProfile;
}

// ============================================================
// AREAS
// ============================================================
export interface Area {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  display_order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export const DEMO_AREAS: Area[] = [
  { id: "33333333-3333-3333-3333-333333333331", name: "Beleza e Est├®tica", description: "Cabeleireiro, Barbearia, Maquiagem e Est├®tica Facial", icon: "Scissors", color: "#c62828", display_order: 1, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "33333333-3333-3333-3333-333333333332", name: "Sa├║de e Cuidados", description: "Auxiliar de Veterin├íria, Cuidador de Idosos e Massoterapia", icon: "HeartPulse", color: "#0284c7", display_order: 2, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "33333333-3333-3333-3333-333333333333", name: "Tecnologia e Inform├ítica", description: "Manuten├º├úo de Celulares, Inform├ítica e Programa├º├úo", icon: "Laptop", color: "#7c3aed", display_order: 3, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "33333333-3333-3333-3333-333333333334", name: "Gastronomia e Confeitaria", description: "Confeitaria Profissional, Panifica├º├úo e Chef de Cozinha", icon: "ChefHat", color: "#d97706", display_order: 4, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "33333333-3333-3333-3333-333333333335", name: "Gest├úo e Administra├º├úo", description: "Administra├º├úo de Empresas, Recursos Humanos e Vendas", icon: "Briefcase", color: "#059669", display_order: 5, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function fetchAreas(): Promise<Area[]> {
  try {
    const { data, error } = await supabase
      .from("areas")
      .select("*")
      .eq("status", "active")
      .order("display_order");
    if (error || !data || data.length === 0) return DEMO_AREAS;
    return data as unknown as Area[];
  } catch {
    return DEMO_AREAS;
  }
}

export async function upsertArea(area: Partial<Area> & { name: string }): Promise<Area> {
  const { data, error } = await supabase
    .from("areas")
    .upsert(area)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Area;
}

// ============================================================
// COURSES
// ============================================================
export interface Course {
  id: string;
  area_id: string;
  name: string;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  workload_hours: number;
  modality: "Presencial" | "EAD" | "H├¡brido";
  unit: string | null;
  table_price: number;
  included_benefits: string[];
  certification: string | null;
  display_order: number;
  status: "active" | "inactive" | "archived";
  created_at: string;
  updated_at: string;
}

export const DEMO_COURSES: Course[] = [
  { id: "44444444-4444-4444-4444-444444444441", area_id: "33333333-3333-3333-3333-333333333331", name: "Cabeleireiro Profissional Completo", short_description: "Forma├º├úo pr├ítica do b├ísico ao avan├ºado: cortes, colorimetria, qu├¡micas e penteados.", full_description: null, cover_image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80", workload_hours: 120, modality: "Presencial", unit: "Todas as unidades", table_price: 1850.00, included_benefits: ["Material Did├ítico Oficial Incluso", "Certificado de Forma├º├úo Profissional", "Aulas 100% Pr├íticas em Laborat├│rio", "Acesso ao Clube de Vantagens IM"], certification: "Certificado Nacional Instituto Mix", display_order: 1, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "44444444-4444-4444-4444-444444444442", area_id: "33333333-3333-3333-3333-333333333331", name: "Barbeiro Profissional & Visagismo", short_description: "Aprenda t├®cnicas modernas de degrad├¬, barba na toalha quente e gest├úo de barbearia.", full_description: null, cover_image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80", workload_hours: 96, modality: "Presencial", unit: "Todas as unidades", table_price: 1680.00, included_benefits: ["Kit Did├ítico Incluso", "Certifica├º├úo Reconhecida", "M├│dulo de Gest├úo de Neg├│cio"], certification: "Certificado Nacional Instituto Mix", display_order: 2, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "44444444-4444-4444-4444-444444444443", area_id: "33333333-3333-3333-3333-333333333333", name: "Manuten├º├úo de Smartphones & Tablets", short_description: "Diagn├│stico e reparo de hardware e software em aparelhos Android e iOS.", full_description: null, cover_image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", workload_hours: 80, modality: "Presencial", unit: "Todas as unidades", table_price: 1950.00, included_benefits: ["Apostila Digital e Impressa", "Bancada Individual", "Suporte P├│s-Curso com Instrutor"], certification: "Certificado T├®cnico de Manuten├º├úo IM", display_order: 3, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "44444444-4444-4444-4444-444444444444", area_id: "33333333-3333-3333-3333-333333333334", name: "Confeitaria Profissional & Bolos Art├¡sticos", short_description: "Massas, recheios finos, pasta americana, bicos de confeitar e precifica├º├úo.", full_description: null, cover_image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", workload_hours: 100, modality: "Presencial", unit: "Todas as unidades", table_price: 1790.00, included_benefits: ["Ingredientes Inclusos nas Aulas Pr├íticas", "Certificado de Confeiteiro", "Livro de Receitas Exclusivo"], certification: "Certificado Nacional Instituto Mix", display_order: 4, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "44444444-4444-4444-4444-444444444445", area_id: "33333333-3333-3333-3333-333333333332", name: "Auxiliar de Veterin├íria & Pet Care", short_description: "Primeiros socorros animais, aux├¡lio cir├║rgico, vacinas e procedimentos ambulatoriais.", full_description: null, cover_image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80", workload_hours: 120, modality: "Presencial", unit: "Todas as unidades", table_price: 1890.00, included_benefits: ["Est├ígio Pr├ítico Supervisionado", "Certificado Profissional", "Material Anat├┤mico"], certification: "Certificado com Validade Nacional", display_order: 5, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function fetchCourses(areaId?: string): Promise<Course[]> {
  try {
    let query = supabase
      .from("courses")
      .select("*")
      .in("status", ["active"])
      .order("display_order");
    if (areaId) query = query.eq("area_id", areaId);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return areaId ? DEMO_COURSES.filter(c => c.area_id === areaId) : DEMO_COURSES;
    }
    return data as unknown as Course[];
  } catch {
    return areaId ? DEMO_COURSES.filter(c => c.area_id === areaId) : DEMO_COURSES;
  }
}

// ============================================================
// DISCOUNT RULES
// ============================================================
export interface DiscountRule {
  id: string;
  name: string;
  code: string;
  type: "scholarship" | "matricula" | "promotional" | "campaign" | "bonus" | "fee_exemption";
  calc_type: "percentage" | "fixed";
  amount: number;
  min_value: number | null;
  max_value: number | null;
  apply_order: number;
  is_cumulative: boolean;
  allowed_courses: string[];
  allowed_areas: string[];
  allowed_payment_methods: string[];
  allowed_roles: string[];
  start_date: string | null;
  end_date: string | null;
  usage_limit: number | null;
  current_usages: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export const DEMO_DISCOUNT_RULES: DiscountRule[] = [
  { id: "77777777-7777-7777-7777-777777777771", name: "Bolsa de Estudo Incentivo Profissional", code: "BOLSA_INCENTIVO_350", type: "scholarship", calc_type: "fixed", amount: 350.00, min_value: null, max_value: null, apply_order: 1, is_cumulative: true, allowed_courses: [], allowed_areas: [], allowed_payment_methods: [], allowed_roles: ["admin", "manager", "seller"], start_date: null, end_date: null, usage_limit: null, current_usages: 0, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "77777777-7777-7777-7777-777777777772", name: "Desconto Especial de Matr├¡cula", code: "DESC_MATRICULA_200", type: "matricula", calc_type: "fixed", amount: 200.00, min_value: null, max_value: null, apply_order: 2, is_cumulative: true, allowed_courses: [], allowed_areas: [], allowed_payment_methods: [], allowed_roles: ["admin", "manager", "seller"], start_date: null, end_date: null, usage_limit: null, current_usages: 0, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "77777777-7777-7777-7777-777777777773", name: "Campanha da Unidade ÔÇö Vagas Limitadas", code: "CAMPANHA_UNIDADE_150", type: "campaign", calc_type: "fixed", amount: 150.00, min_value: null, max_value: null, apply_order: 3, is_cumulative: true, allowed_courses: [], allowed_areas: [], allowed_payment_methods: [], allowed_roles: ["admin", "manager", "seller"], start_date: null, end_date: null, usage_limit: null, current_usages: 0, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function fetchActiveDiscountRules(courseId?: string, areaId?: string): Promise<DiscountRule[]> {
  try {
    const { data, error } = await supabase
      .from("discount_rules")
      .select("*")
      .eq("status", "active")
      .order("apply_order");
    if (error || !data || data.length === 0) return DEMO_DISCOUNT_RULES;
    const rules = data as unknown as DiscountRule[];
    const now = new Date().toISOString();
    return rules.filter(r => {
      if (r.start_date && r.start_date > now) return false;
      if (r.end_date && r.end_date < now) return false;
      if (r.usage_limit !== null && r.current_usages >= r.usage_limit) return false;
      if (r.allowed_courses.length > 0 && courseId && !r.allowed_courses.includes(courseId)) return false;
      if (r.allowed_areas.length > 0 && areaId && !r.allowed_areas.includes(areaId)) return false;
      return true;
    });
  } catch {
    return DEMO_DISCOUNT_RULES;
  }
}

// ============================================================
// PAYMENT METHODS
// ============================================================
export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  description: string | null;
  active: boolean;
  display_order: number;
}

export interface InstallmentOption {
  id: string;
  payment_method_id: string | null;
  installments_count: number;
  interest_rate: number;
  discount_rate: number;
  label: string;
  active: boolean;
}

export const DEMO_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "55555555-5555-5555-5555-555555555551", name: "Cart├úo de Cr├®dito", code: "credit_card", description: "At├® 12x sem juros", active: true, display_order: 1 },
  { id: "55555555-5555-5555-5555-555555555552", name: "Carn├¬ Recorrente", code: "carne_parcelado", description: "Parcelamento direto com a unidade", active: true, display_order: 2 },
  { id: "55555555-5555-5555-5555-555555555553", name: "PIX ├á Vista", code: "pix", description: "Condi├º├úo ├á vista com desconto especial", active: true, display_order: 3 },
  { id: "55555555-5555-5555-5555-555555555554", name: "Boleto Banc├írio", code: "bank_slip", description: "Pagamento banc├írio tradicional", active: true, display_order: 4 },
];

export const DEMO_INSTALLMENT_OPTIONS: InstallmentOption[] = [
  { id: "66666666-6666-6666-6666-666666666661", payment_method_id: "55555555-5555-5555-5555-555555555551", installments_count: 1, interest_rate: 0, discount_rate: 5, label: "1x ├á vista no Cart├úo (5% desc)", active: true },
  { id: "66666666-6666-6666-6666-666666666662", payment_method_id: "55555555-5555-5555-5555-555555555551", installments_count: 6, interest_rate: 0, discount_rate: 0, label: "6x sem juros no Cart├úo", active: true },
  { id: "66666666-6666-6666-6666-666666666663", payment_method_id: "55555555-5555-5555-5555-555555555551", installments_count: 12, interest_rate: 0, discount_rate: 0, label: "12x sem juros no Cart├úo Ô£ª Recomendado", active: true },
  { id: "66666666-6666-6666-6666-666666666664", payment_method_id: "55555555-5555-5555-5555-555555555552", installments_count: 12, interest_rate: 0, discount_rate: 0, label: "12x no Carn├¬ Recorrente", active: true },
  { id: "66666666-6666-6666-6666-666666666665", payment_method_id: "55555555-5555-5555-5555-555555555553", installments_count: 1, interest_rate: 0, discount_rate: 10, label: "1x no PIX com 10% de B├┤nus Especial", active: true },
];

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("active", true)
      .order("display_order");
    if (error || !data || data.length === 0) return DEMO_PAYMENT_METHODS;
    return data as unknown as PaymentMethod[];
  } catch {
    return DEMO_PAYMENT_METHODS;
  }
}

export async function fetchInstallmentOptions(paymentMethodId: string): Promise<InstallmentOption[]> {
  try {
    const { data, error } = await supabase
      .from("installment_options")
      .select("*")
      .eq("payment_method_id", paymentMethodId)
      .eq("active", true)
      .order("installments_count");
    if (error || !data || data.length === 0) {
      return DEMO_INSTALLMENT_OPTIONS.filter(o => o.payment_method_id === paymentMethodId);
    }
    return data as unknown as InstallmentOption[];
  } catch {
    return DEMO_INSTALLMENT_OPTIONS.filter(o => o.payment_method_id === paymentMethodId);
  }
}

// ============================================================
// OFFER CALCULATION ENGINE (Frontend-side reactive)
// ============================================================
export interface AppliedBenefit {
  id: string;
  name: string;
  type: string;
  calc_type: "percentage" | "fixed";
  amount_deducted: number;
  emoji: string;
}

export interface OfferCalculation {
  table_price: number;
  applied_benefits: AppliedBenefit[];
  total_discount: number;
  total_savings: number;
  final_price: number;
  installment_discount: number;
  installments_count: number;
  installment_value: number;
}

const BENEFIT_EMOJIS: Record<string, string> = {
  scholarship: "ƒÄô",
  matricula: "ƒÅÀ´©Å",
  campaign: "ƒöÑ",
  bonus: "Ô¡É",
  promotional: "ƒÄü",
  fee_exemption: "Ô£à",
};

export function calculateOffer(
  course: Course,
  discountRules: DiscountRule[],
  selectedInstallment: InstallmentOption | null
): OfferCalculation {
  const tablePrice = course.table_price;
  let runningPrice = tablePrice;
  const appliedBenefits: AppliedBenefit[] = [];

  // Sort by apply_order
  const sorted = [...discountRules].sort((a, b) => a.apply_order - b.apply_order);

  for (const rule of sorted) {
    if (rule.status !== "active") continue;
    let deduction = 0;
    if (rule.calc_type === "fixed") {
      deduction = rule.amount;
    } else {
      deduction = (runningPrice * rule.amount) / 100;
    }
    if (rule.max_value !== null) deduction = Math.min(deduction, rule.max_value);
    if (rule.min_value !== null) deduction = Math.max(deduction, rule.min_value);
    deduction = Math.min(deduction, runningPrice); // can't discount more than price

    appliedBenefits.push({
      id: rule.id,
      name: rule.name,
      type: rule.type,
      calc_type: rule.calc_type,
      amount_deducted: deduction,
      emoji: BENEFIT_EMOJIS[rule.type] ?? "ƒÆ░",
    });

    if (rule.is_cumulative) runningPrice -= deduction;
  }

  const totalDiscount = appliedBenefits.reduce((s, b) => s + b.amount_deducted, 0);
  let finalPrice = tablePrice - totalDiscount;

  // Apply installment discount/interest
  let installmentDiscount = 0;
  const installmentsCount = selectedInstallment?.installments_count ?? 1;
  if (selectedInstallment) {
    if (selectedInstallment.discount_rate > 0) {
      installmentDiscount = (finalPrice * selectedInstallment.discount_rate) / 100;
      finalPrice -= installmentDiscount;
    } else if (selectedInstallment.interest_rate > 0) {
      finalPrice *= 1 + selectedInstallment.interest_rate / 100;
    }
  }

  finalPrice = Math.max(finalPrice, 0);
  const installmentValue = installmentsCount > 0 ? finalPrice / installmentsCount : finalPrice;

  return {
    table_price: tablePrice,
    applied_benefits: appliedBenefits,
    total_discount: totalDiscount,
    total_savings: totalDiscount + installmentDiscount,
    final_price: finalPrice,
    installment_discount: installmentDiscount,
    installments_count: installmentsCount,
    installment_value: installmentValue,
  };
}

// ============================================================
// STUDENTS
// ============================================================
export interface Student {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  origin: string;
  assigned_to: string | null;
  status: "active" | "enrolled" | "inactive" | "lost";
  notes: string | null;
  interests: string[];
  created_at: string;
  updated_at: string;
}

export const DEMO_STUDENTS: Student[] = [
  { id: "99999999-9999-9999-9999-999999999991", name: "Lucas Gabriel Martins", whatsapp: "(11) 97123-4567", email: "lucas.gabriel@email.com", origin: "Instagram Ads", assigned_to: "22222222-2222-2222-2222-222222222223", status: "active", notes: "Muito interessado em abrir barbearia pr├│pria. Pediu para parcelar em 12x.", interests: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "99999999-9999-9999-9999-999999999992", name: "Beatriz Mendon├ºa Ramos", whatsapp: "(11) 98234-5678", email: "beatriz.ramos@email.com", origin: "Indica├º├úo de Amigo", assigned_to: "22222222-2222-2222-2222-222222222223", status: "active", notes: "Quer o curso de Cabeleireiro Profissional. Precisa conversar com a m├úe sobre o hor├írio do s├íbado.", interests: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "99999999-9999-9999-9999-999999999993", name: "Rodrigo Santos Oliveira", whatsapp: "(11) 99345-6789", email: "rodrigo.santos@email.com", origin: "Google Search", assigned_to: "22222222-2222-2222-2222-222222222224", status: "active", notes: "Busca Manuten├º├úo de Celulares. Trabalha como motoboy durante o dia e quer mudar de ├írea.", interests: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "99999999-9999-9999-9999-999999999994", name: "Camila Toledo Pires", whatsapp: "(11) 98456-7890", email: "camila.toledo@email.com", origin: "Balc├úo Unidade", assigned_to: "22222222-2222-2222-2222-222222222224", status: "active", notes: "Interessada em Confeitaria Profissional. Quer come├ºar no pr├│ximo m├¬s.", interests: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function fetchStudents(assignedTo?: string): Promise<Student[]> {
  try {
    let query = supabase.from("students").select("*").order("created_at", { ascending: false });
    if (assignedTo) query = query.eq("assigned_to", assignedTo);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return assignedTo ? DEMO_STUDENTS.filter(s => s.assigned_to === assignedTo) : DEMO_STUDENTS;
    }
    return data as unknown as Student[];
  } catch {
    return assignedTo ? DEMO_STUDENTS.filter(s => s.assigned_to === assignedTo) : DEMO_STUDENTS;
  }
}

export async function searchStudents(q: string, assignedTo?: string): Promise<Student[]> {
  try {
    let query = supabase.from("students").select("*").order("name");
    if (assignedTo) query = query.eq("assigned_to", assignedTo);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      const all = assignedTo ? DEMO_STUDENTS.filter(s => s.assigned_to === assignedTo) : DEMO_STUDENTS;
      return all.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.whatsapp.includes(q));
    }
    const lower = q.toLowerCase();
    return (data as unknown as Student[]).filter(
      s => s.name.toLowerCase().includes(lower) || s.whatsapp.includes(q)
    );
  } catch {
    return [];
  }
}

export async function createStudent(student: Omit<Student, "id" | "created_at" | "updated_at">): Promise<Student> {
  const { data, error } = await supabase.from("students").insert(student).select().single();
  if (error) throw error;
  return data as unknown as Student;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
  const { data, error } = await supabase.from("students").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as unknown as Student;
}

// ============================================================
// CRM STAGES
// ============================================================
export interface CrmStage {
  id: string;
  name: string;
  code: string;
  color: string;
  display_order: number;
  is_final: boolean;
  is_won: boolean;
  status: "active" | "inactive";
  created_at: string;
}

export const DEMO_CRM_STAGES: CrmStage[] = [
  { id: "88888888-8888-8888-8888-888888888881", name: "Novo Lead", code: "new_lead", color: "#64748b", display_order: 1, is_final: false, is_won: false, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888882", name: "Contato Realizado", code: "contacted", color: "#0284c7", display_order: 2, is_final: false, is_won: false, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888883", name: "Interesse Demonstrado", code: "interested", color: "#8b5cf6", display_order: 3, is_final: false, is_won: false, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888884", name: "Proposta Enviada", code: "proposal_sent", color: "#c62828", display_order: 4, is_final: false, is_won: false, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888885", name: "Aguardando Resposta", code: "waiting_response", color: "#d97706", display_order: 5, is_final: false, is_won: false, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888886", name: "Em Negocia├º├úo", code: "negotiating", color: "#ea580c", display_order: 6, is_final: false, is_won: false, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888887", name: "Retorno Agendado", code: "scheduled_return", color: "#e11d48", display_order: 7, is_final: false, is_won: false, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888888", name: "Matriculado", code: "won", color: "#16a34a", display_order: 8, is_final: true, is_won: true, status: "active", created_at: new Date().toISOString() },
  { id: "88888888-8888-8888-8888-888888888889", name: "Perdido", code: "lost", color: "#94a3b8", display_order: 9, is_final: true, is_won: false, status: "active", created_at: new Date().toISOString() },
];

export async function fetchCrmStages(): Promise<CrmStage[]> {
  try {
    const { data, error } = await supabase
      .from("crm_stages")
      .select("*")
      .eq("status", "active")
      .order("display_order");
    if (error || !data || data.length === 0) return DEMO_CRM_STAGES;
    return data as unknown as CrmStage[];
  } catch {
    return DEMO_CRM_STAGES;
  }
}

// ============================================================
// PROPOSALS
// ============================================================
export interface Proposal {
  id: string;
  student_id: string;
  seller_id: string;
  course_id: string;
  crm_stage_id: string | null;
  table_price: number;
  total_discount: number;
  total_savings: number;
  final_price: number;
  payment_method: string;
  installments_count: number;
  installment_value: number;
  snapshot_data: Record<string, unknown>;
  status: string;
  notes: string | null;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export const DEMO_PROPOSALS: Proposal[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    student_id: "99999999-9999-9999-9999-999999999991",
    seller_id: "22222222-2222-2222-2222-222222222223",
    course_id: "44444444-4444-4444-4444-444444444442",
    crm_stage_id: "88888888-8888-8888-8888-888888888884",
    table_price: 1680.00,
    total_discount: 700.00,
    total_savings: 700.00,
    final_price: 980.00,
    payment_method: "Cart├úo de Cr├®dito",
    installments_count: 12,
    installment_value: 81.67,
    snapshot_data: { course_name: "Barbeiro Profissional & Visagismo", benefits: [{ name: "Bolsa de Estudo Incentivo", amount: 350 }, { name: "Desconto de Matr├¡cula", amount: 200 }, { name: "Campanha da Unidade", amount: 150 }] },
    status: "sent",
    notes: "Condi├º├úo especial com bolsa incentivo e taxa de matr├¡cula isenta",
    valid_until: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    student_id: "99999999-9999-9999-9999-999999999992",
    seller_id: "22222222-2222-2222-2222-222222222223",
    course_id: "44444444-4444-4444-4444-444444444441",
    crm_stage_id: "88888888-8888-8888-8888-888888888887",
    table_price: 1850.00,
    total_discount: 700.00,
    total_savings: 700.00,
    final_price: 1150.00,
    payment_method: "Cart├úo de Cr├®dito",
    installments_count: 12,
    installment_value: 95.83,
    snapshot_data: { course_name: "Cabeleireiro Profissional Completo", benefits: [{ name: "Bolsa de Estudo Incentivo", amount: 350 }, { name: "Desconto de Matr├¡cula", amount: 200 }, { name: "Campanha da Unidade", amount: 150 }] },
    status: "waiting_response",
    notes: "Oferta apresentada. Aluna pediu retorno no dia seguinte ├ás 14h.",
    valid_until: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function fetchProposals(sellerId?: string): Promise<Proposal[]> {
  try {
    let query = supabase.from("proposals").select("*").order("created_at", { ascending: false });
    if (sellerId) query = query.eq("seller_id", sellerId);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return sellerId ? DEMO_PROPOSALS.filter(p => p.seller_id === sellerId) : DEMO_PROPOSALS;
    }
    return data as unknown as Proposal[];
  } catch {
    return sellerId ? DEMO_PROPOSALS.filter(p => p.seller_id === sellerId) : DEMO_PROPOSALS;
  }
}

export async function createProposal(proposal: Omit<Proposal, "id" | "created_at" | "updated_at">): Promise<Proposal> {
  const { data, error } = await supabase.from("proposals").insert(proposal).select().single();
  if (error) throw error;
  return data as unknown as Proposal;
}

export async function updateProposalStatus(id: string, status: string, sellerId: string): Promise<void> {
  const { error } = await supabase.from("proposals").update({ status }).eq("id", id);
  if (error) throw error;
  await supabase.from("proposal_events").insert({ proposal_id: id, user_id: sellerId, to_status: status });
}

// ============================================================
// FOLLOW-UPS
// ============================================================
export interface Followup {
  id: string;
  student_id: string;
  seller_id: string;
  proposal_id: string | null;
  scheduled_date: string;
  scheduled_time: string;
  observation: string;
  status: "pending" | "completed" | "overdue" | "cancelled";
  completion_notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const DEMO_FOLLOWUPS: Followup[] = [
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    student_id: "99999999-9999-9999-9999-999999999992",
    seller_id: "22222222-2222-2222-2222-222222222223",
    proposal_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    scheduled_date: new Date().toISOString().split("T")[0],
    scheduled_time: "14:00:00",
    observation: "Aluno deseja conversar com a m├úe e responder hoje ├ás 14h. Ligar para fechar a matr├¡cula com as condi├º├Áes da bolsa.",
    status: "pending",
    completion_notes: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    student_id: "99999999-9999-9999-9999-999999999991",
    seller_id: "22222222-2222-2222-2222-222222222223",
    proposal_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    scheduled_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    scheduled_time: "10:30:00",
    observation: "Verificar se Lucas conseguiu o limite no cart├úo para parcelar o curso de Barbeiro.",
    status: "overdue",
    completion_notes: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function fetchFollowups(sellerId: string, dateFilter?: "today" | "overdue" | "upcoming"): Promise<Followup[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    let query = supabase.from("followups").select("*").eq("seller_id", sellerId).order("scheduled_date").order("scheduled_time");
    if (dateFilter === "today") query = query.eq("scheduled_date", today).neq("status", "completed").neq("status", "cancelled");
    else if (dateFilter === "overdue") query = query.lt("scheduled_date", today).eq("status", "overdue");
    else if (dateFilter === "upcoming") query = query.gt("scheduled_date", today).eq("status", "pending");
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let demo = DEMO_FOLLOWUPS.filter(f => f.seller_id === sellerId);
      if (dateFilter === "today") demo = demo.filter(f => f.scheduled_date === today);
      else if (dateFilter === "overdue") demo = demo.filter(f => f.status === "overdue");
      return demo;
    }
    return data as unknown as Followup[];
  } catch {
    return DEMO_FOLLOWUPS.filter(f => f.seller_id === sellerId);
  }
}

export async function createFollowup(followup: Omit<Followup, "id" | "created_at" | "updated_at">): Promise<Followup> {
  const { data, error } = await supabase.from("followups").insert(followup).select().single();
  if (error) throw error;
  return data as unknown as Followup;
}

export async function completeFollowup(id: string, notes?: string): Promise<void> {
  const { error } = await supabase.from("followups").update({
    status: "completed",
    completion_notes: notes,
    completed_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) throw error;
}

// ============================================================
// AUDIT LOGS
// ============================================================
export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  observation: string | null;
  created_at: string;
}

export async function createAuditLog(log: Omit<AuditLog, "id" | "created_at">): Promise<void> {
  try {
    await supabase.from("audit_logs").insert(log);
  } catch {
    // Silent fail for audit - don't block UI
    console.warn("Audit log failed silently:", log.action);
  }
}

export async function fetchAuditLogs(filters?: { entity?: string; userId?: string }): Promise<AuditLog[]> {
  try {
    let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
    if (filters?.entity) query = query.eq("entity", filters.entity);
    if (filters?.userId) query = query.eq("user_id", filters.userId);
    const { data, error } = await query;
    if (error || !data) return [];
    return data as unknown as AuditLog[];
  } catch {
    return [];
  }
}

// ============================================================
// FORMATTERS
// ============================================================
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export function timerCountdown(expiresAt: string): { hours: number; minutes: number; seconds: number; expired: boolean; total_seconds: number } {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true, total_seconds: 0 };
  const total_seconds = Math.floor(diff / 1000);
  const hours = Math.floor(total_seconds / 3600);
  const minutes = Math.floor((total_seconds % 3600) / 60);
  const seconds = total_seconds % 60;
  return { hours, minutes, seconds, expired: false, total_seconds };
}
