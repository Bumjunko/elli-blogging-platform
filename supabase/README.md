# Supabase Setup

This folder contains database setup files for the ELLI Student Blogging
Platform.

## Current Project

- Supabase project URL is configured locally in `web/.env.local`.
- The publishable key is configured locally in `web/.env.local`.
- The service role key is intentionally not stored in this repository.
- Supabase CLI has been initialized with `supabase/config.toml`.
- Supabase CLI login and project linking are complete.
- The initial migration has been applied to the remote Supabase database.
- Direct IPv6 database access was not available from this machine, so the
  migration was applied through the session pooler host for this project.

## CLI Status

The CLI is currently run through:

```bash
npx supabase@latest
```

The local CLI project has been initialized and linked:

```bash
npx supabase@latest init
npx supabase@latest login --token <personal-access-token>
npx supabase@latest link --project-ref nohzklegahxyakthvosg
```

Use the database password only when the CLI prompts for it. Do not commit it.
The token and database password are not stored in this repository.

Linked-project commands can now be used from the project root. For example:

```bash
npx supabase@latest db push --linked --dry-run
```

## Apply The Initial Schema

The first migration is:

```text
supabase/migrations/20260612143000_initial_schema.sql
```

Status: applied to the remote database on June 12, 2026.

Verification completed:

- `supabase db push --linked --dry-run` reports that the remote database is up
  to date.
- The public Data API returns `200 OK` for `/rest/v1/posts?select=id&limit=1`.
- These public tables exist with RLS enabled:
  - `profiles`
  - `posts`
  - `post_status_history`
  - `deletion_requests`
- The `post-images` storage bucket exists, is private, and has a 5 MB file size
  limit.

If the migration needs to be applied manually in a fresh project, use the
Supabase Dashboard:

1. Open the Supabase project.
2. Go to SQL Editor.
3. Create a new query.
4. Paste the full migration SQL.
5. Run the query.
6. Confirm these tables exist under Table Editor:
   - `profiles`
   - `posts`
   - `post_status_history`
   - `deletion_requests`
7. Confirm the `post-images` storage bucket exists.

Because `supabase link` is complete, this folder can be used as the migration
source for normal linked-project CLI commands.

## Auth Dashboard Settings

The Next.js app now has these auth routes:

- `/signup`
- `/login`
- `/auth/callback`
- `/dashboard`

Confirm these settings in the Supabase Dashboard:

1. Go to Authentication.
2. Open URL Configuration.
3. Set Site URL to:

   ```text
   http://localhost:3000
   ```

4. Add these redirect URLs:

   ```text
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   http://localhost:3000/login
   ```

5. Go to Authentication, then Providers, then Email.
6. Confirm email/password signups are enabled.
7. For a realistic MVP test, keep email confirmation enabled and test with a
   real `@angelo.edu` inbox.

Do not push the entire local `supabase/config.toml` to the hosted project unless
the remote config changes have been reviewed. The local file includes
development settings for the local stack.

## Security Notes

- Keep Row Level Security enabled on all application tables.
- Do not paste the service role key into browser code.
- Do not commit `.env.local`.
- Rotate any service role key that has been shared in chat before production.
- Use the service role only for trusted server-side maintenance or admin scripts.
