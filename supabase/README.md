# Supabase Setup

This folder contains database setup files for the ELLI Student Blogging
Platform.

## Current Project

- Supabase project URL is configured locally in `web/.env.local`.
- The publishable key is configured locally in `web/.env.local`.
- The service role key is intentionally not stored in this repository.

## Apply The Initial Schema

The first migration is:

```text
supabase/migrations/20260612143000_initial_schema.sql
```

Apply it in the Supabase Dashboard:

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

Later, when the Supabase CLI is configured with an access token and database
password, this same folder can be used as the migration source.

## Security Notes

- Keep Row Level Security enabled on all application tables.
- Do not paste the service role key into browser code.
- Do not commit `.env.local`.
- Rotate any service role key that has been shared in chat before production.
- Use the service role only for trusted server-side maintenance or admin scripts.
