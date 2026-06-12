# ELLI Student Blogging Platform

Planning package and future implementation workspace for the ELLI Student
Blogging Platform, a moderated student blogging system for the English Language
Learners' Institute (ELLI) under the Center for International Studies (CIS) at
Angelo State University.

Last reviewed: June 12, 2026

## Current Status

This folder is now initialized as the project root for the ELLI Student Blogging
Platform.

Root cleanup has been completed:

- Git has been initialized in this directory.
- A root `.gitignore` has been added.
- Proposal files have been moved into `docs/proposal/`.
- `README.md` remains at the project root as the main orientation file.
- A Next.js application has been created in `web/`.
- The initial Next.js app passes `npm run lint`.
- The initial Next.js app passes `npm run build`.

This is now an application codebase foundation, but not yet the ELLI blogging
MVP. There is no Supabase project configuration, database migration folder,
authentication flow, student dashboard, admin workflow, or deployment
configuration yet.

The next development step is to start the local Next.js development server,
commit the generated `web/` app, then create the Supabase foundation described
in `docs/proposal/Proposal.docx`.

## Current Root Layout

| File | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `README.md` | Markdown | Project orientation and start guide | Main project overview and development plan. |
| `.node-version` | Node version marker | Records the Node version used for the initial app setup | `v24.16.0`. |
| `.gitignore` | Git ignore rules | Prevents local/generated files from being committed | Includes `.DS_Store`, `node_modules/`, `.next/`, `.env.local`, logs, and build output. |
| `docs/proposal/Proposal.docx` | Word document | Master proposal and technical development plan | Most detailed source. Word metadata reports 49 pages and 8,412 words. |
| `docs/proposal/ELLI Blogging Platform Proposal.pdf` | PDF | Proposal/export copy | 8-page PDF export. Likely intended for sharing or submission. |
| `docs/proposal/Proposal & Project Design.pdf` | PDF | Proposal/project design export | 8-page PDF export. Likely another shareable version. |
| `web/package.json` | npm package manifest | Next.js app dependency and script definition | Created with `create-next-app@16.2.9`. |
| `web/src/app/` | Next.js App Router source | Initial route, layout, global styles, and favicon | Default starter app; not yet customized for ELLI. |
| `web/package-lock.json` | npm lockfile | Reproducible dependency install record | Should be committed. |
| `.DS_Store` | macOS metadata | Finder-generated file | Not part of the project. Should usually be ignored by Git. |

Important file checks from the local folder:

- `docs/proposal/Proposal.docx` was created by Bumjun Ko and last modified by
  Bumjun Ko.
- `docs/proposal/Proposal.docx` was created on 2026-06-02 and modified on
  2026-06-08.
- `docs/proposal/Proposal.docx` contains no tracked insertions, tracked
  deletions, or Word comments.
- The initial planning workspace commit has been made.
- The Next.js app has been generated but has not yet been committed.
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
    package.json
    package-lock.json
    next.config.ts
    src/
      app/
      components/
      lib/
      types/
  supabase/
    migrations/
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
`.node-version`, `docs/proposal/`, and the initial `web/` Next.js app are done.

The immediate next starting point is:

1. Start the local Next.js dev server from `web/`.
2. Confirm the starter page opens at `http://localhost:3000`.
3. Commit the generated Next.js app.
4. Create a Supabase project.
5. Define the first database migration.
6. Implement authentication and profiles before blog features.

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
npm run dev
```

Lint and production build both pass. The local development server starts at
`http://localhost:3000`, and `curl -I http://localhost:3000` returns `200 OK`.

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

Create a Supabase project for the prototype.

Then add a root-level `.env.example` with placeholders:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- Commit `.env.example`.
- Never commit `.env.local`.
- Use the anon key in browser-safe code.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Use service role only in trusted server-side scripts or protected admin flows,
  and only when truly needed.

### Step 4: Implement The Database Before The UI Gets Large

Start with the smallest schema that supports the core workflow.

Recommended initial tables:

1. `profiles`
2. `posts`
3. `post_status_history`
4. `deletion_requests`

For the first working milestone, `profiles` and `posts` are mandatory.
`post_status_history` is strongly recommended because it gives accountability
for admin actions. `deletion_requests` can be added after the core workflow if
time is tight.

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

Recommended fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | References Supabase Auth user ID. |
| `email` | `text` | User email. Should be `@angelo.edu` for students. |
| `full_name` | `text` | User display name. |
| `role` | `text` | `student` or `admin`. |
| `privacy_consent_accepted` | `boolean` | Signup consent accepted. |
| `privacy_consent_at` | `timestamp` | Consent timestamp. |
| `privacy_consent_version` | `text` | Version of consent language. |
| `created_at` | `timestamp` | Creation timestamp. |
| `updated_at` | `timestamp` | Last update timestamp. |

Important policy:

- Students can read and update limited parts of their own profile.
- Admins can read all profiles.
- Students cannot update their own role.
- Only admin/service-controlled logic can assign admin roles.

### `posts`

Purpose: Store blog post content, image reference, consent, review state, and
publication state.

Recommended fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Post ID. |
| `author_id` | `uuid` | References `profiles.id`. |
| `title` | `text` | Post title. |
| `slug` | `text` | URL-friendly identifier. |
| `content` | `text` | Main blog content. |
| `category` | `text` | Optional activity/category. |
| `featured_image_path` | `text` | Supabase Storage path. |
| `image_alt_text` | `text` | Accessibility text. |
| `review_status` | `text` | Draft/submitted/revision/approved/rejected/archived. |
| `is_published` | `boolean` | Public visibility flag. |
| `admin_note` | `text` | Staff note for revision/rejection. |
| `photo_consent_accepted` | `boolean` | Photo-use consent. |
| `publication_consent_accepted` | `boolean` | Public-posting consent. |
| `submission_consent_at` | `timestamp` | Submission consent timestamp. |
| `submission_consent_version` | `text` | Submission consent version. |
| `submitted_at` | `timestamp` | Submission timestamp. |
| `approved_at` | `timestamp` | Approval timestamp. |
| `approved_by` | `uuid` | Admin who approved. |
| `published_at` | `timestamp` | Publication timestamp. |
| `published_by` | `uuid` | Admin who published. |
| `rejected_at` | `timestamp` | Rejection timestamp. |
| `archived_at` | `timestamp` | Archive timestamp. |
| `created_at` | `timestamp` | Creation timestamp. |
| `updated_at` | `timestamp` | Last update timestamp. |

Recommended constraints:

- `is_published = true` should be allowed only when `review_status = 'approved'`.
- Posts cannot be submitted unless required consent is accepted.
- Public reads should require both `review_status = 'approved'` and
  `is_published = true`.

### `post_status_history`

Purpose: Track status and publication changes for accountability.

Recommended fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | History record ID. |
| `post_id` | `uuid` | Related post. |
| `changed_by` | `uuid` | User who changed status. |
| `previous_status` | `text` | Old review status. |
| `new_status` | `text` | New review status. |
| `previous_is_published` | `boolean` | Old publication state. |
| `new_is_published` | `boolean` | New publication state. |
| `note` | `text` | Optional note. |
| `created_at` | `timestamp` | Change timestamp. |

This table is very useful for explaining administrative accountability during
the final demo.

### `deletion_requests`

Purpose: Allow students to request removal of published posts.

Recommended fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Request ID. |
| `post_id` | `uuid` | Related post. |
| `requester_id` | `uuid` | Student requesting deletion. |
| `reason` | `text` | Student-provided reason. |
| `status` | `text` | Pending/approved/denied/completed. |
| `admin_note` | `text` | Admin response. |
| `resolved_by` | `uuid` | Admin who resolved request. |
| `created_at` | `timestamp` | Request timestamp. |
| `resolved_at` | `timestamp` | Resolution timestamp. |

If time is short, implement this after the main submission/review/publish
workflow.

## Review And Publishing Workflow

Recommended statuses:

| Status | Meaning | Publicly visible |
| --- | --- | --- |
| `draft` | Student is still writing. | No |
| `submitted` | Student submitted for review. | No |
| `under_review` | Admin is reviewing. | No |
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

### Milestone 2: Authentication

Definition of done:

- Student signup works.
- Login works.
- Logout works.
- Profile is created after signup.
- New users default to `student`.
- Non-`@angelo.edu` emails are blocked.
- Admin role can be assigned manually.

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
- Admin actions update status history if implemented.

### Milestone 5: Public Blog

Definition of done:

- Public blog list exists.
- Public detail page exists.
- Only approved and published posts appear publicly.
- Unpublished post URLs are not publicly accessible.
- Public pages work on mobile and desktop.

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

## Testing Checklist

### Student Tests

- Student can register with `@angelo.edu`.
- Student cannot register with a non-`@angelo.edu` email.
- Student can log in.
- Student can log out.
- Student can accept privacy consent.
- Student can create a draft.
- Student can submit a post.
- Student cannot submit without required fields.
- Student cannot submit without consent.
- Student can see their own posts.
- Student cannot see another student's private posts.

### Admin Tests

- Admin can log in.
- Admin can access admin dashboard.
- Student cannot access admin dashboard.
- Admin can view submitted posts.
- Admin can open post review page.
- Admin can request revision.
- Admin can approve.
- Admin can publish an approved post.
- Admin cannot publish a rejected post.
- Admin can reject.
- Admin can archive.
- Admin note appears to student when revision is requested.

### Public Tests

- Public visitor can view homepage.
- Public visitor can view blog list.
- Public visitor can view published post.
- Public visitor cannot view submitted post.
- Public visitor cannot view rejected post.
- Public visitor cannot access student dashboard.
- Public visitor cannot access admin page.

### Security Tests

- Unauthenticated user cannot access dashboard.
- Student cannot access admin route.
- Student cannot publish post.
- Student cannot update another student's post.
- Public user cannot query private posts.
- Environment variables are not exposed.
- Service role key is not used in browser code.
- RLS policies are active.

### Accessibility Tests

- Forms have labels.
- Buttons are keyboard accessible.
- Images have alt text.
- Error messages are readable.
- Mobile layout works.
- Heading order is logical.
- Status badges are understandable without relying only on color.

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

As of June 12, 2026, the project should ideally be in Phase 2. The project root
has now been initialized, proposal files have been organized, and the initial
Next.js app has been generated in `web/`. The practical next step is to run the
local dev server, verify the starter page in the browser, commit the generated
app, and then move directly to Milestone 1 and the student submission workflow.

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
10. [ ] Create Supabase project.
11. [ ] Add `.env.example`.
12. [ ] Create `profiles` and `posts` migrations.
13. [ ] Enable RLS.
14. [ ] Implement signup/login/logout.
15. [ ] Implement role loading.
16. [ ] Implement student dashboard.
17. [ ] Implement create/edit post form.
18. [ ] Implement submit for review.
19. [ ] Implement admin dashboard.
20. [ ] Implement approve/publish flow.
21. [ ] Implement public blog pages.
22. [ ] Write setup and handoff docs.
23. [ ] Prepare final demo.

The most important first coding milestone is not the homepage. It is:

```text
A student can sign up, log in, create a draft, and submit it for review.
```

Once that works, the admin and public workflows have real data to operate on.

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
| Timeline compression | The app code has not started in this folder yet. | Build vertical slices and avoid non-MVP features. |
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
