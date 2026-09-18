CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.has_role(uuid,public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_admin() SET SCHEMA private;
ALTER FUNCTION public.can_manage_user(uuid) SET SCHEMA private;
DROP FUNCTION public.claim_initial_admin();

REVOKE ALL ON FUNCTION private.has_role(uuid,public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_manage_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid,public.app_role), private.is_admin(), private.can_manage_user(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid,_role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,private AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role AND active) $$;
CREATE OR REPLACE FUNCTION private.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,private AS $$ SELECT private.has_role(auth.uid(),'admin') $$;
CREATE OR REPLACE FUNCTION private.can_manage_user(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,private AS $$ SELECT private.is_admin() OR EXISTS(SELECT 1 FROM public.teams t JOIN public.team_members tm ON tm.team_id=t.id WHERE t.manager_user_id=auth.uid() AND tm.user_id=_user_id AND tm.active) $$;

ALTER POLICY user_roles_admin_all ON public.user_roles USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY teams_admin_all ON public.teams USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY team_members_admin_all ON public.team_members USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY areas_admin_write ON public.areas USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY courses_admin_write ON public.courses USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY course_prices_admin_write ON public.course_prices USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY payment_methods_admin_write ON public.payment_methods USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY installments_admin_write ON public.installment_options USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY discounts_admin_write ON public.discount_rules USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY discount_courses_admin_write ON public.discount_courses USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY discount_payment_admin_write ON public.discount_payment_methods USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY campaigns_admin_write ON public.campaigns USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY conditions_admin_write ON public.commercial_conditions USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY crm_stages_admin_write ON public.crm_stages USING(private.is_admin()) WITH CHECK(private.is_admin());
ALTER POLICY students_read ON public.students USING(current_owner_id=auth.uid() OR created_by=auth.uid() OR private.can_manage_user(current_owner_id));
ALTER POLICY students_insert ON public.students WITH CHECK(created_by=auth.uid() AND (current_owner_id=auth.uid() OR private.is_admin()));
ALTER POLICY students_update ON public.students USING(current_owner_id=auth.uid() OR private.can_manage_user(current_owner_id)) WITH CHECK(current_owner_id=auth.uid() OR private.can_manage_user(current_owner_id));
ALTER POLICY assignments_read ON public.student_assignments USING(owner_user_id=auth.uid() OR private.can_manage_user(owner_user_id));
ALTER POLICY assignments_write ON public.student_assignments USING(private.can_manage_user(owner_user_id) OR private.is_admin()) WITH CHECK(private.can_manage_user(owner_user_id) OR private.is_admin());
ALTER POLICY interactions_read ON public.student_interactions USING(EXISTS(SELECT 1 FROM public.students s WHERE s.id=student_id AND (s.current_owner_id=auth.uid() OR private.can_manage_user(s.current_owner_id))));
ALTER POLICY interactions_insert ON public.student_interactions WITH CHECK(user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.students s WHERE s.id=student_id AND (s.current_owner_id=auth.uid() OR private.can_manage_user(s.current_owner_id))));
ALTER POLICY proposals_read ON public.proposals USING(seller_user_id=auth.uid() OR private.can_manage_user(seller_user_id));
ALTER POLICY proposals_insert ON public.proposals WITH CHECK(seller_user_id=auth.uid() OR private.can_manage_user(seller_user_id));
ALTER POLICY proposals_update ON public.proposals USING(seller_user_id=auth.uid() OR private.can_manage_user(seller_user_id)) WITH CHECK(seller_user_id=auth.uid() OR private.can_manage_user(seller_user_id));
ALTER POLICY proposal_events_read ON public.proposal_events USING(EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR private.can_manage_user(p.seller_user_id))));
ALTER POLICY proposal_events_insert ON public.proposal_events WITH CHECK(user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR private.can_manage_user(p.seller_user_id))));
ALTER POLICY timer_events_read ON public.proposal_timer_events USING(EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR private.can_manage_user(p.seller_user_id))));
ALTER POLICY timer_events_insert ON public.proposal_timer_events WITH CHECK(user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.proposals p WHERE p.id=proposal_id AND (p.seller_user_id=auth.uid() OR private.can_manage_user(p.seller_user_id))));
ALTER POLICY followups_read ON public.followups USING(owner_user_id=auth.uid() OR private.can_manage_user(owner_user_id));
ALTER POLICY followups_write ON public.followups USING(owner_user_id=auth.uid() OR private.can_manage_user(owner_user_id)) WITH CHECK(owner_user_id=auth.uid() OR private.can_manage_user(owner_user_id));
ALTER POLICY audit_admin_read ON public.audit_logs USING(private.is_admin());