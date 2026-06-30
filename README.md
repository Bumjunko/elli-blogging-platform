# ELLI Student Blogging Platform

Planning package and future implementation workspace for the ELLI Student
Blogging Platform, a moderated student blogging system for the English Language
Learners' Institute (ELLI) under the Center for International Studies (CIS) at
Angelo State University.

Last reviewed: June 30, 2026

## Current Status

This folder is now initialized as the project root for the ELLI Student Blogging
Platform. The initial Next.js web application has been created, and the first
Supabase foundation files have been added.

Root cleanup has been completed:

- Git has been initialized in this directory.
- A root `.gitignore` has been added.
- Proposal files have been moved into `docs/proposal/`.
- `README.md` remains at the project root as the main orientation file.
- A Next.js application has been created in `web/`.
- The initial Next.js app passes `npm run lint`.
- The initial Next.js app passes `npm run build`.
- The initial Next.js app starts locally with `npm run dev`.
- `http://localhost:3000` returns `200 OK` while the dev server is running.
- The generated Next.js app has been committed.
- Supabase packages have been installed in `web/`.
- Root and web `.env.example` files have been added.
- `web/.env.local` has been created locally with the Supabase project URL and
  publishable key only.
- Supabase browser/server helper clients have been added under
  `web/src/lib/supabase/`.
- The first Supabase migration has been drafted under `supabase/migrations/`.
- Supabase setup notes have been added under `supabase/README.md`.
- Supabase CLI has been initialized under `supabase/config.toml`.
- Supabase CLI login and `supabase link` have been completed for project
  `nohzklegahxyakthvosg`.
- The initial Supabase migration has been applied to the remote Supabase
  database.
- Remote verification confirms the four application tables have RLS enabled and
  the `post-images` bucket exists as a private 5 MB bucket.
- The Next.js home page has been replaced with an ELLI-oriented app entry
  screen.
- Supabase Auth signup, login, logout, and callback handling have been added.
- Signup confirmation and invalid-login messages have been clarified.
- `/dashboard` is now protected and redirects signed-out visitors to `/login`.
- `/dashboard/posts/new` has been added for draft creation, featured image
  upload, alt text, and submit-for-review.
- `/dashboard/posts/[postId]/edit` has been added so students can edit their
  own draft or revision-requested posts before submitting them again.
- `/admin` has been added as a protected admin-only route. Signed-out visitors
  are redirected to login, and non-admin users are redirected back to the
  dashboard.
- The student dashboard now shows an `Admin review` link only when the signed-in
  profile has the `admin` role.
- `/admin` now shows review queue counts and a list of review-ready posts with
  author, status, submitted date, image, alt text, and consent indicators.
- `/admin/posts/[postId]` now shows the full review detail view, including
  content, author, featured image, alt text, consent checklist, dates, admin
  note, and status history.
- `/admin/posts/[postId]` now supports request revision, approve, reject, and
  publish actions with confirmation, admin notes, status updates, and status
  history logging.
- Status history logging now covers draft creation, first submission,
  revision resubmission, admin revision requests, approval, rejection, and
  publication. Students can see status history on their edit/status page, and
  admins can see it on the review detail page.
- `/blog` now shows the public student blog list for approved and published
  posts only.
- `/blog/[slug]` now shows public post detail pages and returns 404 for posts
  that are not approved and published.
- A repeatable `npm test` script has been added in `web/package.json`; it runs
  ESLint and a production Next.js build.
- Testing on June 30, 2026 confirms `npm test`, `git diff --check`, and the
  main local route smoke tests pass.

This is now an application codebase foundation, but not yet the ELLI blogging
MVP. The Supabase database foundation, first authentication slice, dashboard
shell, new-post draft/submission flow, draft edit flow, featured image upload
with alt text, admin access guard, admin dashboard list, admin review
detail/actions, status history logging, public blog list/detail pages, and
basic automated verification now exist. Deployment configuration is not
implemented yet.

The next development step is to test the full workflow with real student and
admin accounts, then write setup/handoff documentation and prepare deployment.

## Current Root Layout

| File | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `README.md` | Markdown | Project orientation and start guide | Main project overview and development plan. |
| `.node-version` | Node version marker | Records the Node version used for the initial app setup | `v24.16.0`. |
| `.gitignore` | Git ignore rules | Prevents local/generated files from being committed | Includes `.DS_Store`, `node_modules/`, `.next/`, `.env.local`, logs, and build output. |
| `.env.example` | Environment template | Documents required environment variables | Safe to commit; contains placeholders only. |
| `docs/proposal/Proposal.docx` | Word document | Master proposal and technical development plan | Most detailed source. Word metadata reports 49 pages and 8,412 words. |
| `docs/proposal/ELLI Blogging Platform Proposal.pdf` | PDF | Proposal/export copy | 8-page PDF export. Likely intended for sharing or submission. |
| `docs/proposal/Proposal & Project Design.pdf` | PDF | Proposal/project design export | 8-page PDF export. Likely another shareable version. |
| `web/package.json` | npm package manifest | Next.js app dependency and script definition | Includes `dev`, `build`, `start`, `lint`, and `test`; `test` runs lint plus production build. |
| `web/src/app/` | Next.js App Router source | Home, public blog list/detail, signup, login, auth callback, dashboard, protected admin shell, new/edit post flow, admin review flow, layout, global styles, and favicon | Auth, post submission, draft edit, featured-image upload, admin guard, admin review actions, status history UI, and public blog pages are implemented. |
| `web/src/lib/posts/` | Post workflow helpers | Shared post status history helper | Used by student and admin server actions to keep workflow logging consistent. |
| `web/src/lib/supabase/` | Supabase client helpers | Browser and server client factories | Uses publishable key and cookie-aware SSR client setup. |
| `web/.env.example` | Web environment template | Documents variables needed by the Next.js app | Safe to commit; real local values stay in ignored `web/.env.local`. |
| `web/package-lock.json` | npm lockfile | Reproducible dependency install record | Should be committed. |
| `supabase/.gitignore` | Supabase local ignore rules | Prevents local Supabase temp files and env files from being committed | Created by `supabase init`. |
| `supabase/config.toml` | Supabase CLI config | Local Supabase CLI configuration | Created by `supabase init`; linked to the hosted project; configured for local Next.js on port 3000. |
| `supabase/README.md` | Supabase setup guide | Explains CLI status, linked migration verification, and secret handling | Includes security reminders. |
| `supabase/migrations/20260612143000_initial_schema.sql` | SQL migration | Creates initial tables, RLS policies, auth trigger, and storage bucket | Applied to the remote Supabase database on June 12, 2026. |
| `supabase/migrations/20260629120000_allow_student_status_history_logging.sql` | SQL migration | Allows students to insert controlled status history records for their own draft/submission flow | Needed so student draft creation and submission events can be logged under RLS. |
| `supabase/seed.sql` | Supabase seed file | Placeholder for future demo seed data | Keeps local `supabase db reset` seed path stable. |
| `.DS_Store` | macOS metadata | Finder-generated file | Not part of the project. Should usually be ignored by Git. |

Important file checks from the local folder:

- `docs/proposal/Proposal.docx` was created by Bumjun Ko and last modified by
  Bumjun Ko.
- `docs/proposal/Proposal.docx` was created on 2026-06-02 and modified on
  2026-06-08.
- `docs/proposal/Proposal.docx` contains no tracked insertions, tracked
  deletions, or Word comments.
- The initial planning workspace commit has been made.
- The Next.js app has been generated and committed in
  `705ec87 Create Next.js web app`.
- The README was updated with Next.js setup progress in
  `0497923 Update README with Next.js setup progress`.
- Supabase foundation files were committed in
  `ad24684 Add Supabase foundation`.
- Supabase CLI setup and remote migration application were committed in
  `56337e0 Apply Supabase migration via CLI`.
- Linked Supabase CLI status was documented in
  `455baa8 Document linked Supabase CLI setup`.
- Supabase Auth signup/login/dashboard wiring was committed in
  `0deea4c Add Supabase auth flow`.
- Signup and login user-facing message updates were committed in
  `46fe2d6 Clarify signup confirmation message` and
  `6758782 Improve invalid login message`.
- Student text-post draft/submission flow was committed in
  `7e52e57 Add student post creation flow`.
- Node.js was not available on the original PATH, so Node `v24.16.0` was
  downloaded locally for setup and recorded in `.node-version`.

## Project Summary

The ELLI Student Blogging Platform is a proposed full-stack web application that
allows ELLI students to write and submit blog posts about English learning,
cultural activities, trips, campus life, and program-related experiences.

The platform is not meant to be an unrestricted public blog. It is a moderated
publishing system:

1. A student creates an account.
2. The student accepts required privacy/platform consent.
3. The student creates a blog post.
4. The student uploads one featured image.
5. The student accepts photo-use and public-posting consent for that submission.
6. CIS Staff reviews the submission.
7. CIS Staff approves, rejects, requests revision, archives, or publishes.
8. Public visitors can view only posts that are approved and published.

The MVP should prove that this complete workflow works securely and clearly.

## Project Ownership And Stakeholders

| Role | Person or Group | Responsibility |
| --- | --- | --- |
| Project Owner | Center for International Studies (CIS) | Long-term ownership, policy, content review, administrative use. |
| Initial Developer | Bumjun Ko | Build MVP, document setup, prepare handoff. |
| Academic Advisor | Dr. Erdogan Dogdu | Academic review and Senior Design guidance. |
| Administrative Users | CIS Staff | Review, approve, reject, publish, archive, and manage submissions. |
| Student Users | ELLI participants with valid `@angelo.edu` email addresses | Register, write, submit, track status, and request deletion. |
| Public Users | Visitors to the public blog | View approved and published posts only. |
| Future Review Partner | ASU IT/Web Services | Review production hosting, security, accessibility, domain, and integration. |

## MVP Goal

Deliver a complete, working, secure, documented, and demonstrable MVP by
July 3, 2026.

The MVP should support the following end-to-end path:

Student signup -> student login -> student dashboard -> create post -> upload
featured image -> accept submission consent -> submit for review -> admin review
-> approve -> publish -> public blog page displays the post.

The MVP does not need to be a full CMS. It should be small, reliable, and easy
to explain during a Senior Design demo.

## Proposed Technology Stack

The proposal recommends the following stack:

| Layer | Technology | Reason |
| --- | --- | --- |
| Full-stack framework | Next.js | React framework with routing, server/client rendering, API/server actions, and deployment support. |
| Language | TypeScript | Better maintainability and fewer runtime mistakes. |
| Styling | Tailwind CSS | Fast responsive UI development with consistent utility classes. |
| Database | Supabase PostgreSQL | Managed Postgres database with auth, APIs, storage, and policies. |
| Authentication | Supabase Auth | Avoid direct password storage in the app database. |
| File storage | Supabase Storage | Store featured images for blog posts. |
| Authorization | Supabase Row Level Security (RLS) plus app-level route checks | Enforce row access in the database, not only in UI code. |
| Deployment | Vercel plus Supabase | Fast prototype deployment for Next.js and managed backend services. |
| Version control | GitHub | Source code, migrations, documentation, and handoff history. |

Before production use, current pricing, ASU hosting options, ASU domain rules,
SSO feasibility, accessibility requirements, and institutional privacy review
should be verified with the relevant ASU/CIS stakeholders.

## What Next.js Does In This Project

Next.js is the main web application framework for this project. React is the UI
library used to build components, while Next.js provides the application
structure needed to turn those components into a real deployable web app.

In this project, Next.js is responsible for:

- Page routing: mapping files under `web/src/app/` to URLs such as `/`,
  `/login`, `/dashboard`, `/admin`, and `/blog/[slug]`.
- Layout structure: defining shared page shells through `layout.tsx`.
- Public pages: rendering the public home page, blog list, and blog detail
  pages.
- Student pages: rendering signup, login, dashboard, create/edit post, and
  submission-status pages.
- Admin pages: rendering staff-only review dashboards and post review pages.
- Server-side logic: safely running code that should not live only in the
  browser, such as role checks, protected data reads, and future Supabase server
  operations.
- Client-side interactivity: supporting forms, image previews, checkbox state,
  filters, confirmation prompts, and other browser interactions.
- Build output: producing optimized production assets with `npm run build`.
- Deployment readiness: preparing the app for Vercel or another Next.js-capable
  hosting platform.

Next.js does not replace Supabase. The planned division of responsibility is:

| Area | Responsible Tool |
| --- | --- |
| Page routing and UI | Next.js |
| React components | React inside Next.js |
| Styling | Tailwind CSS |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| File storage | Supabase Storage |
| Row-level data protection | Supabase RLS |
| Hosting prototype | Vercel plus Supabase |

For the ELLI Blogging Platform, this means Next.js is the visible application
layer and Supabase is the backend data/auth/storage layer. Both are needed:
Next.js can hide or redirect pages based on role, but Supabase RLS must still
enforce the final data-access rules.

## Recommended Repository Structure

This folder is now the project root. The proposal documents are already stored
under `docs/proposal/`. The recommended next structure is to place the web app,
future setup docs, handoff docs, and Supabase migrations beside that proposal
folder.

Target structure:

```text
ELLI Blogging Platform/
  README.md
  .gitignore
  .node-version
  docs/
    proposal/
      Proposal.docx
      ELLI Blogging Platform Proposal.pdf
      Proposal & Project Design.pdf
    setup/
      local-setup.md
      supabase-setup.md
      vercel-deployment.md
    handoff/
      admin-user-guide.md
      maintenance-guide.md
      security-checklist.md
      accessibility-checklist.md
  web/
    .env.example
    package.json
    package-lock.json
    next.config.ts
    src/
      app/
      components/
      lib/
        supabase/
      types/
  supabase/
    .gitignore
    config.toml
    README.md
    migrations/
      20260612143000_initial_schema.sql
    seed.sql
  .env.example
```

This keeps proposal documents, app source, database migrations, and handoff
documentation separate.

An alternate path is to build the Next.js app directly in this folder. That is
possible, but it is easier to accidentally mix generated app files with proposal
files. The `web/` subfolder approach is safer.

## Where To Start

The project foundation has now been started. Git, `.gitignore`,
`.node-version`, `docs/proposal/`, the initial `web/` Next.js app, Supabase
environment templates, Supabase client helpers, Supabase CLI initialization,
and the first remote database migration are done.

The immediate next starting point is:

1. In Supabase Auth, confirm email confirmation and redirect URL settings.
2. Test signup with a real `@angelo.edu` email.
3. Confirm the email callback lands on `/auth/callback` and then `/dashboard`.
4. Confirm the `profiles` row is created with role `student`.
5. Create a draft from `/dashboard/posts/new`.
6. Submit the draft for review and confirm it appears as `submitted`.
7. Add image upload to the post workflow.
8. Manually assign the first admin role in the `profiles` table.
9. Build the admin review workflow.
10. Build the public blog pages.

This order matters because every later feature depends on user identity,
authorization, and database access rules.

### Step 1: Initialize The Project Root

Completed:

- Git repository initialized.
- `.gitignore` added.
- Proposal documents moved into `docs/proposal/`.

The root `.gitignore` currently includes:

```gitignore
.DS_Store
node_modules/
.next/
out/
dist/
.env
.env.local
.env.*.local
.vercel/
coverage/
*.log
```

First commit completed:

```text
bdb9743 Initialize ELLI Blogging Platform planning workspace
```

### Step 2: Create The Web App

Completed. The app was created in a `web/` subfolder with:

```bash
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes
```

Selected initial choices:

- Use TypeScript.
- Use the App Router.
- Use Tailwind CSS.
- Use ESLint.
- Use a `src/` directory.
- Use `@/*` as the import alias.
- Use npm.
- Skip nested Git initialization because the project root is already a Git
  repository.

Created app baseline:

- Next.js `16.2.9`
- React `19.2.4`
- Tailwind CSS `4`
- TypeScript `5`
- ESLint `9`
- npm lockfile at `web/package-lock.json`

Verification completed:

```bash
cd web
npm run lint
npm run build
npm test
npm run dev
```

Lint, production build, and `npm test` pass. The local development server
starts at `http://localhost:3000`, and `curl -I http://localhost:3000` returns
`200 OK`.

Note: setup used Node.js `v24.16.0`. If `node` and `npm` are not available on
the shell PATH, use the local runtime path that was downloaded during setup:

```bash
PATH=/Users/bko/.local/node/node-v24.16.0-darwin-arm64/bin:$PATH npm run dev
```

Current npm audit note:

- `npm audit` reports 2 moderate findings through Next.js' internal PostCSS
  dependency.
- `npm audit fix --force` is not recommended here because npm proposes a
  breaking downgrade to an old Next.js version.
- Recheck this after the next stable Next.js patch release.

### Step 3: Create Supabase Project And Environment Files

Completed locally. The Supabase project has been created in the Supabase
Dashboard, and the local project now knows how to connect to it.

Created files:

- `.env.example`
- `web/.env.example`
- ignored local file: `web/.env.local`

Environment variable names:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- Commit `.env.example`.
- Never commit `.env.local`.
- Use the publishable key in browser-safe code.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Use service role only in trusted server-side scripts or protected admin flows,
  and only when truly needed.
- Rotate any service role key that has been shared outside the Supabase
  Dashboard before production.

Installed packages in `web/`:

- `@supabase/supabase-js`
- `@supabase/ssr`

Added app helpers:

- `web/src/lib/supabase/client.ts`
- `web/src/lib/supabase/server.ts`

### Step 4: Implement The Database Before The UI Gets Large

Completed for the first backend foundation. The first SQL migration is:

```text
supabase/migrations/20260612143000_initial_schema.sql
```

This migration creates the smallest schema that supports the core workflow.

Initial tables:

1. `profiles`
2. `posts`
3. `post_status_history`
4. `deletion_requests`

The migration also adds:

- `post_review_status` enum.
- `updated_at` triggers.
- `handle_new_user()` trigger for Supabase Auth profile creation.
- `@angelo.edu` registration enforcement at the database trigger level.
- `is_admin()` helper for RLS checks.
- RLS policies for public, student, and admin access.
- Private `post-images` storage bucket.
- Storage policies for student-owned uploads, admin access, and public reads of
  approved/published post images.

This migration has been written to the repository and applied to the remote
Supabase database through the Supabase CLI using the session pooler. Direct IPv6
database access was not available from this machine, so the pooler connection
was used.

Remote verification completed:

- `supabase db push --linked --dry-run` reports that the remote database is up
  to date.
- The public Data API returns `200 OK` for `/rest/v1/posts?select=id&limit=1`.
- `profiles`, `posts`, `post_status_history`, and `deletion_requests` exist
  with RLS enabled.
- The `post-images` bucket exists, is private, and has a 5 MB file size limit.

CLI note: `supabase init`, `supabase login`, and `supabase link` are complete.
Linked-project CLI commands can now be run from the project root.

### Step 5: Implement Authentication And Profiles

Build this before post creation:

- Signup page
- Login page
- Logout action
- Password reset if time allows
- `@angelo.edu` email validation
- Profile creation after signup
- Default role of `student`
- Manual role assignment for `admin`

Important: `@angelo.edu` should not be enforced only in the browser. Browser
validation is helpful for user experience, but server-side validation and/or
Supabase-side controls are needed before production.

### Step 6: Enable RLS Early

Do not wait until the end to enable Row Level Security.

RLS should be enabled early and tested with:

- Anonymous public visitor
- Student A
- Student B
- Admin user

The minimum security expectation is:

- Students can read and edit only their own posts.
- Students cannot approve posts.
- Students cannot publish posts.
- Students cannot edit another student's posts.
- Admins can review and manage all posts.
- Public users can read only posts where `review_status = 'approved'` and
  `is_published = true`.

### Step 7: Build The Student Workflow

Once auth works:

1. Student dashboard
2. Create post page
3. Edit draft page
4. Featured image upload
5. Image preview
6. Alt text field
7. Photo-use consent checkbox
8. Public-posting consent checkbox
9. Submit for review action
10. Status badge on dashboard

The student workflow is the best first product milestone because it creates the
data that the admin workflow needs.

### Step 8: Build The Admin Workflow

After students can submit posts:

1. Admin-only dashboard
2. Submitted post list
3. Status filter if time allows
4. Review detail page
5. Consent indicators
6. Featured image preview
7. Admin note field
8. Request revision
9. Approve
10. Publish
11. Reject
12. Archive

Do not allow accidental one-click destructive actions. Publishing, rejection,
archive, and deletion-related actions should use confirmation prompts.

### Step 9: Build The Public Blog

Build public pages after admin publish works:

- Public blog list page
- Public blog detail page
- Responsive layout
- Featured image
- Title
- Excerpt
- Author display name if approved by policy
- Publication date

The public query must show only approved and published posts.

## MVP Feature Scope

### Must Have

- Student registration
- Student login/logout
- `@angelo.edu` email restriction
- Privacy/platform consent at signup
- Student dashboard
- Create/edit post
- Submit post for review
- One featured image per post
- Image file type validation
- Image size validation
- Image alt text
- Photo-use consent per submission
- Public-posting consent per submission
- Admin dashboard
- Admin review page
- Request revision
- Approve
- Publish
- Reject
- Archive
- Public blog list
- Public blog detail
- Role-based route protection
- Supabase RLS policies
- Basic responsive design
- README and handoff documentation

### Should Have

- Status history table
- Admin notes visible to students when revision is requested
- Deletion request workflow
- Basic status filters in admin dashboard
- Password reset
- Seed data for demo
- Security checklist
- Accessibility checklist

### Out Of Scope For Summer I MVP

- ASU SSO
- Comments
- Likes or reactions
- Multiple image galleries
- Rich text editor
- Email notifications
- AI writing assistant
- Automatic translation
- Advanced analytics
- Full CMS replacement
- Complex multi-level admin roles
- Full version history
- Official ASU domain deployment without institutional review

## User Roles

### Public Visitor

Can:

- View the public homepage.
- View the public blog list.
- View public blog detail pages.
- View only approved and published posts.

Cannot:

- Register from the public blog area.
- Submit posts.
- Comment.
- See student dashboard pages.
- See admin pages.
- See draft, submitted, revision, rejected, or archived posts.

### Student

Can:

- Register with a valid `@angelo.edu` email.
- Log in and log out.
- Accept privacy/platform consent.
- Create blog drafts.
- Upload one featured image.
- Add image alt text.
- Accept submission-specific consent.
- Submit posts for review.
- View their own posts and statuses.
- Edit posts according to review workflow rules.
- Request deletion of a published post if that feature is implemented.

Cannot:

- See other students' private posts.
- Access admin pages.
- Approve posts.
- Publish posts.
- Assign themselves admin role.

### Admin

Can:

- Log in securely.
- Access admin dashboard.
- View all submitted posts.
- Review post content and images.
- Check consent status.
- Add admin notes.
- Request revision.
- Approve.
- Publish.
- Reject.
- Archive.
- Respond to deletion requests.

Should:

- Review image appropriateness before publication.
- Confirm consent indicators before publication.
- Avoid publishing sensitive information.
- Follow CIS content policy.

## Proposed Data Model

### `profiles`

Purpose: Store application-level user profile data connected to Supabase Auth.

Initial migration fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | References Supabase Auth user ID. |
| `email` | `text` | User email. Should be `@angelo.edu` for students. |
| `full_name` | `text` | User display name. |
| `role` | `text` | `student` or `admin`. |
| `privacy_consent_accepted` | `boolean` | Signup consent accepted. |
| `privacy_consent_at` | `timestamptz` | Consent timestamp. |
| `privacy_consent_version` | `text` | Version of consent language. |
| `created_at` | `timestamptz` | Creation timestamp. |
| `updated_at` | `timestamptz` | Last update timestamp. |

Important policy:

- Students can read and update limited parts of their own profile.
- Admins can read all profiles.
- Students cannot update their own role.
- Only admin/service-controlled logic can assign admin roles.

### `posts`

Purpose: Store blog post content, image reference, consent, review state, and
publication state.

Initial migration fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Post ID. |
| `author_id` | `uuid` | References `profiles.id`. |
| `title` | `text` | Post title. |
| `slug` | `text` | URL-friendly identifier. |
| `excerpt` | `text` | Optional short summary, limited to 220 characters. |
| `content` | `text` | Main blog content. |
| `featured_image_path` | `text` | Supabase Storage path. |
| `featured_image_alt` | `text` | Accessibility text, limited to 180 characters. |
| `review_status` | `post_review_status` | Draft/submitted/revision requested/approved/rejected/archived. |
| `is_published` | `boolean` | Public visibility flag. |
| `submitted_at` | `timestamptz` | Submission timestamp. |
| `reviewed_at` | `timestamptz` | Review timestamp. |
| `published_at` | `timestamptz` | Publication timestamp. |
| `admin_note` | `text` | Staff note for revision/rejection. |
| `photo_consent_accepted` | `boolean` | Photo-use consent. |
| `public_posting_consent_accepted` | `boolean` | Public-posting consent. |
| `created_at` | `timestamptz` | Creation timestamp. |
| `updated_at` | `timestamptz` | Last update timestamp. |

Recommended constraints:

- `is_published = true` should be allowed only when `review_status = 'approved'`.
- Posts cannot be submitted unless required consent is accepted.
- Public reads should require both `review_status = 'approved'` and
  `is_published = true`.

### `post_status_history`

Purpose: Track status and publication changes for accountability.

Initial migration fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | History record ID. |
| `post_id` | `uuid` | Related post. |
| `changed_by` | `uuid` | User who changed status. |
| `from_status` | `post_review_status` | Old review status. |
| `to_status` | `post_review_status` | New review status. |
| `note` | `text` | Optional note. |
| `created_at` | `timestamptz` | Change timestamp. |

This table is very useful for explaining administrative accountability during
the final demo.

Current implementation:

- Draft creation records `null -> draft`.
- First submission records `draft -> submitted`.
- Revision edits saved by a student record `revision_requested -> draft`.
- Revision resubmission records `revision_requested -> submitted`.
- Admin request-revision records `submitted -> revision_requested`.
- Admin approval records `submitted -> approved`.
- Admin rejection records `submitted -> rejected`.
- Admin publication records an approved publication event with the current
  `approved` status and a publication note.
- Students can read history for their own posts.
- Admins can read all post history.
- A second migration allows students to insert only the controlled history rows
  needed for their own draft and submission workflow.

### `deletion_requests`

Purpose: Allow students to request removal of published posts.

Initial migration fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Request ID. |
| `post_id` | `uuid` | Related post. |
| `requested_by` | `uuid` | Student requesting deletion. |
| `reason` | `text` | Student-provided reason. |
| `status` | `text` | Pending/approved/denied/completed. |
| `admin_response` | `text` | Admin response. |
| `reviewed_by` | `uuid` | Admin who reviewed request. |
| `reviewed_at` | `timestamptz` | Review timestamp. |
| `created_at` | `timestamptz` | Request timestamp. |
| `updated_at` | `timestamptz` | Last update timestamp. |

If time is short, implement this after the main submission/review/publish
workflow.

## Review And Publishing Workflow

Recommended statuses:

| Status | Meaning | Publicly visible |
| --- | --- | --- |
| `draft` | Student is still writing. | No |
| `submitted` | Student submitted for review. | No |
| `revision_requested` | Admin requested changes. | No |
| `approved` | Content approved by admin. | No by itself |
| `rejected` | Content rejected. | No |
| `archived` | Removed from active workflow. | No |

Publication should be a separate boolean:

```text
review_status = 'approved'
is_published = true
```

Only when both conditions are true should a post appear on public pages.

## Storage Design

Recommended bucket:

```text
post-images
```

Recommended path format:

```text
post-images/{user_id}/{post_id}/featured-{timestamp}.{extension}
```

Supported MVP file formats:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

Recommended MVP file size limit:

- 5 MB per image

Production preference:

- Use a private bucket.
- Allow students to access their own images.
- Allow admins to access all images.
- Allow public display only for approved and published posts.

Simplified prototype option:

- Use hard-to-guess paths.
- Do not expose URLs until publication.
- Document that stricter private-bucket policies must be reviewed before real
  production use.

## Security Requirements

Security is not a final polish task. It must shape the first database and auth
work.

Minimum requirements:

- No plaintext password storage.
- Use Supabase Auth.
- Restrict student signup to `@angelo.edu`.
- Default new users to `student`.
- Assign `admin` manually.
- Protect admin routes in the application.
- Enforce access with RLS in the database.
- Never expose service role key in browser code.
- Keep `.env.local` out of Git.
- Validate title, content, image type, image size, and consent fields.
- Avoid raw HTML rendering.
- Avoid `dangerouslySetInnerHTML` for student content.
- If rich text is added later, sanitize HTML carefully.

## Privacy And Consent Requirements

Consent is a core feature, not an optional checkbox.

Required consent moments:

1. Signup privacy/platform-use consent.
2. Per-submission photo-use consent.
3. Per-submission public-posting consent.

Students should be warned not to upload:

- Student IDs
- Passports
- Driver's licenses
- Addresses
- Phone numbers
- Private documents
- Images of people who have not consented to public posting
- Sensitive academic, medical, immigration, or financial details

Before real production use, CIS and/or ASU should review privacy, media release,
FERPA, accessibility, retention, and hosting requirements.

## Accessibility Requirements

Minimum MVP expectations:

- Every form input has a label.
- Required fields are clearly marked.
- Error messages explain what went wrong.
- Buttons are keyboard accessible.
- Links have meaningful text.
- Images have alt text.
- Admin review includes alt text visibility.
- Color is not the only way to communicate status.
- Heading order is logical.
- Mobile layout works.

## Suggested Implementation Milestones

### Milestone 0: Project Foundation

Definition of done:

- Git initialized.
- `.gitignore` added.
- Proposal files moved into `docs/proposal/`.
- Next.js app created in `web/`.
- Local dev server runs.
- First commit exists.

Current progress:

- Done: Git initialized.
- Done: `.gitignore` added.
- Done: Proposal files moved into `docs/proposal/`.
- Done: First planning workspace commit exists.
- Done: Next.js app created in `web/`.
- Done: `npm run lint` passes.
- Done: `npm run build` passes.
- Done: Local dev server starts at `http://localhost:3000`.
- Done: `curl -I http://localhost:3000` returns `200 OK`.
- Done: Next.js app creation has been committed.

### Milestone 1: Supabase Foundation

Definition of done:

- Supabase project created.
- `.env.example` committed.
- `.env.local` created locally but not committed.
- `profiles` table exists.
- `posts` table exists.
- RLS enabled.
- Basic policies drafted.

Current progress:

- Done locally: Supabase project URL and publishable key are in ignored
  `web/.env.local`.
- Done locally: root and web `.env.example` files exist.
- Done locally: `@supabase/supabase-js` and `@supabase/ssr` are installed.
- Done locally: browser/server Supabase client helpers exist.
- Done locally: Supabase CLI has been initialized with `supabase/config.toml`.
- Done locally: Supabase CLI login and `supabase link` are complete.
- Done locally: initial SQL migration has been drafted and committed.
- Done remotely: initial SQL migration has been applied to Supabase.
- Done remotely: remote database is up to date according to `supabase db push
  --linked --dry-run`.
- Done remotely: the four application tables have RLS enabled.
- Done remotely: the `post-images` bucket exists as a private 5 MB bucket.

### Milestone 2: Authentication

Definition of done:

- Student signup works.
- Login works.
- Logout works.
- Profile is created after signup.
- New users default to `student`.
- Non-`@angelo.edu` emails are blocked.
- Admin role can be assigned manually.

Current progress:

- Done in code: `/signup` page exists.
- Done in code: `/login` page exists.
- Done in code: `/auth/callback` exchanges Supabase email/session codes.
- Done in code: logout server action exists.
- Done in code: signup sends full name and privacy consent metadata to
  Supabase Auth.
- Done in code: signup validates `@angelo.edu` before calling Supabase.
- Done in code: `/dashboard` requires a logged-in Supabase session.
- Done in code: dashboard reads the signed-in user's profile and own posts.
- Pending manual Supabase Dashboard check: Auth URL and redirect URL settings.
- Pending manual test: create and confirm a real `@angelo.edu` account.
- Pending manual setup: assign the first admin role in `profiles`.

### Milestone 3: Student Submission Workflow

Definition of done:

- Student dashboard exists.
- Student can create a draft.
- Student can edit their own draft.
- Student can upload one featured image.
- Student must add alt text.
- Student must accept photo/publication consent before submission.
- Student can submit for review.
- Student can see status.

Current progress:

- Done in code: dashboard has an active `New post` link.
- Done in code: `/dashboard/posts/new` page exists and is protected.
- Done in code: students can save a text draft.
- Done in code: students can submit a post for review.
- Done in code: submit-for-review requires photo and public-posting consent
  checkboxes.
- Done in code: dashboard lists the signed-in student's posts and statuses.
- Done in code: students can edit their own draft or revision-requested posts
  from `/dashboard/posts/[postId]/edit`.
- Done in code: students can upload one JPG, PNG, or WebP featured image to the
  private `post-images` Supabase Storage bucket.
- Done in code: submit-for-review requires both a featured image and image alt
  text.

### Milestone 4: Admin Review Workflow

Definition of done:

- Admin dashboard exists.
- Student cannot access admin dashboard.
- Admin can view submitted posts.
- Admin can open review page.
- Admin can see content, image, author, consent, and submitted date.
- Admin can request revision.
- Admin can approve.
- Admin can publish approved posts.
- Admin can reject.
- Admin can archive.
- Admin and student workflow actions update status history.

Current progress:

- Done in code: `/admin` is protected by the signed-in user's `profiles.role`.
- Done in code: signed-out users who visit `/admin` are redirected to
  `/login?next=/admin`.
- Done in code: non-admin users who visit `/admin` are redirected back to the
  student dashboard.
- Done in code: admin users see an `Admin review` link from the dashboard.
- Done in code: `/admin` shows review queue counts.
- Done in code: `/admin` lists review-ready posts with author, status,
  submitted date, image, alt text, and consent indicators.
- Done in code: `/admin/posts/[postId]` shows full post content, featured
  image, alt text, author, consent, submission dates, admin note, and status
  history.
- Done in code: admins can request revision, approve, reject, and publish from
  `/admin/posts/[postId]`.
- Done in code: admin review actions require confirmation and write
  `post_status_history` records.
- Done in code: student draft creation, first submission, revision save, and
  revision resubmission write controlled `post_status_history` records.
- Done in code: students can see status history on
  `/dashboard/posts/[postId]/edit`.
- Done in code: a follow-up Supabase migration permits student-owned status
  history inserts while keeping RLS restrictions narrow.
- Pending manual setup: assign the first real admin role in Supabase
  `profiles`.
- Pending database sync: apply
  `supabase/migrations/20260629120000_allow_student_status_history_logging.sql`
  to the remote Supabase project.
- To apply the pending migration, run this from the project root with the real
  database password supplied only as a local environment variable:

```bash
SUPABASE_DB_PASSWORD="<database-password>" npx -y supabase@latest db push --linked
```

- Pending manual test: perform student submission and admin review actions with
  real accounts.

### Milestone 5: Public Blog

Definition of done:

- Public blog list exists.
- Public detail page exists.
- Only approved and published posts appear publicly.
- Unpublished post URLs are not publicly accessible.
- Public pages work on mobile and desktop.

Current progress:

- Done in code: `/blog` lists only posts where
  `review_status = 'approved'` and `is_published = true`.
- Done in code: `/blog/[slug]` loads only approved and published posts by
  slug.
- Done in code: unpublished, unapproved, or missing post URLs return 404.
- Done in code: public pages use signed URLs for private `post-images` assets
  when a published post has a featured image.
- Done in code: the home page links to the public student blog.
- Pending manual test: publish a real post through the admin workflow and
  confirm it appears on `/blog` and opens at `/blog/[slug]`.

### Milestone 6: Documentation And Demo

Definition of done:

- README is updated.
- Local setup guide exists.
- Supabase setup guide exists.
- Deployment guide exists.
- Admin user guide exists.
- Maintenance handoff guide exists.
- Security checklist exists.
- Accessibility checklist exists.
- Demo script exists.
- Sample data is ready.

Current progress:

- Done in code: `web/package.json` includes `npm test`.
- Done in verification: `npm test` passes.
- Done in verification: `git diff --check` passes.
- Done in verification: local route smoke tests confirm public pages return
  `200`, protected pages redirect signed-out users, and a missing public blog
  slug returns `404`.
- Done in docs: README now records the latest automated and route smoke test
  results.
- Pending manual test: complete a real student signup/login/submission flow
  with a confirmed `@angelo.edu` account.
- Pending manual test: complete a real admin review, approval, publish, and
  public blog visibility flow.
- Pending network check: Supabase REST verification currently returns HTTP
  `000` from this local shell, which means the local environment is not reaching
  the Supabase host during this test run.

## Testing Checklist

Latest verification run: June 30, 2026.

Automated checks:

| Check | Result | Notes |
| --- | --- | --- |
| `npm test` from `web/` | Pass | Runs `npm run lint` and `npm run build`. |
| `npm run lint` from `web/` | Pass | ESLint completes without reported issues. |
| `npm run build` from `web/` | Pass | Next.js production build compiles all current routes. |
| `git diff --check` from project root | Pass | No whitespace errors in the current diff. |

Local route smoke tests:

These were run against the local development server at
`http://localhost:3000`.

| Route | Expected | Result |
| --- | --- | --- |
| `/` | Homepage loads | `200` |
| `/signup` | Signup page loads | `200` |
| `/login` | Login page loads | `200` |
| `/dashboard` | Signed-out user redirects to login | `307` to `/login?next=/dashboard` |
| `/admin` | Signed-out user redirects to login | `307` to `/login?next=%2Fadmin` |
| `/blog` | Public blog list loads | `200` |
| `/blog/nonexistent-test-slug` | Missing public post returns not found | `404` |

Command used:

```bash
for path in / /signup /login /dashboard /admin /blog /blog/nonexistent-test-slug; do
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  printf "%s %s\n" "$path" "$code"
done
```

Supabase connectivity check:

| Check | Result | Notes |
| --- | --- | --- |
| Public REST request to `/rest/v1/posts?select=id&limit=1` | Blocked in current shell | Returned HTTP `000`, indicating the local test environment could not reach the Supabase host during this run. |

Manual student tests still required:

- [ ] Student can register with `@angelo.edu`.
- [ ] Student cannot register with a non-`@angelo.edu` email.
- [ ] Student can confirm the account through the email inbox.
- [ ] Student can log in.
- [ ] Student can log out.
- [ ] Student can accept privacy consent.
- [ ] Student can create a draft.
- [ ] Student can upload a featured image and alt text.
- [ ] Student can submit a post.
- [ ] Student cannot submit without required fields.
- [ ] Student cannot submit without consent.
- [ ] Student can see their own posts.
- [ ] Student can see status history for their own post.
- [ ] Student cannot see another student's private posts.

Manual admin tests still required:

- [ ] Admin can log in.
- [ ] Admin can access admin dashboard.
- [ ] Student cannot access admin dashboard.
- [ ] Admin can view submitted posts.
- [ ] Admin can open post review page.
- [ ] Admin can request revision.
- [ ] Admin can approve.
- [ ] Admin can publish an approved post.
- [ ] Admin cannot publish a rejected post.
- [ ] Admin can reject.
- [ ] Admin note appears to student when revision is requested.
- [ ] Admin and student actions create status history records.

Manual public tests still required:

- [x] Public visitor can view homepage.
- [x] Public visitor can view blog list route.
- [ ] Public visitor can view a real published post.
- [ ] Public visitor cannot view a real submitted post by URL.
- [ ] Public visitor cannot view a real rejected post by URL.
- [x] Public visitor cannot access student dashboard while signed out.
- [x] Public visitor cannot access admin page while signed out.

Security checks:

- [x] Unauthenticated user cannot access dashboard.
- [x] Unauthenticated user cannot access admin route.
- [x] Service role key is not used in browser code.
- [ ] Student cannot access admin route after login.
- [ ] Student cannot publish post.
- [ ] Student cannot update another student's post.
- [ ] Public user cannot query private posts.
- [ ] Environment variables are not exposed in client bundles beyond intended
  `NEXT_PUBLIC_*` values.
- [ ] RLS policies are active after the latest status-history migration is
  applied remotely.

Accessibility checks:

- [x] Main forms use visible labels.
- [x] Buttons and links use keyboard-accessible native elements.
- [x] Image upload flow requires alt text before submission.
- [x] Error messages are visible and readable.
- [ ] Full mobile layout pass on a real browser.
- [ ] Full keyboard navigation pass.
- [ ] Screen reader spot check.
- [ ] Status badges are understandable without relying only on color.

## Timeline Context

The proposal defines the development period as June 2, 2026 to July 3, 2026.

Planned phases:

| Phase | Dates | Goal |
| --- | --- | --- |
| Phase 1 | June 2 - June 7 | Proposal, planning, project setup. |
| Phase 2 | June 8 - June 14 | Student blog submission workflow. |
| Phase 3 | June 15 - June 21 | Admin review and public publishing. |
| Phase 4 | June 22 - June 27 | Policy, security, accessibility, documentation. |
| Phase 5 | June 28 - July 3 | Final polish, report, demo, submission. |

As of June 15, 2026, the project is entering Phase 3. The project root has been
initialized, proposal files have been organized, the initial Next.js app has
been generated and committed in `web/`, the Supabase foundation has been
prepared and applied to the remote database, authentication is implemented, and
the first text-only student draft/submission workflow exists. The practical next
step is to test the flow end to end with a confirmed `@angelo.edu` account, add
image upload, and then begin the admin review workflow.

## Recommended Immediate Task List

Start here:

1. [x] Create `.gitignore`.
2. [x] Initialize Git.
3. [x] Move proposal files into `docs/proposal/`.
4. [x] Commit the planning baseline.
5. [x] Create `web/` with Next.js, TypeScript, Tailwind, and App Router.
6. [x] Confirm `npm run dev` works.
7. [x] Confirm `npm run lint` works.
8. [x] Confirm `npm run build` works.
9. [x] Commit the generated Next.js app.
10. [x] Create Supabase project.
11. [x] Add `.env.example`.
12. [x] Add local `web/.env.local` with public Supabase values.
13. [x] Install Supabase client packages.
14. [x] Add Supabase browser/server client helpers.
15. [x] Create initial `profiles`, `posts`, status history, and deletion request migration.
16. [x] Draft RLS and storage policies in the migration.
17. [x] Apply the migration to the remote Supabase database.
18. [x] Confirm remote tables, RLS policies, Data API access, and storage bucket.
19. [ ] Configure Supabase Auth redirect URLs.
20. [x] Implement signup/login/logout.
21. [x] Implement role loading.
22. [x] Implement student dashboard shell.
23. [x] Implement create post form.
24. [x] Implement submit for review.
25. [x] Implement edit existing draft form.
26. [x] Implement featured image upload and alt text.
27. [x] Implement admin role/access guard.
28. [x] Implement admin dashboard.
29. [x] Implement admin review detail page.
30. [x] Implement approve/publish flow.
31. [x] Implement status history logging.
32. [x] Implement public blog pages.
33. [x] Run testing and update README.
34. [ ] Write setup and handoff docs.
35. [ ] Prepare final demo.

The most important first coding milestone is not the homepage. It is:

```text
A student can sign up, log in, create a draft, and submit it for review.
```

This is now implemented in code for posts with one featured image and alt text,
including editing draft or revision-requested posts before resubmission. It
still needs manual end-to-end testing with a real confirmed `@angelo.edu`
account. The next feature step is the admin submitted-post review list.

## Production Readiness Notes

The MVP can be demonstrated with Vercel and Supabase, but real production use
should wait until CIS/ASU review confirms:

- Hosting responsibility
- Domain/subdomain plan
- Privacy review
- FERPA/media release considerations
- Accessibility requirements
- Backup and retention policy
- Admin ownership
- Long-term maintenance owner
- Cost approval
- Whether ASU SSO is required

## Known Risks

| Risk | Why It Matters | Mitigation |
| --- | --- | --- |
| Scope creep | Extra features could prevent MVP completion. | Keep comments, SSO, rich text, analytics, and email notifications out of MVP. |
| RLS misconfiguration | Could expose private student content. | Enable RLS early and test each role separately. |
| Image privacy | Uploaded images may contain sensitive information or people without consent. | Require consent, show warnings, and require admin review before publication. |
| Service role leakage | Would create serious backend security risk. | Never expose service role key to browser code. |
| Timeline compression | The app foundation exists, but core workflows are not implemented yet. | Build vertical slices and avoid non-MVP features. |
| Future maintenance | CIS may need to maintain the app after the initial developer leaves. | Keep documentation, migrations, and handoff guides current. |

## Final Demo Target

The final demonstration should show:

1. Student registration with an `@angelo.edu` email.
2. Student login.
3. Student dashboard.
4. Student creates a post.
5. Student uploads one image and adds alt text.
6. Student accepts consent and submits.
7. Admin logs in.
8. Admin reviews submission.
9. Admin approves and publishes.
10. Public blog page shows the published post.
11. Public visitor cannot access unpublished content.
12. Student cannot access admin pages.

If these twelve steps work reliably, the project will have a strong MVP story.
