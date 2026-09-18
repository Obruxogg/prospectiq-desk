CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE public.app_role AS ENUM ('admin','manager','seller');
CREATE TYPE public.record_status AS ENUM ('active','inactive');
CREATE TYPE public.timer_status AS ENUM ('active','paused','expired','completed','cancelled');
CREATE TYPE public.followup_status AS ENUM ('pending','completed','cancelled');
CREATE TYPE public.proposal_status AS ENUM ('draft','sent','viewed','awaiting_response','negotiation','approved','refused','expired','cancelled');
CREATE TYPE public.discount_type AS ENUM ('percentage','fixed');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END; $$;

CREATE TABLE public.user_roles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, role public.app_role NOT NULL, active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,role)
);
GRANT SELECT ON public.user_roles TO authenticated; GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_roles_self_read ON public.user_roles FOR SELECT TO authenticated USING (user_id=auth.uid());
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid,_role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role AND active) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) TO authenticated;
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.has_role(auth.uid(),'admin') $$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
CREATE POLICY user_roles_admin_all ON public.user_roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE OR REPLACE FUNCTION public.claim_initial_admin() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF; IF EXISTS(SELECT 1 FROM public.user_roles) THEN RETURN false; END IF; INSERT INTO public.user_roles(user_id,role) VALUES(auth.uid(),'admin'); RETURN true; END; $$;
GRANT EXECUTE ON FUNCTION public.claim_initial_admin() TO authenticated;

CREATE TABLE public.teams (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text, manager_user_id uuid, status public.record_status NOT NULL DEFAULT 'active',
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.teams TO authenticated; GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY teams_admin_all ON public.teams FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY teams_manager_read ON public.teams FOR SELECT TO authenticated USING(manager_user_id=auth.uid());

CREATE TABLE public.team_members (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), team_id uuid NOT NULL REFERENCES public.teams(id), user_id uuid NOT NULL, active boolean NOT NULL DEFAULT true,
 joined_at date NOT NULL DEFAULT current_date, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(team_id,user_id)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.team_members TO authenticated; GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY team_members_self_read ON public.team_members FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY team_members_admin_all ON public.team_members FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY team_members_manager_all ON public.team_members FOR ALL TO authenticated USING(EXISTS(SELECT 1 FROM public.teams t WHERE t.id=team_id AND t.manager_user_id=auth.uid())) WITH CHECK(EXISTS(SELECT 1 FROM public.teams t WHERE t.id=team_id AND t.manager_user_id=auth.uid()));
CREATE OR REPLACE FUNCTION public.can_manage_user(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.is_admin() OR EXISTS(SELECT 1 FROM public.teams t JOIN public.team_members tm ON tm.team_id=t.id WHERE t.manager_user_id=auth.uid() AND tm.user_id=_user_id AND tm.active) $$;
GRANT EXECUTE ON FUNCTION public.can_manage_user(uuid) TO authenticated;

CREATE TABLE public.areas (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text, status public.record_status NOT NULL DEFAULT 'active', sort_order integer NOT NULL DEFAULT 0, is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.areas TO authenticated; GRANT ALL ON public.areas TO service_role;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY areas_read ON public.areas FOR SELECT TO authenticated USING(true);
CREATE POLICY areas_admin_write ON public.areas FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.courses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), area_id uuid NOT NULL REFERENCES public.areas(id), name text NOT NULL, description text, workload_hours integer NOT NULL CHECK(workload_hours>0), modality text NOT NULL, status public.record_status NOT NULL DEFAULT 'active', sort_order integer NOT NULL DEFAULT 0, is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.courses TO authenticated; GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY courses_read ON public.courses FOR SELECT TO authenticated USING(true);
CREATE POLICY courses_admin_write ON public.courses FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.course_prices (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), course_id uuid NOT NULL REFERENCES public.courses(id), name text NOT NULL, amount numeric(12,2) NOT NULL CHECK(amount>=0), starts_at timestamptz, ends_at timestamptz, status public.record_status NOT NULL DEFAULT 'active', is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.course_prices TO authenticated; GRANT ALL ON public.course_prices TO service_role;
ALTER TABLE public.course_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY course_prices_read ON public.course_prices FOR SELECT TO authenticated USING(true);
CREATE POLICY course_prices_admin_write ON public.course_prices FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.payment_methods (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, status public.record_status NOT NULL DEFAULT 'active', sort_order integer NOT NULL DEFAULT 0, is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.payment_methods TO authenticated; GRANT ALL ON public.payment_methods TO service_role;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY payment_methods_read ON public.payment_methods FOR SELECT TO authenticated USING(true);
CREATE POLICY payment_methods_admin_write ON public.payment_methods FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.installment_options (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), payment_method_id uuid NOT NULL REFERENCES public.payment_methods(id), installments integer NOT NULL CHECK(installments>0), interest_rate numeric(7,4) NOT NULL DEFAULT 0, minimum_amount numeric(12,2), status public.record_status NOT NULL DEFAULT 'active', sort_order integer NOT NULL DEFAULT 0, is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.installment_options TO authenticated; GRANT ALL ON public.installment_options TO service_role;
ALTER TABLE public.installment_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY installments_read ON public.installment_options FOR SELECT TO authenticated USING(true);
CREATE POLICY installments_admin_write ON public.installment_options FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.discount_rules (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, discount_type public.discount_type NOT NULL, value numeric(12,2) NOT NULL CHECK(value>=0), minimum_amount numeric(12,2), maximum_amount numeric(12,2), recommended boolean NOT NULL DEFAULT false, starts_at timestamptz, ends_at timestamptz, allowed_roles public.app_role[] NOT NULL DEFAULT '{}', requires_approval boolean NOT NULL DEFAULT false, status public.record_status NOT NULL DEFAULT 'active', is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.discount_rules TO authenticated; GRANT ALL ON public.discount_rules TO service_role;
ALTER TABLE public.discount_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY discounts_read ON public.discount_rules FOR SELECT TO authenticated USING(true);
CREATE POLICY discounts_admin_write ON public.discount_rules FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.discount_courses (
 discount_rule_id uuid NOT NULL REFERENCES public.discount_rules(id), course_id uuid NOT NULL REFERENCES public.courses(id), PRIMARY KEY(discount_rule_id,course_id)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.discount_courses TO authenticated; GRANT ALL ON public.discount_courses TO service_role;
ALTER TABLE public.discount_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY discount_courses_read ON public.discount_courses FOR SELECT TO authenticated USING(true);
CREATE POLICY discount_courses_admin_write ON public.discount_courses FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.discount_payment_methods (
 discount_rule_id uuid NOT NULL REFERENCES public.discount_rules(id), payment_method_id uuid NOT NULL REFERENCES public.payment_methods(id), PRIMARY KEY(discount_rule_id,payment_method_id)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.discount_payment_methods TO authenticated; GRANT ALL ON public.discount_payment_methods TO service_role;
ALTER TABLE public.discount_payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY discount_payment_read ON public.discount_payment_methods FOR SELECT TO authenticated USING(true);
CREATE POLICY discount_payment_admin_write ON public.discount_payment_methods FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.campaigns (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text, starts_at timestamptz, ends_at timestamptz, status public.record_status NOT NULL DEFAULT 'active', is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.campaigns TO authenticated; GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaigns_read ON public.campaigns FOR SELECT TO authenticated USING(true);
CREATE POLICY campaigns_admin_write ON public.campaigns FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.commercial_conditions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, course_id uuid REFERENCES public.courses(id), course_price_id uuid REFERENCES public.course_prices(id), payment_method_id uuid REFERENCES public.payment_methods(id), installment_option_id uuid REFERENCES public.installment_options(id), discount_rule_id uuid REFERENCES public.discount_rules(id), campaign_id uuid REFERENCES public.campaigns(id), validity_minutes integer NOT NULL DEFAULT 30 CHECK(validity_minutes>0), allowed_roles public.app_role[] NOT NULL DEFAULT '{}', status public.record_status NOT NULL DEFAULT 'active', is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.commercial_conditions TO authenticated; GRANT ALL ON public.commercial_conditions TO service_role;
ALTER TABLE public.commercial_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY conditions_read ON public.commercial_conditions FOR SELECT TO authenticated USING(true);
CREATE POLICY conditions_admin_write ON public.commercial_conditions FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.crm_stages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, color_key text NOT NULL DEFAULT 'neutral', sort_order integer NOT NULL DEFAULT 0, is_won boolean NOT NULL DEFAULT false, is_lost boolean NOT NULL DEFAULT false, status public.record_status NOT NULL DEFAULT 'active', is_demo boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.crm_stages TO authenticated; GRANT ALL ON public.crm_stages TO service_role;
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY crm_stages_read ON public.crm_stages FOR SELECT TO authenticated USING(true);
CREATE POLICY crm_stages_admin_write ON public.crm_stages FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

CREATE TABLE public.students (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, whatsapp text NOT NULL, email text, notes text, source text, current_owner_id uuid, crm_stage_id uuid REFERENCES public.crm_stages(id), status public.record_status NOT NULL DEFAULT 'active', is_demo boolean NOT NULL DEFAULT false,
 created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.students TO authenticated; GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY students_read ON public.students FOR SELECT TO authenticated USING(current_owner_id=auth.uid() OR created_by=auth.uid() OR public.can_manage_user(current_owner_id));
CREATE POLICY students_insert ON public.students FOR INSERT TO authenticated WITH CHECK(created_by=auth.uid() AND (current_owner_id=auth.uid() OR public.is_admin()));
CREATE POLICY students_update ON public.students FOR UPDATE TO authenticated USING(current_owner_id=auth.uid() OR public.can_manage_user(current_owner_id)) WITH CHECK(current_owner_id=auth.uid() OR public.can_manage_user(current_owner_id));

CREATE TABLE public.student_assignments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES public.students(id), owner_user_id uuid, assigned_by uuid NOT NULL, started_at timestamptz NOT NULL DEFAULT now(), ended_at timestamptz, reason text,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.student_assignments TO authenticated; GRANT ALL ON public.student_assignments TO service_role;
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY assignments_read ON public.student_assignments FOR SELECT TO authenticated USING(owner_user_id=auth.uid() OR public.can_manage_user(owner_user_id));
CREATE POLICY assignments_write ON public.student_assignments FOR ALL TO authenticated USING(public.can_manage_user(owner_user_id) OR public.is_admin()) WITH CHECK(public.can_manage_user(owner_user_id) OR public.is_admin());

CREATE TABLE public.student_interactions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES public.students(id), user_id uuid NOT NULL, kind text NOT NULL, notes text,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.student_interactions TO authenticated; GRANT ALL ON public.student_interactions TO service_role;
ALTER TABLE public.student_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY interactions_read ON public.student_interactions FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.students s WHERE s.id=student_id AND (s.current_owner_id=auth.uid() OR public.can_manage_user(s.current_owner_id))));
CREATE POLICY interactions_insert ON public.student_interactions FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.students s WHERE s.id=student_id AND (s.current_owner_id=auth.uid() OR public.can_manage_user(s.current_owner_id))));

CREATE TABLE public.proposals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES public.students(id), seller_user_id uuid NOT NULL, course_id uuid REFERENCES public.courses(id), area_id uuid REFERENCES public.areas(id), condition_id uuid REFERENCES public.commercial_conditions(id), course_name_snapshot text NOT NULL, area_name_snapshot text NOT NULL, workload_snapshot integer, modality_snapshot text, original_price numeric(12,2) NOT NULL, discount_name_snapshot text, discount_type_snapshot public.discount_type, discount_value_snapshot numeric(12,2) NOT NULL DEFAULT 0, discount_amount numeric(12,2) NOT NULL DEFAULT 0, final_price numeric(12,2) NOT NULL, payment_method_snapshot text NOT NULL, installments integer NOT NULL DEFAULT 1, installment_amount numeric(12,2) NOT NULL, valid_until timestamptz, timer_status public.timer_status NOT NULL DEFAULT 'active', status public.proposal_status NOT NULL DEFAULT 'draft', notes text,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.proposals TO authenticated; GRANT ALL ON public.proposals TO service_role;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY proposals_read ON public.proposals FOR SELECT TO authenticated USING(seller_user_id=auth.uid() OR public.can_manage_user(seller_user_id));
CREATE POLICY proposals_insert ON public.proposals FOR INSERT TO authenticated WITH CHECK(seller_user_id=auth.uid() OR public.can_manage_user(seller_user_id));
CREATE POLICY proposals_update ON public.proposals FOR UPDATE TO authenticated USING(seller_user_id=auth.uid() OR public.can_manage_user(seller_user_id)) WITH CHECK(seller_user_id=auth.uid() OR public.can_manage_user(seller_user_id));

CREATE TABLE public.proposal_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), proposal_id uuid NOT NULL REFERENCES public.proposals(id), user_id uuid NOT NULL, action text NOT NULL, previous_data jsonb, new_data jsonb, notes text, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT ON public.proposal_events TO authenticated; GRANT ALL ON public.proposal_events TO service_role;
ALTER TABLE public.proposal_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY proposal_events_read ON public.proposal_events FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR public.can_manage_user(p.seller_user_id))));
CREATE POLICY proposal_events_insert ON public.proposal_events FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR public.can_manage_user(p.seller_user_id))));

CREATE TABLE public.proposal_timer_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), proposal_id uuid NOT NULL REFERENCES public.proposals(id), user_id uuid NOT NULL, event_type text NOT NULL, previous_valid_until timestamptz, new_valid_until timestamptz, notes text, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT ON public.proposal_timer_events TO authenticated; GRANT ALL ON public.proposal_timer_events TO service_role;
ALTER TABLE public.proposal_timer_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY timer_events_read ON public.proposal_timer_events FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR public.can_manage_user(p.seller_user_id))));
CREATE POLICY timer_events_insert ON public.proposal_timer_events FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR public.can_manage_user(p.seller_user_id))));

CREATE TABLE public.followups (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES public.students(id), proposal_id uuid REFERENCES public.proposals(id), owner_user_id uuid NOT NULL, due_at timestamptz NOT NULL, notes text, status public.followup_status NOT NULL DEFAULT 'pending', completed_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.followups TO authenticated; GRANT ALL ON public.followups TO service_role;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY followups_read ON public.followups FOR SELECT TO authenticated USING(owner_user_id=auth.uid() OR public.can_manage_user(owner_user_id));
CREATE POLICY followups_write ON public.followups FOR ALL TO authenticated USING(owner_user_id=auth.uid() OR public.can_manage_user(owner_user_id)) WITH CHECK(owner_user_id=auth.uid() OR public.can_manage_user(owner_user_id));

CREATE TABLE public.audit_logs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, action text NOT NULL, entity_type text NOT NULL, entity_id uuid, previous_data jsonb, new_data jsonb, notes text, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT ON public.audit_logs TO authenticated; GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_insert ON public.audit_logs FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid());
CREATE POLICY audit_admin_read ON public.audit_logs FOR SELECT TO authenticated USING(public.is_admin());

CREATE INDEX idx_roles_user ON public.user_roles(user_id) WHERE active;
CREATE INDEX idx_members_user ON public.team_members(user_id) WHERE active;
CREATE INDEX idx_courses_area ON public.courses(area_id,status,sort_order);
CREATE INDEX idx_prices_course ON public.course_prices(course_id,status);
CREATE UNIQUE INDEX idx_students_whatsapp ON public.students(regexp_replace(whatsapp,'\D','','g')) WHERE status='active';
CREATE INDEX idx_students_owner_stage ON public.students(current_owner_id,crm_stage_id,status);
CREATE INDEX idx_proposals_seller_status ON public.proposals(seller_user_id,status,created_at DESC);
CREATE INDEX idx_proposals_student ON public.proposals(student_id,created_at DESC);
CREATE INDEX idx_followups_owner_due ON public.followups(owner_user_id,due_at) WHERE status='pending';
CREATE INDEX idx_events_proposal ON public.proposal_events(proposal_id,created_at DESC);
CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type,entity_id,created_at DESC);

CREATE TRIGGER trg_roles_updated BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_teams_updated BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_members_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_areas_updated BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_prices_updated BEFORE UPDATE ON public.course_prices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_installments_updated BEFORE UPDATE ON public.installment_options FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_discounts_updated BEFORE UPDATE ON public.discount_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_campaigns_updated BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_conditions_updated BEFORE UPDATE ON public.commercial_conditions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_stages_updated BEFORE UPDATE ON public.crm_stages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_assignments_updated BEFORE UPDATE ON public.student_assignments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_interactions_updated BEFORE UPDATE ON public.student_interactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_proposals_updated BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_followups_updated BEFORE UPDATE ON public.followups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

WITH a AS (INSERT INTO public.areas(name,description,sort_order,is_demo) VALUES ('Tecnologia — Demonstração','Dados apenas para teste',1,true),('Gestão — Demonstração','Dados apenas para teste',2,true) RETURNING id,name),
c AS (INSERT INTO public.courses(area_id,name,description,workload_hours,modality,sort_order,is_demo) SELECT id,CASE WHEN name LIKE 'Tecnologia%' THEN 'Excel Profissional — Demonstração' ELSE 'Administração — Demonstração' END,'Curso de teste',CASE WHEN name LIKE 'Tecnologia%' THEN 120 ELSE 160 END,'Presencial',1,true FROM a RETURNING id,name),
p AS (INSERT INTO public.course_prices(course_id,name,amount,is_demo) SELECT id,'Preço de tabela — Demonstração',CASE WHEN name LIKE 'Excel%' THEN 2400 ELSE 2800 END,true FROM c RETURNING id),
pm AS (INSERT INTO public.payment_methods(name,sort_order,is_demo) VALUES ('Cartão de crédito — Demonstração',1,true),('PIX — Demonstração',2,true) RETURNING id,name),
io AS (INSERT INTO public.installment_options(payment_method_id,installments,sort_order,is_demo) SELECT id,CASE WHEN name LIKE 'Cartão%' THEN 12 ELSE 1 END,1,true FROM pm RETURNING id),
d AS (INSERT INTO public.discount_rules(name,discount_type,value,recommended,allowed_roles,is_demo) VALUES ('Condição padrão — Demonstração','percentage',10,true,ARRAY['admin','manager','seller']::public.app_role[],true) RETURNING id)
INSERT INTO public.crm_stages(name,color_key,sort_order,is_won,is_lost,is_demo) VALUES
('Novo — Demonstração','blue',1,false,false,true),('Contato realizado — Demonstração','cyan',2,false,false,true),('Interesse — Demonstração','amber',3,false,false,true),('Proposta enviada — Demonstração','violet',4,false,false,true),('Aguardando resposta — Demonstração','orange',5,false,false,true),('Negociação — Demonstração','pink',6,false,false,true),('Retorno agendado — Demonstração','teal',7,false,false,true),('Matriculado — Demonstração','green',8,true,false,true),('Perdido — Demonstração','red',9,false,true,true);

INSERT INTO public.commercial_conditions(name,course_id,course_price_id,payment_method_id,installment_option_id,discount_rule_id,validity_minutes,allowed_roles,is_demo)
SELECT 'Condição inicial — Demonstração',c.id,cp.id,pm.id,io.id,d.id,30,ARRAY['admin','manager','seller']::public.app_role[],true
FROM public.courses c JOIN public.course_prices cp ON cp.course_id=c.id CROSS JOIN LATERAL (SELECT * FROM public.payment_methods WHERE name LIKE 'Cartão%' LIMIT 1) pm JOIN public.installment_options io ON io.payment_method_id=pm.id CROSS JOIN public.discount_rules d WHERE c.is_demo AND d.is_demo;