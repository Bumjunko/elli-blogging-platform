create extension if not exists pgcrypto with schema extensions;

do $$
begin
  create type public.post_review_status as enum (
    'draft',
    'submitted',
    'revision_requested',
    'approved',
    'rejected',
    'archived'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  privacy_consent_accepted boolean not null default false,
  privacy_consent_at timestamptz,
  privacy_consent_version text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 140),
  slug text not null unique,
  excerpt text check (excerpt is null or char_length(excerpt) <= 220),
  content text not null check (char_length(content) >= 20),
  featured_image_path text,
  featured_image_alt text check (
    featured_image_alt is null or char_length(featured_image_alt) <= 180
  ),
  review_status public.post_review_status not null default 'draft',
  is_published boolean not null default false,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  admin_note text,
  photo_consent_accepted boolean not null default false,
  public_posting_consent_accepted boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint posts_publication_requires_approval check (
    not is_published
    or (review_status = 'approved' and published_at is not null)
  ),
  constraint posts_submission_requires_consent check (
    review_status = 'draft'
    or (
      submitted_at is not null
      and photo_consent_accepted
      and public_posting_consent_accepted
    )
  )
);

create table if not exists public.post_status_history (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  changed_by uuid references public.profiles(id) on delete set null,
  from_status public.post_review_status,
  to_status public.post_review_status not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 10 and 2000),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'denied', 'completed')
  ),
  admin_response text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists posts_author_id_idx on public.posts(author_id);
create index if not exists posts_review_status_idx on public.posts(review_status);
create index if not exists posts_public_idx
  on public.posts(review_status, is_published, published_at desc);
create index if not exists post_status_history_post_id_idx
  on public.post_status_history(post_id);
create index if not exists deletion_requests_post_id_idx
  on public.deletion_requests(post_id);
create index if not exists deletion_requests_status_idx
  on public.deletion_requests(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_deletion_requests_updated_at on public.deletion_requests;
create trigger set_deletion_requests_updated_at
before update on public.deletion_requests
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
    and not public.is_admin()
    and (
      new.role is distinct from old.role
      or new.email is distinct from old.email
    )
  then
    raise exception 'Only admins can change profile role or email.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_privilege_escalation on public.profiles;
create trigger prevent_profile_privilege_escalation
before update on public.profiles
for each row execute function public.prevent_profile_privilege_escalation();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null or lower(new.email) not like '%@angelo.edu' then
    raise exception 'Only @angelo.edu email addresses can register.';
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    privacy_consent_accepted,
    privacy_consent_at,
    privacy_consent_version
  )
  values (
    new.id,
    lower(new.email),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(new.email, '@', 1)
    ),
    'student',
    coalesce((new.raw_user_meta_data ->> 'privacy_consent_accepted')::boolean, false),
    case
      when coalesce((new.raw_user_meta_data ->> 'privacy_consent_accepted')::boolean, false)
      then timezone('utc', now())
      else null
    end,
    nullif(new.raw_user_meta_data ->> 'privacy_consent_version', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_status_history enable row level security;
alter table public.deletion_requests enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Profiles are readable by admins" on public.profiles;
create policy "Profiles are readable by admins"
on public.profiles for select
to authenticated
using (public.is_admin());

drop policy if exists "Students can insert their own profile" on public.profiles;
create policy "Students can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id and role = 'student');

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by admins" on public.profiles;
create policy "Profiles are updatable by admins"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published posts are publicly readable" on public.posts;
create policy "Published posts are publicly readable"
on public.posts for select
to anon, authenticated
using (review_status = 'approved' and is_published);

drop policy if exists "Students can read their own posts" on public.posts;
create policy "Students can read their own posts"
on public.posts for select
to authenticated
using (author_id = auth.uid());

drop policy if exists "Admins can read all posts" on public.posts;
create policy "Admins can read all posts"
on public.posts for select
to authenticated
using (public.is_admin());

drop policy if exists "Students can create their own posts" on public.posts;
create policy "Students can create their own posts"
on public.posts for insert
to authenticated
with check (
  author_id = auth.uid()
  and review_status = 'draft'
  and not is_published
);

drop policy if exists "Students can update editable own posts" on public.posts;
create policy "Students can update editable own posts"
on public.posts for update
to authenticated
using (
  author_id = auth.uid()
  and review_status in ('draft', 'revision_requested')
  and not is_published
)
with check (
  author_id = auth.uid()
  and review_status in ('draft', 'submitted')
  and not is_published
);

drop policy if exists "Admins can update all posts" on public.posts;
create policy "Admins can update all posts"
on public.posts for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students can read history for own posts" on public.post_status_history;
create policy "Students can read history for own posts"
on public.post_status_history for select
to authenticated
using (
  exists (
    select 1
    from public.posts
    where posts.id = post_status_history.post_id
      and posts.author_id = auth.uid()
  )
);

drop policy if exists "Admins can read all post history" on public.post_status_history;
create policy "Admins can read all post history"
on public.post_status_history for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert post history" on public.post_status_history;
create policy "Admins can insert post history"
on public.post_status_history for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Students can create deletion requests" on public.deletion_requests;
create policy "Students can create deletion requests"
on public.deletion_requests for insert
to authenticated
with check (
  requested_by = auth.uid()
  and status = 'pending'
  and exists (
    select 1
    from public.posts
    where posts.id = deletion_requests.post_id
      and posts.author_id = auth.uid()
  )
);

drop policy if exists "Students can read own deletion requests" on public.deletion_requests;
create policy "Students can read own deletion requests"
on public.deletion_requests for select
to authenticated
using (requested_by = auth.uid());

drop policy if exists "Admins can read all deletion requests" on public.deletion_requests;
create policy "Admins can read all deletion requests"
on public.deletion_requests for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update deletion requests" on public.deletion_requests;
create policy "Admins can update deletion requests"
on public.deletion_requests for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'post-images',
  'post-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read published post images" on storage.objects;
create policy "Public can read published post images"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'post-images'
  and exists (
    select 1
    from public.posts
    where posts.featured_image_path = storage.objects.name
      and posts.review_status = 'approved'
      and posts.is_published
  )
);

drop policy if exists "Students can upload own post images" on storage.objects;
create policy "Students can upload own post images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Students can read own post images" on storage.objects;
create policy "Students can read own post images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Students can update own post images" on storage.objects;
create policy "Students can update own post images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Students can delete own post images" on storage.objects;
create policy "Students can delete own post images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admins can manage all post images" on storage.objects;
create policy "Admins can manage all post images"
on storage.objects for all
to authenticated
using (bucket_id = 'post-images' and public.is_admin())
with check (bucket_id = 'post-images' and public.is_admin());
