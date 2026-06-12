# Supabase Setup

This folder contains database setup files for the ELLI Student Blogging
Platform.

## Current Project

- Supabase project URL is configured locally in `web/.env.local`.
- The publishable key is configured locally in `web/.env.local`.
- The service role key is intentionally not stored in this repository.
- Supabase CLI has been initialized with `supabase/config.toml`.
- The initial migration has been applied to the remote Supabase database.
- Direct IPv6 database access was not available from this machine, so the
  migration was applied through the session pooler host for this project.

## CLI Status

The CLI is currently run through:

```bash
npx supabase@latest
```

The local CLI project has been initialized:

```bash
npx supabase@latest init
```

Remote linking is not complete yet because `supabase link` requires a Supabase
Personal Access Token. To complete the link later:

```bash
npx supabase@latest login --token <personal-access-token>
npx supabase@latest link --project-ref nohzklegahxyakthvosg
```

Use the database password only when the CLI prompts for it. Do not commit it.

## Apply The Initial Schema

The first migration is:

```text
supabase/migrations/20260612143000_initial_schema.sql
```

Status: applied to the remote database on June 12, 2026.

Verification completed:

- `supabase db push --dry-run` reports that the remote database is up to date.
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

After `supabase link` is completed with a Personal Access Token, this same
folder can be used as the migration source for normal linked-project CLI
commands.

## Security Notes

- Keep Row Level Security enabled on all application tables.
- Do not paste the service role key into browser code.
- Do not commit `.env.local`.
- Rotate any service role key that has been shared in chat before production.
- Use the service role only for trusted server-side maintenance or admin scripts.
