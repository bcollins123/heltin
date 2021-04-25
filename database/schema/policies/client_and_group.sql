---- select

create policy select_client_is_admin_policy on public.client
  as permissive
  for select
  using (
    public.user_is_admin(public.viewer())
  );

create policy select_client_is_created_by_policy on public.client
  as permissive
  for select
  using (
    client.created_by = public.viewer_user_id()
  );

create policy select_client_is_assistant_and_not_discrete_policy on public.client
  as permissive
  for select
  using (
    public.user_is_assistant(public.viewer())
    and not client.discrete
  );

create policy select_client_is_assigned_mental_health_professional_policy on public.client
  as permissive
  for select
  using (
    exists(select from public.client_assigned_mental_health_professional
        inner join public.mental_health_professional
        on mental_health_professional.id = client_assigned_mental_health_professional.mental_health_professional_id
        and mental_health_professional.user_id = public.viewer_user_id()
      where client_id = client.id)
  );

create policy select_client_has_case_study_mental_health_professional_policy on public.client
  as permissive
  for select
  using (
    exists(select from public.case_study_mental_health_professional
        inner join public.mental_health_professional
        on mental_health_professional.id = case_study_mental_health_professional.mental_health_professional_id
        and mental_health_professional.user_id = public.viewer_user_id()
        inner join public.case_study
        on case_study.id = case_study_mental_health_professional.case_study_id
      where case_study.client_id = client.id)
  );

---- insert

create policy insert_client_is_admin_policy on public.client
  as permissive
  for insert
  with check (
    public.user_is_admin(public.viewer())
  );

create policy insert_client_is_assistant_policy on public.client
  as permissive
  for insert
  with check (
    public.user_is_assistant(public.viewer())
  );

---- update

create policy update_client_is_admin_policy on public.client
  as permissive
  for update
  using (
    public.user_is_admin(public.viewer())
  );

create policy update_client_is_assistant_policy on public.client
  as permissive
  for update
  using (
    public.user_is_assistant(public.viewer())
  );

create policy update_client_is_created_by_policy on public.client
  as permissive
  for update
  using (
    client.created_by = public.viewer_user_id()
  );

---- delete

create policy delete_client_is_admin_policy on public.client
  as permissive
  for delete
  using (
    public.user_is_admin(public.viewer())
  );

----

alter table public.client enable row level security;