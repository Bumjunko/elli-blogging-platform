import Link from "next/link";
import { BrandHeader } from "@/components/layout/brand-header";
import { requireAdminProfile } from "@/lib/auth/roles";

type ReviewStatusCount = {
  label: string;
  value: number;
};

type ReviewStatus =
  | "submitted"
  | "revision_requested"
  | "approved"
  | "rejected"
  | "archived";

type AdminPostSummary = {
  id: string;
  author_id: string;
  title: string;
  excerpt: string | null;
  review_status: ReviewStatus;
  is_published: boolean;
  submitted_at: string | null;
  updated_at: string;
  featured_image_path: string | null;
  featured_image_alt: string | null;
  photo_consent_accepted: boolean;
  public_posting_consent_accepted: boolean;
};

type AuthorSummary = {
  id: string;
  email: string;
  full_name: string;
};

const statusLabels: Record<ReviewStatus, string> = {
  submitted: "Submitted",
  revision_requested: "Revision requested",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

const statusClasses: Record<ReviewStatus, string> = {
  submitted: "bg-[#eef5fb] text-[#003b7a]",
  revision_requested: "bg-amber-50 text-amber-900",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-800",
  archived: "bg-slate-100 text-slate-700",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not submitted";
  }

  return new Date(value).toLocaleDateString();
}

export default async function AdminPage() {
  const { profile, supabase } = await requireAdminProfile("/admin");

  const [
    { count: submittedCount },
    { count: revisionCount },
    { count: approvedCount },
    { count: publishedCount },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("review_status", "submitted"),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("review_status", "revision_requested"),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("review_status", "approved"),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
  ]);

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select(
      "id, author_id, title, excerpt, review_status, is_published, submitted_at, updated_at, featured_image_path, featured_image_alt, photo_consent_accepted, public_posting_consent_accepted",
    )
    .neq("review_status", "draft")
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(25)
    .returns<AdminPostSummary[]>();

  const authorIds = Array.from(
    new Set((posts ?? []).map((post) => post.author_id)),
  );
  let authors: AuthorSummary[] = [];
  let authorsError: { message: string } | null = null;

  if (authorIds.length > 0) {
    const authorResponse = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", authorIds)
      .returns<AuthorSummary[]>();

    authors = authorResponse.data ?? [];
    authorsError = authorResponse.error;
  }

  const authorsById = new Map(
    authors.map((author) => [author.id, author] as const),
  );
  const reviewCounts: ReviewStatusCount[] = [
    { label: "Submitted", value: submittedCount ?? 0 },
    { label: "Revision requested", value: revisionCount ?? 0 },
    { label: "Approved", value: approvedCount ?? 0 },
    { label: "Published", value: publishedCount ?? 0 },
  ];

  return (
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="Admin Review"
        eyebrow="ELLI instructor workflow"
        subtitle="Review student submissions, track status, and publish approved ELLI blog posts."
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="brand-surface p-5">
          <p className="text-sm font-semibold text-slate-500">Signed in as</p>
          <h2 className="mt-2 text-lg font-semibold text-[#002856]">
            {profile.full_name || profile.email}
          </h2>
          <p className="mt-1 break-words text-sm text-slate-600">
            {profile.email}
          </p>
          <div className="mt-4 inline-flex rounded bg-[#ffc627] px-3 py-1 text-sm font-semibold capitalize text-[#002856]">
            {profile.role}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {reviewCounts.map((item) => (
              <div
                key={item.label}
                className="brand-surface p-4"
              >
                <p className="text-sm font-semibold text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#002856]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="brand-surface overflow-hidden">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-xl font-semibold text-[#002856]">
                Submitted posts
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Review-ready posts appear here after students submit them.
              </p>
            </div>

            {postsError || authorsError ? (
              <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {postsError?.message || authorsError?.message}
              </div>
            ) : null}

            {posts && posts.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {posts.map((post) => {
                  const author = authorsById.get(post.author_id);

                  return (
                    <li
                      key={post.id}
                      className="grid gap-4 p-5 xl:grid-cols-[1fr_220px]"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[#002856]">
                            {post.title}
                          </h3>
                          <span
                            className={`rounded-md px-3 py-1 text-sm font-medium ${statusClasses[post.review_status]}`}
                          >
                            {statusLabels[post.review_status]}
                          </span>
                          {post.is_published ? (
                            <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                              Published
                            </span>
                          ) : null}
                        </div>

                        {post.excerpt ? (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {post.excerpt}
                          </p>
                        ) : null}

                        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="font-semibold text-slate-500">
                              Author
                            </dt>
                            <dd className="mt-1 text-slate-800">
                              {author?.full_name || author?.email || "Unknown"}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-slate-500">
                              Submitted
                            </dt>
                            <dd className="mt-1 text-slate-800">
                              {formatDate(post.submitted_at)}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div className="flex flex-col gap-2 text-sm text-slate-700 xl:items-end">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="brand-primary-button h-9"
                        >
                          Open review
                        </Link>
                        <span className="rounded-md bg-slate-100 px-3 py-1 font-medium">
                          {post.featured_image_path
                            ? "Image attached"
                            : "No image"}
                        </span>
                        <span className="rounded-md bg-slate-100 px-3 py-1 font-medium">
                          {post.featured_image_alt ? "Alt text added" : "No alt text"}
                        </span>
                        <span className="rounded-md bg-slate-100 px-3 py-1 font-medium">
                          {post.photo_consent_accepted &&
                          post.public_posting_consent_accepted
                            ? "Consent complete"
                            : "Consent missing"}
                        </span>
                        <p className="pt-1 text-xs text-slate-500">
                          Updated {formatDate(post.updated_at)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold text-[#002856]">
                  No review-ready posts yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Student submissions will appear here after they are sent for
                  ELLI instructor review.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
