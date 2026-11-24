create extension if not exists pgcrypto with schema extensions;

create type public.account_role as enum ('patient', 'doctor', 'admin');
create type public.access_status as enum ('requested', 'granted', 'revoked');
create type public.clinical_record_status as enum ('draft', 'signed');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (length(full_name) <= 160),
  role public.account_role not null default 'patient',
  clinician_verified boolean not null default false,
  preferred_language text not null default 'fr' check (preferred_language in ('fr', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patient_records (
  patient_id uuid primary key references public.profiles (id) on delete cascade,
  patient_code text not null unique,
  date_of_birth date,
  blood_type text check (blood_type is null or blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  allergies text check (allergies is null or length(allergies) <= 4000),
  medical_history text check (medical_history is null or length(medical_history) <= 8000),
  emergency_contact text check (emergency_contact is null or length(emergency_contact) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patient_access (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_records (patient_id) on delete cascade,
  doctor_id uuid not null references public.profiles (id) on delete cascade,
  status public.access_status not null default 'requested',
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  unique (patient_id, doctor_id)
);

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_records (patient_id) on delete restrict,
  doctor_id uuid not null references public.profiles (id) on delete restrict,
  consultation_date date not null default current_date,
  consultation_type text not null check (length(trim(consultation_type)) between 1 and 100),
  reason text not null check (length(trim(reason)) between 1 and 4000),
  observations text not null default '' check (length(observations) <= 12000),
  diagnosis text not null default '' check (length(diagnosis) <= 12000),
  follow_up text not null default '' check (length(follow_up) <= 6000),
  status public.clinical_record_status not null default 'draft',
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'draft' and signed_at is null) or (status = 'signed' and signed_at is not null))
);

create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_records (patient_id) on delete restrict,
  doctor_id uuid not null references public.profiles (id) on delete restrict,
  consultation_id uuid references public.consultations (id) on delete restrict,
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 50),
  notes text not null default '' check (length(notes) <= 6000),
  status public.clinical_record_status not null default 'draft',
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'draft' and signed_at is null) or (status = 'signed' and signed_at is not null))
);

create table public.medical_documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_records (patient_id) on delete restrict,
  uploaded_by uuid not null references public.profiles (id) on delete restrict,
  object_path text not null unique,
  category text not null check (category in ('exam', 'prescription', 'report', 'other')),
  file_name text not null check (length(file_name) between 1 and 255),
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  check (object_path like patient_id::text || '/%'),
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_records (patient_id) on delete restrict,
  doctor_id uuid not null references public.profiles (id) on delete restrict,
  starts_at timestamptz not null,
  reason text not null check (length(trim(reason)) between 1 and 1000),
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  notification_type text not null,
  message text not null check (length(message) between 1 and 500),
  related_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  category text not null default 'Communauté générale'
    check (category in ('Communauté générale', 'Drépanocytose', 'Santé des enfants', 'Bien-être et écoute', 'Santé rurale')),
  body text not null check (length(trim(body)) between 1 and 4000),
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.community_reactions (
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (length(trim(reason)) between 1 and 1000),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  event_type text not null,
  table_name text not null,
  record_id uuid,
  created_at timestamptz not null default now()
);

create index patient_access_doctor_status_idx on public.patient_access (doctor_id, status, expires_at);
create index consultations_patient_date_idx on public.consultations (patient_id, consultation_date desc);
create index consultations_doctor_date_idx on public.consultations (doctor_id, consultation_date desc);
create index prescriptions_patient_created_idx on public.prescriptions (patient_id, created_at desc);
create index medical_documents_patient_created_idx on public.medical_documents (patient_id, created_at desc);
create index appointments_patient_start_idx on public.appointments (patient_id, starts_at);
create index appointments_doctor_start_idx on public.appointments (doctor_id, starts_at);
create index notifications_user_created_idx on public.notifications (user_id, created_at desc);
create index community_posts_created_idx on public.community_posts (created_at desc);
create index community_comments_post_created_idx on public.community_comments (post_id, created_at);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.save_consultation(
  p_patient_id uuid,
  p_consultation_date date,
  p_consultation_type text,
  p_reason text,
  p_observations text,
  p_diagnosis text,
  p_follow_up text,
  p_prescription_items jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_consultation_id uuid;
begin
  if not public.is_verified_doctor() or not public.has_patient_access(p_patient_id) then
    raise exception 'Verified doctor status and valid patient authorization are required';
  end if;

  insert into public.consultations (
    patient_id, doctor_id, consultation_date, consultation_type,
    reason, observations, diagnosis, follow_up
  )
  values (
    p_patient_id, (select auth.uid()), p_consultation_date, p_consultation_type,
    p_reason, coalesce(p_observations, ''), coalesce(p_diagnosis, ''), coalesce(p_follow_up, '')
  )
  returning id into created_consultation_id;

  if p_prescription_items is not null then
    if jsonb_typeof(p_prescription_items) <> 'array'
      or jsonb_array_length(p_prescription_items) not between 1 and 50 then
      raise exception 'Prescription must contain between 1 and 50 items';
    end if;
    insert into public.prescriptions (patient_id, doctor_id, consultation_id, items)
    values (p_patient_id, (select auth.uid()), created_consultation_id, p_prescription_items);
  end if;

  return created_consultation_id;
end;
$$;

create or replace function public.is_verified_doctor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'doctor'
      and p.clinician_verified
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

create or replace function public.has_patient_access(target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.patient_access a
    where a.patient_id = target_patient_id
      and a.doctor_id = (select auth.uid())
      and a.status = 'granted'
      and (a.expires_at is null or a.expires_at > now())
  );
$$;

create or replace function public.is_patient_or_authorized_doctor(target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (
      (select auth.uid()) = target_patient_id
      and exists (
        select 1 from public.profiles p
        where p.id = (select auth.uid()) and p.role = 'patient'
      )
    )
    or (
      public.is_verified_doctor()
      and public.has_patient_access(target_patient_id)
    )
    or public.is_platform_admin();
$$;

create or replace function public.log_patient_record_read(
  target_patient_id uuid,
  target_record_id uuid,
  target_table_name text
)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  record_matches boolean := false;
begin
  if (select auth.uid()) is null
    or not public.is_patient_or_authorized_doctor(target_patient_id) then
    return false;
  end if;

  case target_table_name
    when 'patient_records' then
      select exists (
        select 1 from public.patient_records r
        where r.patient_id = target_patient_id and r.patient_id = target_record_id
      ) into record_matches;
    when 'consultations' then
      select exists (
        select 1 from public.consultations r
        where r.patient_id = target_patient_id and r.id = target_record_id
      ) into record_matches;
    when 'prescriptions' then
      select exists (
        select 1 from public.prescriptions r
        where r.patient_id = target_patient_id and r.id = target_record_id
      ) into record_matches;
    when 'medical_documents' then
      select exists (
        select 1 from public.medical_documents r
        where r.patient_id = target_patient_id and r.id = target_record_id
      ) into record_matches;
    when 'appointments' then
      select exists (
        select 1 from public.appointments r
        where r.patient_id = target_patient_id and r.id = target_record_id
      ) into record_matches;
    when 'storage.objects' then
      select exists (
        select 1 from storage.objects r
        where r.id = target_record_id
          and r.bucket_id = 'medical-documents'
          and r.name like target_patient_id::text || '/%'
      ) into record_matches;
    else
      return false;
  end case;

  if not record_matches then
    return false;
  end if;

  insert into public.audit_events (actor_id, event_type, table_name, record_id)
  values ((select auth.uid()), 'READ', target_table_name, target_record_id);
  return true;
end;
$$;

create or replace function public.issue_patient_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  candidate text;
begin
  loop
    candidate := 'ANO-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
    exit when not exists (
      select 1 from public.patient_records r where r.patient_code = candidate
    );
  end loop;
  return candidate;
end;
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  safe_name text;
begin
  safe_name := left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 160);
  insert into public.profiles (id, full_name)
  values (new.id, safe_name);
  insert into public.patient_records (patient_id, patient_code)
  values (new.id, public.issue_patient_code());
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

insert into public.profiles (id, full_name)
select u.id, left(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), 160)
from auth.users u
on conflict (id) do nothing;

insert into public.patient_records (patient_id, patient_code)
select p.id, public.issue_patient_code()
from public.profiles p
left join public.patient_records r on r.patient_id = p.id
where r.patient_id is null
on conflict (patient_id) do nothing;

create trigger profiles_touch_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger patient_records_touch_updated_at before update on public.patient_records
  for each row execute function public.touch_updated_at();
create trigger consultations_touch_updated_at before update on public.consultations
  for each row execute function public.touch_updated_at();
create trigger prescriptions_touch_updated_at before update on public.prescriptions
  for each row execute function public.touch_updated_at();
create trigger appointments_touch_updated_at before update on public.appointments
  for each row execute function public.touch_updated_at();
create trigger community_posts_touch_updated_at before update on public.community_posts
  for each row execute function public.touch_updated_at();

create or replace function public.prevent_signed_record_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'signed' then
    raise exception 'Signed clinical records are immutable';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger consultations_signed_immutable
  before update or delete on public.consultations
  for each row execute function public.prevent_signed_record_changes();
create trigger prescriptions_signed_immutable
  before update or delete on public.prescriptions
  for each row execute function public.prevent_signed_record_changes();

create or replace function public.validate_prescription_items()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  item jsonb;
begin
  if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) not between 1 and 50 then
    raise exception 'Prescription must contain between 1 and 50 items';
  end if;
  for item in select value from jsonb_array_elements(new.items) loop
    if jsonb_typeof(item) <> 'object'
      or coalesce(jsonb_typeof(item -> 'instructions'), 'null') <> 'string'
      or coalesce(length(trim(item ->> 'instructions')), 0) not between 1 and 2000 then
      raise exception 'Each prescription item must contain instructions between 1 and 2000 characters';
    end if;
  end loop;
  return new;
end;
$$;

create trigger prescriptions_validate_items
  before insert or update of items on public.prescriptions
  for each row execute function public.validate_prescription_items();

create or replace function public.write_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_id uuid;
begin
  if tg_op = 'DELETE' then
    affected_id := coalesce(to_jsonb(old) ->> 'id', to_jsonb(old) ->> 'patient_id')::uuid;
  else
    affected_id := coalesce(to_jsonb(new) ->> 'id', to_jsonb(new) ->> 'patient_id')::uuid;
  end if;
  insert into public.audit_events (actor_id, event_type, table_name, record_id)
  values ((select auth.uid()), tg_op, tg_table_name, affected_id);
  return coalesce(new, old);
end;
$$;

create trigger patient_access_audit after insert or update or delete on public.patient_access
  for each row execute function public.write_audit_event();
create trigger profiles_audit after insert or update or delete on public.profiles
  for each row execute function public.write_audit_event();
create trigger patient_records_audit after insert or update or delete on public.patient_records
  for each row execute function public.write_audit_event();
create trigger consultations_audit after insert or update or delete on public.consultations
  for each row execute function public.write_audit_event();
create trigger prescriptions_audit after insert or update or delete on public.prescriptions
  for each row execute function public.write_audit_event();
create trigger medical_documents_audit after insert or update or delete on public.medical_documents
  for each row execute function public.write_audit_event();
create trigger appointments_audit after insert or update or delete on public.appointments
  for each row execute function public.write_audit_event();

create or replace function public.request_patient_access(patient_code_input text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_patient_id uuid;
  access_id uuid;
begin
  if not public.is_verified_doctor() then
    raise exception 'Only verified doctors may request patient access';
  end if;

  select r.patient_id into target_patient_id
  from public.patient_records r
  where r.patient_code = upper(trim(patient_code_input));

  if target_patient_id is null then
    raise exception 'No patient found for that code';
  end if;

  insert into public.patient_access (patient_id, doctor_id, status, requested_at, approved_at, revoked_at)
  values (target_patient_id, (select auth.uid()), 'requested', now(), null, null)
  on conflict (patient_id, doctor_id) do update
    set status = 'requested', requested_at = now(), approved_at = null, expires_at = null, revoked_at = null
    where public.patient_access.status <> 'granted'
       or (public.patient_access.expires_at is not null and public.patient_access.expires_at <= now())
  returning id into access_id;

  if access_id is null then
    select id into access_id from public.patient_access
    where patient_id = target_patient_id and doctor_id = (select auth.uid());
  end if;

  insert into public.notifications (user_id, notification_type, message, related_id)
  values (target_patient_id, 'access_request', 'Un professionnel de santé demande accès à votre dossier.', access_id);
  return access_id;
end;
$$;

create or replace function public.respond_to_access_request(access_id uuid, approve boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.patient_access a
    join public.profiles p on p.id = a.doctor_id
    where a.id = access_id
      and a.patient_id = (select auth.uid())
      and a.status = 'requested'
      and p.role = 'doctor'
      and p.clinician_verified
  ) then
    raise exception 'Access request not found or the professional is not verified';
  end if;

  update public.patient_access
  set status = case when approve then 'granted'::public.access_status else 'revoked'::public.access_status end,
      approved_at = case when approve then now() else null end,
      revoked_at = case when approve then null else now() end
  where id = access_id
    and patient_id = (select auth.uid())
    and status = 'requested';

  if not found then
    raise exception 'Access request not found or already handled';
  end if;

  insert into public.notifications (user_id, notification_type, message, related_id)
  select a.doctor_id, 'access_response',
    case when approve then 'Le patient a autorisé l’accès à son dossier.' else 'Le patient a refusé la demande d’accès au dossier.' end,
    a.id
  from public.patient_access a
  where a.id = access_id;
end;
$$;

create or replace function public.revoke_patient_access(access_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_doctor_id uuid;
begin
  update public.patient_access
  set status = 'revoked', revoked_at = now()
  where id = access_id
    and patient_id = (select auth.uid())
    and status = 'granted';
  if not found then
    raise exception 'Active access grant not found';
  end if;

  select doctor_id into target_doctor_id from public.patient_access where id = access_id;
  insert into public.notifications (user_id, notification_type, message, related_id)
  values (target_doctor_id, 'access_revoked', 'Le patient a révoqué votre accès à son dossier.', access_id);
end;
$$;

create or replace function public.sign_consultation(consultation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_verified_doctor() then
    raise exception 'Only verified doctors may sign consultations';
  end if;
  update public.consultations
  set status = 'signed', signed_at = now()
  where id = consultation_id
    and doctor_id = (select auth.uid())
    and status = 'draft'
    and public.has_patient_access(patient_id);
  if not found then
    raise exception 'Draft consultation not found or patient access is no longer valid';
  end if;
end;
$$;

create or replace function public.sign_prescription(prescription_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_verified_doctor() then
    raise exception 'Only verified doctors may sign prescriptions';
  end if;
  update public.prescriptions
  set status = 'signed', signed_at = now()
  where id = prescription_id
    and doctor_id = (select auth.uid())
    and status = 'draft'
    and public.has_patient_access(patient_id);
  if not found then
    raise exception 'Draft prescription not found or patient access is no longer valid';
  end if;
end;
$$;

create or replace function public.safe_uuid(value text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
begin
  return value::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

create or replace function public.notify_patient_of_consultation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (user_id, notification_type, message, related_id)
  values (new.patient_id, 'consultation', 'Une consultation a été ajoutée à votre dossier.', new.id);
  return new;
end;
$$;

create trigger consultation_patient_notification
  after insert on public.consultations
  for each row execute function public.notify_patient_of_consultation();

alter table public.profiles enable row level security;
alter table public.patient_records enable row level security;
alter table public.patient_access enable row level security;
alter table public.consultations enable row level security;
alter table public.prescriptions enable row level security;
alter table public.medical_documents enable row level security;
alter table public.appointments enable row level security;
alter table public.notifications enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_reactions enable row level security;
alter table public.community_reports enable row level security;
alter table public.audit_events enable row level security;

revoke all on public.profiles, public.patient_records, public.patient_access,
  public.consultations, public.prescriptions, public.medical_documents,
  public.appointments, public.notifications, public.community_posts,
  public.community_comments, public.community_reactions, public.community_reports,
  public.audit_events from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, preferred_language) on public.profiles to authenticated;
grant select on public.patient_records to authenticated;
grant update (date_of_birth, blood_type, allergies, medical_history, emergency_contact) on public.patient_records to authenticated;
grant select on public.patient_access to authenticated;
grant select, insert on public.consultations to authenticated;
grant update (consultation_date, consultation_type, reason, observations, diagnosis, follow_up) on public.consultations to authenticated;
grant select on public.prescriptions to authenticated;
grant update (items, notes) on public.prescriptions to authenticated;
grant select, insert on public.medical_documents to authenticated;
grant select, insert on public.appointments to authenticated;
grant update (starts_at, reason, status) on public.appointments to authenticated;
grant select, update (read_at) on public.notifications to authenticated;
grant select, insert, update, delete on public.community_posts to authenticated;
grant select, insert, update, delete on public.community_comments to authenticated;
grant select, insert, delete on public.community_reactions to authenticated;
grant insert on public.community_reports to authenticated;
grant select on public.audit_events to authenticated;

grant usage on type public.account_role, public.access_status, public.clinical_record_status to authenticated;
revoke execute on function public.issue_patient_code() from public, anon, authenticated;
revoke execute on function public.create_profile_for_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.prevent_signed_record_changes() from public, anon, authenticated;
revoke execute on function public.write_audit_event() from public, anon, authenticated;
revoke execute on function public.validate_prescription_items() from public, anon, authenticated;
revoke execute on function public.notify_patient_of_consultation() from public, anon, authenticated;
revoke execute on function public.is_verified_doctor() from public, anon;
revoke execute on function public.is_platform_admin() from public, anon;
revoke execute on function public.has_patient_access(uuid) from public, anon;
revoke execute on function public.is_patient_or_authorized_doctor(uuid) from public, anon;
revoke execute on function public.safe_uuid(text) from public, anon;
revoke execute on function public.log_patient_record_read(uuid, uuid, text) from public, anon;
revoke execute on function public.request_patient_access(text) from public, anon;
revoke execute on function public.respond_to_access_request(uuid, boolean) from public, anon;
revoke execute on function public.revoke_patient_access(uuid) from public, anon;
revoke execute on function public.sign_consultation(uuid) from public, anon;
revoke execute on function public.sign_prescription(uuid) from public, anon;
revoke execute on function public.save_consultation(uuid, date, text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.request_patient_access(text) to authenticated;
grant execute on function public.respond_to_access_request(uuid, boolean) to authenticated;
grant execute on function public.revoke_patient_access(uuid) to authenticated;
grant execute on function public.sign_consultation(uuid) to authenticated;
grant execute on function public.sign_prescription(uuid) to authenticated;
grant execute on function public.save_consultation(uuid, date, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.is_verified_doctor() to authenticated;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.has_patient_access(uuid) to authenticated;
grant execute on function public.is_patient_or_authorized_doctor(uuid) to authenticated;
grant execute on function public.safe_uuid(text) to authenticated;
grant execute on function public.log_patient_record_read(uuid, uuid, text) to authenticated;

create policy "users read own or authorized profiles" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.has_patient_access(id) or public.is_platform_admin());
create policy "users update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "patients and authorized doctors read patient records" on public.patient_records
  for select to authenticated
  using (public.log_patient_record_read(patient_id, patient_id, 'patient_records'));
create policy "patients update their own record" on public.patient_records
  for update to authenticated
  using (
    patient_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'patient'
    )
  )
  with check (
    patient_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'patient'
    )
  );

create policy "participants read access grants" on public.patient_access
  for select to authenticated
  using (patient_id = (select auth.uid()) or doctor_id = (select auth.uid()) or public.is_platform_admin());
create policy "participants read authorized consultations" on public.consultations
  for select to authenticated
  using (public.log_patient_record_read(patient_id, id, 'consultations'));
create policy "verified doctors create draft consultations" on public.consultations
  for insert to authenticated
  with check (
    doctor_id = (select auth.uid())
    and status = 'draft'
    and signed_at is null
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
  );
create policy "doctors update their authorized draft consultations" on public.consultations
  for update to authenticated
  using (
    doctor_id = (select auth.uid())
    and status = 'draft'
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
  )
  with check (
    doctor_id = (select auth.uid())
    and status = 'draft'
    and signed_at is null
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
  );

create policy "participants read authorized prescriptions" on public.prescriptions
  for select to authenticated
  using (public.log_patient_record_read(patient_id, id, 'prescriptions'));
create policy "verified doctors create draft prescriptions" on public.prescriptions
  for insert to authenticated
  with check (
    doctor_id = (select auth.uid())
    and status = 'draft'
    and signed_at is null
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
  );
create policy "doctors update their authorized draft prescriptions" on public.prescriptions
  for update to authenticated
  using (
    doctor_id = (select auth.uid())
    and status = 'draft'
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
  )
  with check (
    doctor_id = (select auth.uid())
    and status = 'draft'
    and signed_at is null
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
  );

create policy "participants read authorized document metadata" on public.medical_documents
  for select to authenticated using (public.log_patient_record_read(patient_id, id, 'medical_documents'));
create policy "patients or authorized doctors add document metadata" on public.medical_documents
  for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and object_path like patient_id::text || '/%'
    and public.is_patient_or_authorized_doctor(patient_id)
  );

create policy "participants read appointments" on public.appointments
  for select to authenticated using (public.log_patient_record_read(patient_id, id, 'appointments'));
create policy "patients request their own appointments" on public.appointments
  for insert to authenticated
  with check (
    patient_id = (select auth.uid())
    and status = 'requested'
    and exists (
      select 1 from public.profiles p
      where p.id = doctor_id and p.role = 'doctor' and p.clinician_verified
    )
  );
create policy "patients cancel their own appointments" on public.appointments
  for update to authenticated
  using (patient_id = (select auth.uid()))
  with check (patient_id = (select auth.uid()) and status = 'cancelled');
create policy "authorized doctors update appointments" on public.appointments
  for update to authenticated
  using (
    doctor_id = (select auth.uid())
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
  )
  with check (
    doctor_id = (select auth.uid())
    and public.is_verified_doctor()
    and public.has_patient_access(patient_id)
    and status in ('confirmed', 'cancelled', 'completed')
  );

create policy "users read own notifications" on public.notifications
  for select to authenticated using (user_id = (select auth.uid()));
create policy "users mark own notifications read" on public.notifications
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "members read published community posts" on public.community_posts
  for select to authenticated
  using (status = 'published' or author_id = (select auth.uid()) or public.is_platform_admin());
create policy "members create their own community posts" on public.community_posts
  for insert to authenticated
  with check (author_id = (select auth.uid()) and status = 'published');
create policy "authors edit their own published posts" on public.community_posts
  for update to authenticated
  using (author_id = (select auth.uid()) and status = 'published')
  with check (author_id = (select auth.uid()) and status = 'published');
create policy "authors or admins delete posts" on public.community_posts
  for delete to authenticated
  using (author_id = (select auth.uid()) or public.is_platform_admin());

create policy "members read comments on visible posts" on public.community_comments
  for select to authenticated
  using (
    exists (
      select 1 from public.community_posts p
      where p.id = post_id and (p.status = 'published' or p.author_id = (select auth.uid()))
    )
  );
create policy "members comment on published posts" on public.community_comments
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published')
  );
create policy "authors edit their own comments" on public.community_comments
  for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));
create policy "authors or admins delete comments" on public.community_comments
  for delete to authenticated
  using (author_id = (select auth.uid()) or public.is_platform_admin());

create policy "members read reactions on visible posts" on public.community_reactions
  for select to authenticated
  using (exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published'));
create policy "members react as themselves" on public.community_reactions
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published')
  );
create policy "members remove their own reaction" on public.community_reactions
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "members report published posts" on public.community_reports
  for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published')
  );

create policy "admins read audit events" on public.audit_events
  for select to authenticated using (public.is_platform_admin());

grant select on public.community_reports to authenticated;
create policy "admins read community reports" on public.community_reports
  for select to authenticated using (public.is_platform_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('medical-documents', 'medical-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update
set public = false,
    file_size_limit = 10485760,
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png'];

create policy "patients and authorized doctors read private medical files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'medical-documents'
    and public.log_patient_record_read(public.safe_uuid((storage.foldername(name))[1]), id, 'storage.objects')
  );
create policy "uploaders remove their own private medical files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'medical-documents'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
create policy "patients and authorized doctors upload private medical files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'medical-documents'
    and public.is_patient_or_authorized_doctor(public.safe_uuid((storage.foldername(name))[1]))
  );
