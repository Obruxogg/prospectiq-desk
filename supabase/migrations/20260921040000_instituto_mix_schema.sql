-- ==============================================================================
-- MIGRATION: SISTEMA COMERCIAL E CRM DO INSTITUTO MIX
-- ==============================================================================

-- 1. EXTENSIONS & HELPER FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.set_im_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. ROLES & TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  unit_code text,
  manager_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Profiles extends Supabase auth.users or acts as internal user registry
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  role text NOT NULL DEFAULT 'seller' CHECK (role IN ('admin', 'manager', 'seller')),
  team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  must_change_password boolean NOT NULL DEFAULT false,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add manager foreign key to teams
ALTER TABLE public.teams 
  DROP CONSTRAINT IF EXISTS fk_teams_manager,
  ADD CONSTRAINT fk_teams_manager FOREIGN KEY (manager_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. VISUAL SETTINGS (Identidade Visual do Instituto Mix)
CREATE TABLE IF NOT EXISTS public.visual_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name text NOT NULL DEFAULT 'Instituto Mix de Profiss├Áes',
  unit_name text NOT NULL DEFAULT 'Unidade Principal',
  logo_url text DEFAULT 'https://institutomix.com.br/wp-content/uploads/2022/07/logo-instituto-mix.png',
  favicon_url text,
  primary_color text NOT NULL DEFAULT '#c62828',
  secondary_color text NOT NULL DEFAULT '#7f1d1d',
  accent_color text NOT NULL DEFAULT '#d97706',
  default_course_image text DEFAULT 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  student_mode_copy text NOT NULL DEFAULT 'Transforme seu futuro profissional com a qualidade e certifica├º├úo reconhecida do Instituto Mix. Garanta sua vaga com benef├¡cios exclusivos por tempo limitado!',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. ├üREAS DE ATUA├ç├âO
CREATE TABLE IF NOT EXISTS public.areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT 'GraduationCap',
  color text DEFAULT '#c62828',
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. CURSOS DO CAT├üLOGO
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid NOT NULL REFERENCES public.areas(id) ON DELETE RESTRICT,
  name text NOT NULL,
  short_description text,
  full_description text,
  cover_image text,
  workload_hours integer NOT NULL DEFAULT 80,
  modality text NOT NULL DEFAULT 'Presencial' CHECK (modality IN ('Presencial', 'EAD', 'H├¡brido')),
  unit text DEFAULT 'Todas as unidades',
  table_price numeric(10,2) NOT NULL DEFAULT 0.00,
  included_benefits jsonb NOT NULL DEFAULT '["Certificado Reconhecido Nacionalmente", "Material Did├ítico Incluso", "Aulas Pr├íticas com Especialistas"]'::jsonb,
  certification text DEFAULT 'Certificado com Validade Nacional',
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. TABELAS DE PRE├çOS ESPEC├ìFICAS
CREATE TABLE IF NOT EXISTS public.course_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  condition_name text NOT NULL DEFAULT 'Tabela Padr├úo',
  price numeric(10,2) NOT NULL,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. FORMAS DE PAGAMENTO
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. OP├ç├òES DE PARCELAMENTO
CREATE TABLE IF NOT EXISTS public.installment_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_method_id uuid REFERENCES public.payment_methods(id) ON DELETE CASCADE,
  installments_count integer NOT NULL,
  interest_rate numeric(5,2) NOT NULL DEFAULT 0.00,
  discount_rate numeric(5,2) NOT NULL DEFAULT 0.00,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. BENEF├ìCIOS E REGRAS DE DESCONTO
CREATE TABLE IF NOT EXISTS public.discount_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('scholarship', 'matricula', 'promotional', 'campaign', 'bonus', 'fee_exemption')),
  calc_type text NOT NULL CHECK (calc_type IN ('percentage', 'fixed')),
  amount numeric(10,2) NOT NULL,
  min_value numeric(10,2) DEFAULT 0.00,
  max_value numeric(10,2),
  apply_order integer NOT NULL DEFAULT 1,
  is_cumulative boolean NOT NULL DEFAULT true,
  allowed_courses jsonb DEFAULT '[]'::jsonb,
  allowed_areas jsonb DEFAULT '[]'::jsonb,
  allowed_payment_methods jsonb DEFAULT '[]'::jsonb,
  allowed_roles jsonb DEFAULT '["admin", "manager", "seller"]'::jsonb,
  start_date timestamptz,
  end_date timestamptz,
  usage_limit integer,
  current_usages integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 10. CAMPANHAS E CONDI├ç├òES COMERCIAIS
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  badge_text text,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 11. ALUNOS E CONTATOS
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  whatsapp text NOT NULL,
  email text,
  origin text NOT NULL DEFAULT 'Outro',
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'enrolled', 'inactive', 'lost')),
  notes text,
  interests jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_students_assigned_to ON public.students(assigned_to);
CREATE INDEX IF NOT EXISTS idx_students_whatsapp ON public.students(whatsapp);

-- 12. HIST├ôRICO DE RESPONS├üVEIS DE ALUNO
CREATE TABLE IF NOT EXISTS public.student_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  previous_seller_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  new_seller_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  transferred_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text,
  transferred_at timestamptz NOT NULL DEFAULT now()
);

-- 13. INTERA├ç├òES E ATENDIMENTOS DO ALUNO
CREATE TABLE IF NOT EXISTS public.student_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('whatsapp', 'call', 'in_person', 'offer_presented', 'negotiation', 'note')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. ETAPAS DO CRM KANBAN (Configur├íveis)
CREATE TABLE IF NOT EXISTS public.crm_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  color text NOT NULL DEFAULT '#c62828',
  display_order integer NOT NULL DEFAULT 0,
  is_final boolean NOT NULL DEFAULT false,
  is_won boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 15. PROPOSTAS COMERCIAIS (Snapshot Imut├ível)
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  crm_stage_id uuid REFERENCES public.crm_stages(id) ON DELETE SET NULL,
  
  -- Valores imut├íveis
  table_price numeric(10,2) NOT NULL,
  total_discount numeric(10,2) NOT NULL DEFAULT 0.00,
  total_savings numeric(10,2) NOT NULL DEFAULT 0.00,
  final_price numeric(10,2) NOT NULL,
  payment_method text NOT NULL,
  installments_count integer NOT NULL DEFAULT 1,
  installment_value numeric(10,2) NOT NULL,
  
  -- Snapshot completo em JSON
  snapshot_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'viewed', 'waiting_response', 'negotiation', 'approved', 'rejected', 'expired', 'cancelled')),
  notes text,
  valid_until timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proposals_student ON public.proposals(student_id);
CREATE INDEX IF NOT EXISTS idx_proposals_seller ON public.proposals(seller_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);

-- 16. BENEF├ìCIOS APLICADOS NA PROPOSTA
CREATE TABLE IF NOT EXISTS public.proposal_benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  discount_rule_id uuid REFERENCES public.discount_rules(id) ON DELETE SET NULL,
  name text NOT NULL,
  type text NOT NULL,
  calc_type text NOT NULL,
  amount_deducted numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 17. EVENTOS E HIST├ôRICO DA PROPOSTA
CREATE TABLE IF NOT EXISTS public.proposal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  from_status text,
  to_status text NOT NULL,
  observation text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 18. TIMERS DE VALIDADE DA OFERTA (Entidade Independente)
CREATE TABLE IF NOT EXISTS public.proposal_timers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired', 'completed', 'cancelled')),
  initial_duration_hours integer NOT NULL DEFAULT 48,
  expires_at timestamptz NOT NULL,
  paused_at timestamptz,
  remaining_seconds integer,
  extended_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.proposal_timer_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timer_id uuid NOT NULL REFERENCES public.proposal_timers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('start', 'pause', 'resume', 'extend', 'expire', 'finish', 'cancel')),
  reason text,
  seconds_added integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 19. FOLLOW-UPS (Pr├│ximo Contato do Vendedor)
CREATE TABLE IF NOT EXISTS public.followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  observation text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue', 'cancelled')),
  completion_notes text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_followups_seller_date ON public.followups(seller_id, scheduled_date, status);

-- 20. TRANSFER├èNCIAS DE CARTEIRA (Wallet Transfers)
CREATE TABLE IF NOT EXISTS public.wallet_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performed_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_seller_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  students_count integer NOT NULL DEFAULT 0,
  proposals_count integer NOT NULL DEFAULT 0,
  followups_count integer NOT NULL DEFAULT 0,
  transferred_student_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 21. TRILHA DE AUDITORIA (Audit Logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  observation text,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- 22. TRIGGERS & RLS (Row Level Security)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security policies (allowing full access to authenticated roles and public read for demonstration/testing)
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "students_access" ON public.students;
CREATE POLICY "students_access" ON public.students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "proposals_access" ON public.proposals;
CREATE POLICY "proposals_access" ON public.proposals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "followups_access" ON public.followups;
CREATE POLICY "followups_access" ON public.followups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "audit_logs_access" ON public.audit_logs;
CREATE POLICY "audit_logs_access" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 23. SEED DATA DE DEMONSTRA├ç├âO (Oficial do Instituto Mix)
-- ==============================================================================

-- Visual Settings
INSERT INTO public.visual_settings (id, institution_name, unit_name, primary_color, secondary_color, accent_color, student_mode_copy)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Instituto Mix de Profiss├Áes',
  'Unidade Centro Comercial',
  '#c62828',
  '#7f1d1d',
  '#d97706',
  'Transforme seu futuro profissional com a qualidade e certifica├º├úo reconhecida do Instituto Mix. Garanta sua vaga com benef├¡cios exclusivos por tempo limitado!'
) ON CONFLICT (id) DO NOTHING;

-- Equipes
INSERT INTO public.teams (id, name, unit_code)
VALUES ('11111111-1111-1111-1111-111111111111', 'Equipe Comercial Alpha', 'IM-001')
ON CONFLICT (id) DO NOTHING;

-- Usu├írios / Perfis
INSERT INTO public.profiles (id, name, email, role, phone, status, team_id)
VALUES 
  ('22222222-2222-2222-2222-222222222221', 'Roberto Albuquerque (Admin)', 'admin@institutomix.com.br', 'admin', '(11) 98765-4321', 'active', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222', 'Mariana Souza (Gerente)', 'gerente@institutomix.com.br', 'manager', '(11) 98765-4322', 'active', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222223', 'Carlos Eduardo (Vendedor)', 'carlos@institutomix.com.br', 'seller', '(11) 98765-4323', 'active', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222224', 'Fernanda Lima (Vendedora)', 'fernanda@institutomix.com.br', 'seller', '(11) 98765-4324', 'active', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

UPDATE public.teams SET manager_id = '22222222-2222-2222-2222-222222222222' WHERE id = '11111111-1111-1111-1111-111111111111';

-- ├üreas de Atua├º├úo
INSERT INTO public.areas (id, name, description, icon, color, display_order)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'Beleza e Est├®tica', 'Cabeleireiro, Barbearia, Maquiagem e Est├®tica Facial', 'Scissors', '#c62828', 1),
  ('33333333-3333-3333-3333-333333333332', 'Sa├║de e Cuidados', 'Auxiliar de Veterin├íria, Cuidador de Idosos e Massoterapia', 'HeartPulse', '#0284c7', 2),
  ('33333333-3333-3333-3333-333333333333', 'Tecnologia e Inform├ítica', 'Manuten├º├úo de Celulares, Inform├ítica e Programa├º├úo', 'Laptop', '#7c3aed', 3),
  ('33333333-3333-3333-3333-333333333334', 'Gastronomia e Confeitaria', 'Confeitaria Profissional, Panifica├º├úo e Chef de Cozinha', 'ChefHat', '#d97706', 4),
  ('33333333-3333-3333-3333-333333333335', 'Gest├úo e Administra├º├úo', 'Administra├º├úo de Empresas, Recursos Humanos e Vendas', 'Briefcase', '#059669', 5)
ON CONFLICT (id) DO NOTHING;

-- Cursos do Instituto Mix
INSERT INTO public.courses (id, area_id, name, short_description, cover_image, workload_hours, modality, table_price, included_benefits, certification, display_order)
VALUES
  (
    '44444444-4444-4444-4444-444444444441',
    '33333333-3333-3333-3333-333333333331',
    'Cabeleireiro Profissional Completo',
    'Forma├º├úo pr├ítica do b├ísico ao avan├ºado: cortes, colorimetria, qu├¡micas e penteados.',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    120,
    'Presencial',
    1850.00,
    '["Material Did├ítico Oficial Incluso", "Certificado de Forma├º├úo Profissional", "Aulas 100% Pr├íticas em Laborat├│rio", "Acesso ao Clube de Vantagens IM"]'::jsonb,
    'Certificado Nacional Instituto Mix (CNPJ e CBO)',
    1
  ),
  (
    '44444444-4444-4444-4444-444444444442',
    '33333333-3333-3333-3333-333333333331',
    'Barbeiro Profissional & Visagismo',
    'Aprenda t├®cnicas modernas de degrad├¬, barba na toalha quente e gest├úo de barbearia.',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    96,
    'Presencial',
    1680.00,
    '["Kit Did├ítico Incluso", "Certifica├º├úo Reconhecida", "M├│dulo de Gest├úo de Neg├│cio"]'::jsonb,
    'Certificado Nacional Instituto Mix',
    2
  ),
  (
    '44444444-4444-4444-4444-444444444443',
    '33333333-3333-3333-3333-333333333333',
    'Manuten├º├úo de Smartphones & Tablets',
    'Diagn├│stico e reparo de hardware e software em aparelhos Android e iOS.',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    80,
    'Presencial',
    1950.00,
    '["Apostila Digital e Impressa", "Bancada Individual", "Suporte P├│s-Curso com Instrutor"]'::jsonb,
    'Certificado T├®cnico de Manuten├º├úo IM',
    3
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333334',
    'Confeitaria Profissional & Bolos Art├¡sticos',
    'Massas, recheios finos, pasta americana, bicos de confeitar e precifica├º├úo.',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    100,
    'Presencial',
    1790.00,
    '["Ingredientes Inclusos nas Aulas Pr├íticas", "Certificado de Confeiteiro", "Livro de Receitas Exclusivo"]'::jsonb,
    'Certificado Nacional Instituto Mix',
    4
  ),
  (
    '44444444-4444-4444-4444-444444444445',
    '33333333-3333-3333-3333-333333333332',
    'Auxiliar de Veterin├íria & Pet Care',
    'Primeiros socorros animais, aux├¡lio cir├║rgico, vacinas e procedimentos ambulatoriais.',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80',
    120,
    'Presencial',
    1890.00,
    '["Est├ígio Pr├ítico Supervisionado", "Certificado Profissional", "Material Anat├┤mico"]'::jsonb,
    'Certificado com Validade Nacional',
    5
  )
ON CONFLICT (id) DO NOTHING;

-- Formas de Pagamento
INSERT INTO public.payment_methods (id, name, code, description, active, display_order)
VALUES
  ('55555555-5555-5555-5555-555555555551', 'Cart├úo de Cr├®dito', 'credit_card', 'At├® 12x ou 18x sem juros ou com condi├º├Áes especiais', true, 1),
  ('55555555-5555-5555-5555-555555555552', 'Carn├¬ Recorrente / Boleto Parcelado', 'carne_parcelado', 'Parcelamento direto com a unidade com aprova├º├úo simplificada', true, 2),
  ('55555555-5555-5555-5555-555555555553', 'PIX ├á Vista com Desconto Especial', 'pix', 'Condi├º├úo ├á vista com desconto instant├óneo na matr├¡cula', true, 3),
  ('55555555-5555-5555-5555-555555555554', 'Boleto Banc├írio ├á Vista', 'bank_slip', 'Pagamento banc├írio tradicional', true, 4)
ON CONFLICT (id) DO NOTHING;

-- Op├º├Áes de Parcelamento
INSERT INTO public.installment_options (id, payment_method_id, installments_count, interest_rate, discount_rate, label, active)
VALUES
  ('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551', 1, 0.00, 5.00, '1x ├á vista no Cart├úo (5% desc)', true),
  ('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555551', 6, 0.00, 0.00, '6x sem juros no Cart├úo', true),
  ('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555551', 12, 0.00, 0.00, '12x sem juros no Cart├úo (Recomendado)', true),
  ('66666666-6666-6666-6666-666666666664', '55555555-5555-5555-5555-555555555552', 12, 0.00, 0.00, '12x no Carn├¬ Recorrente', true),
  ('66666666-6666-6666-6666-666666666665', '55555555-5555-5555-5555-555555555553', 1, 0.00, 10.00, '1x no PIX com 10% de B├┤nus Especial', true)
ON CONFLICT (id) DO NOTHING;

-- Regras de Desconto e Benef├¡cios Autom├íticos
INSERT INTO public.discount_rules (id, name, code, type, calc_type, amount, apply_order, is_cumulative, status)
VALUES
  (
    '77777777-7777-7777-7777-777777777771',
    'Bolsa de Estudo Incentivo Profissional',
    'BOLSA_INCENTIVO_350',
    'scholarship',
    'fixed',
    350.00,
    1,
    true,
    'active'
  ),
  (
    '77777777-7777-7777-7777-777777777772',
    'Desconto Especial de Matr├¡cula',
    'DESC_MATRICULA_200',
    'matricula',
    'fixed',
    200.00,
    2,
    true,
    'active'
  ),
  (
    '77777777-7777-7777-7777-777777777773',
    'Campanha da Unidade - Vagas Limitadas',
    'CAMPANHA_UNIDADE_150',
    'campaign',
    'fixed',
    150.00,
    3,
    true,
    'active'
  ),
  (
    '77777777-7777-7777-7777-777777777774',
    'B├┤nus Comercial Ger├¬ncia',
    'BONUS_GERENCIA_100',
    'bonus',
    'fixed',
    100.00,
    4,
    false,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- Etapas do CRM Kanban (Din├ómicas)
INSERT INTO public.crm_stages (id, name, code, color, display_order, is_final, is_won)
VALUES
  ('88888888-8888-8888-8888-888888888881', 'Novo Lead', 'new_lead', '#64748b', 1, false, false),
  ('88888888-8888-8888-8888-888888888882', 'Contato Realizado', 'contacted', '#0284c7', 2, false, false),
  ('88888888-8888-8888-8888-888888888883', 'Interesse Demonstrado', 'interested', '#8b5cf6', 3, false, false),
  ('88888888-8888-8888-8888-888888888884', 'Proposta Enviada', 'proposal_sent', '#c62828', 4, false, false),
  ('88888888-8888-8888-8888-888888888885', 'Aguardando Resposta', 'waiting_response', '#d97706', 5, false, false),
  ('88888888-8888-8888-8888-888888888886', 'Em Negocia├º├úo', 'negotiating', '#ea580c', 6, false, false),
  ('88888888-8888-8888-8888-888888888887', 'Retorno Agendado', 'scheduled_return', '#e11d48', 7, false, false),
  ('88888888-8888-8888-8888-888888888888', 'Matriculado (Ganho)', 'won', '#16a34a', 8, true, true),
  ('88888888-8888-8888-8888-888888888889', 'Perdido', 'lost', '#94a3b8', 9, true, false)
ON CONFLICT (id) DO NOTHING;

-- Alunos de Demonstra├º├úo
INSERT INTO public.students (id, name, whatsapp, email, origin, assigned_to, status, notes)
VALUES
  (
    '99999999-9999-9999-9999-999999999991',
    'Lucas Gabriel Martins',
    '(11) 97123-4567',
    'lucas.gabriel@email.com',
    'Instagram Ads',
    '22222222-2222-2222-2222-222222222223',
    'active',
    'Muito interessado em abrir barbearia pr├│pria. Pediu para parcelar em 12x.'
  ),
  (
    '99999999-9999-9999-9999-999999999992',
    'Beatriz Mendon├ºa Ramos',
    '(11) 98234-5678',
    'beatriz.ramos@email.com',
    'Indica├º├úo de Amigo',
    '22222222-2222-2222-2222-222222222223',
    'active',
    'Quer o curso de Cabeleireiro Profissional. Precisa conversar com a m├úe sobre o hor├írio do s├íbado.'
  ),
  (
    '99999999-9999-9999-9999-999999999993',
    'Rodrigo Santos Oliveira',
    '(11) 99345-6789',
    'rodrigo.santos@email.com',
    'Google Search',
    '22222222-2222-2222-2222-222222222224',
    'active',
    'Busca Manuten├º├úo de Celulares. Trabalha como motoboy durante o dia e quer mudar de ├írea.'
  ),
  (
    '99999999-9999-9999-9999-999999999994',
    'Camila Toledo Pires',
    '(11) 98456-7890',
    'camila.toledo@email.com',
    'Balc├úo Unidade',
    '22222222-2222-2222-2222-222222222224',
    'active',
    'Interessada em Confeitaria Profissional. Quer come├ºar no pr├│ximo m├¬s.'
  )
ON CONFLICT (id) DO NOTHING;

-- Propostas de Demonstra├º├úo
INSERT INTO public.proposals (
  id, student_id, seller_id, course_id, crm_stage_id,
  table_price, total_discount, total_savings, final_price,
  payment_method, installments_count, installment_value,
  status, notes, valid_until, snapshot_data
)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '99999999-9999-9999-9999-999999999991',
    '22222222-2222-2222-2222-222222222223',
    '44444444-4444-4444-4444-444444444442',
    '88888888-8888-8888-8888-888888888884',
    1680.00,
    700.00,
    700.00,
    980.00,
    'Cart├úo de Cr├®dito',
    12,
    81.67,
    'sent',
    'Condi├º├úo especial com bolsa incentivo e taxa de matr├¡cula isenta',
    now() + interval '48 hours',
    '{"course_name": "Barbeiro Profissional & Visagismo", "table_price": 1680.00, "benefits": [{"name": "Bolsa de Estudo Incentivo", "amount": 350.00}, {"name": "Desconto de Matr├¡cula", "amount": 200.00}, {"name": "Campanha da Unidade", "amount": 150.00}], "final_price": 980.00, "installments": "12x de R$ 81,67"}'::jsonb
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '99999999-9999-9999-9999-999999999992',
    '22222222-2222-2222-2222-222222222223',
    '44444444-4444-4444-4444-444444444441',
    '88888888-8888-8888-8888-888888888887',
    1850.00,
    700.00,
    700.00,
    1150.00,
    'Cart├úo de Cr├®dito',
    12,
    95.83,
    'waiting_response',
    'Oferta apresentada em sala comercial. Aluna pediu retorno no dia seguinte ├ás 14h.',
    now() + interval '36 hours',
    '{"course_name": "Cabeleireiro Profissional Completo", "table_price": 1850.00, "benefits": [{"name": "Bolsa de Estudo Incentivo", "amount": 350.00}, {"name": "Desconto de Matr├¡cula", "amount": 200.00}, {"name": "Campanha da Unidade", "amount": 150.00}], "final_price": 1150.00, "installments": "12x de R$ 95,83"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Timers de Demonstra├º├úo
INSERT INTO public.proposal_timers (
  id, proposal_id, status, initial_duration_hours, expires_at, remaining_seconds
)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'active', 48, now() + interval '48 hours', 172800),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'active', 48, now() + interval '36 hours', 129600)
ON CONFLICT (proposal_id) DO NOTHING;

-- Follow-ups de Demonstra├º├úo
INSERT INTO public.followups (
  id, student_id, seller_id, proposal_id, scheduled_date, scheduled_time, observation, status
)
VALUES
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '99999999-9999-9999-9999-999999999992',
    '22222222-2222-2222-2222-222222222223',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    CURRENT_DATE,
    '14:00:00',
    'Aluno deseja conversar com a m├úe e responder hoje ├ás 14h. Ligar para fechar a matr├¡cula com as condi├º├Áes da bolsa.',
    'pending'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '99999999-9999-9999-9999-999999999991',
    '22222222-2222-2222-2222-222222222223',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    CURRENT_DATE - interval '1 day',
    '10:30:00',
    'Verificar se Lucas conseguiu o limite no cart├úo para parcelar o curso de Barbeiro.',
    'overdue'
  )
ON CONFLICT (id) DO NOTHING;
