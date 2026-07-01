import { notFound } from "next/navigation";
import { reviewPostAction } from "@/app/admin/posts/actions";
import { BrandHeader } from "@/components/layout/brand-header";
import { requireAdminProfile } from "@/lib/auth/roles";

type AdminPostPageProps = {
  params: Promise<{
    postId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

type ReviewStatus =
  | "draft"
  | "submitted"
  | "revision_requested"
  | "approved"
  | "rejected"
  | "archived";

type ReviewPost = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_path: string | null;
  featured_image_alt: string | null;
  review_status: ReviewStatus;
  is_published: boolean;
  submitted_at: string | null;
  reviewed_at: string | null;
  published_at: string | null;
  admin_note: string | null;
  photo_consent_accepted: boolean;
  public_posting_consent_accepted: boolean;
  created_at: string;
  updated_at: string;
};

type AuthorProfile = {
  id: string;
  email: string;
  full_name: string;
};

type StatusHistoryEntry = {
  id: string;
  changed_by: string | null;
  from_status: ReviewStatus | null;
  to_status: ReviewStatus;
  note: string | null;
  created_at: string;
};

const statusLabels: Record<ReviewStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  revision_requested: "Revision requested",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

const statusClasses: Record<ReviewStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  submitted: "bg-[#eef5fb] text-[#003b7a]",
  revision_requested: "bg-amber-50 text-amber-900",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-800",
  archived: "bg-slate-100 text-slate-700",
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString();
}

function formatStatusTransition(entry: StatusHistoryEntry) {
  if (!entry.from_status) {
    return statusLabels[entry.to_status];
  }

  if (entry.from_status === entry.to_status) {
    return statusLabels[entry.to_status];
  }

  return `${statusLabels[entry.from_status]} -> ${statusLabels[entry.to_status]}`;
}

export default async function AdminPostReviewPage({
  params,
  searchParams,
}: AdminPostPageProps) {
  const { postId } = await params;
  const resolvedSearchParams = await searchParams;
  const { profile, supabase } = await requireAdminProfile(
    `/admin/posts/${postId}`,
  );

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select(
      "id, author_id, title, slug, excerpt, content, featured_image_path, featured_image_alt, review_status, is_published, submitted_at, reviewed_at, published_at, admin_note, photo_consent_accepted, public_posting_consent_accepted, created_at, updated_at",
    )
    .eq("id", postId)
    .maybeSingle<ReviewPost>();

  if (postError || !post) {
    notFound();
  }

  const [{ data: author }, { data: statusHistory, error: historyError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", post.author_id)
        .maybeSingle<AuthorProfile>(),
      supabase
        .from("post_status_history")
        .select("id, changed_by, from_status, to_status, note, created_at")
        .eq("post_id", post.id)
        .order("created_at", { ascending: false })
        .returns<StatusHistoryEntry[]>(),
    ]);

  let signedImageUrl: string | null = null;

  if (post.featured_image_path) {
    const { data } = await supabase.storage
      .from("post-images")
      .createSignedUrl(post.featured_image_path, 60 * 10);

    signedImageUrl = data?.signedUrl ?? null;
  }

  const canReview = post.review_status === "submitted" && !post.is_published;
  const canPublish = post.review_status === "approved" && !post.is_published;

  return (
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="Review Post"
        eyebrow={statusLabels[post.review_status]}
        subtitle={post.title}
        backHref="/admin"
        backLabel="Back to admin review"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          {resolvedSearchParams?.message ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              {resolvedSearchParams.message}
            </div>
          ) : null}

          {resolvedSearchParams?.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {resolvedSearchParams.error}
            </div>
          ) : null}

          <article className="brand-surface p-5">
            <div className="flex flex-wrap items-center gap-2">
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

            <h2 className="mt-4 text-3xl font-semibold text-[#002856]">
              {post.title}
            </h2>

            {post.excerpt ? (
              <p className="mt-3 text-base leading-7 text-slate-600">
                {post.excerpt}
              </p>
            ) : null}

            {signedImageUrl ? (
              <figure className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signedImageUrl}
                  alt={post.featured_image_alt ?? ""}
                  className="aspect-[16/9] w-full object-cover"
                />
                {post.featured_image_alt ? (
                  <figcaption className="border-t border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
                    {post.featured_image_alt}
                  </figcaption>
                ) : null}
              </figure>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                No featured image is available.
              </div>
            )}

            <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-800">
              {post.content}
            </div>
          </article>

          <section className="brand-surface p-5">
            <h2 className="text-xl font-semibold text-[#002856]">
              Status history
            </h2>

            {historyError ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {historyError.message}
              </p>
            ) : null}

            {statusHistory && statusHistory.length > 0 ? (
              <ol className="mt-5 divide-y divide-slate-200">
                {statusHistory.map((entry) => (
                  <li key={entry.id} className="py-4">
                    <p className="font-semibold text-[#002856]">
                      {formatStatusTransition(entry)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatDateTime(entry.created_at)}
                    </p>
                    {entry.note ? (
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {entry.note}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                No status changes have been recorded yet.
              </p>
            )}
          </section>
        </section>

        <aside className="space-y-4">
          <div className="brand-surface p-5">
            <p className="text-sm font-semibold text-slate-500">Reviewer</p>
            <h2 className="mt-2 text-lg font-semibold text-[#002856]">
              {profile.full_name || profile.email}
            </h2>
            <p className="mt-1 break-words text-sm text-slate-600">
              {profile.email}
            </p>
          </div>

          <div className="brand-surface p-5">
            <p className="text-sm font-semibold text-slate-500">Author</p>
            <h2 className="mt-2 text-lg font-semibold text-[#002856]">
              {author?.full_name || author?.email || "Unknown"}
            </h2>
            {author?.email ? (
              <p className="mt-1 break-words text-sm text-slate-600">
                {author.email}
              </p>
            ) : null}
          </div>

          <div className="brand-surface p-5">
            <h2 className="text-sm font-semibold text-[#002856]">
              Submission details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Submitted</dt>
                <dd className="mt-1 text-slate-800">
                  {formatDateTime(post.submitted_at)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Updated</dt>
                <dd className="mt-1 text-slate-800">
                  {formatDateTime(post.updated_at)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Reviewed</dt>
                <dd className="mt-1 text-slate-800">
                  {formatDateTime(post.reviewed_at)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Published</dt>
                <dd className="mt-1 text-slate-800">
                  {formatDateTime(post.published_at)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="brand-surface p-5">
            <h2 className="text-sm font-semibold text-[#002856]">
              Review actions
            </h2>
            {canReview || canPublish ? (
              <form action={reviewPostAction} className="mt-4 space-y-4">
                <input type="hidden" name="postId" value={post.id} />
                <div className="space-y-2">
                  <label
                    htmlFor="adminNote"
                    className="text-sm font-medium text-slate-800"
                  >
                    Admin note
                  </label>
                  <textarea
                    id="adminNote"
                    name="adminNote"
                    rows={4}
                    maxLength={2000}
                    defaultValue={post.admin_note ?? ""}
                    className="w-full resize-y rounded border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-[#003b7a] focus:ring-2 focus:ring-[#003b7a]/20"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <input
                    name="confirmReviewAction"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#003b7a]"
                  />
                  <span>I confirm this review action is intentional.</span>
                </label>

                {canReview ? (
                  <div className="grid gap-2">
                    <button
                      type="submit"
                      name="intent"
                      value="approve"
                      className="brand-primary-button h-10"
                    >
                      Approve
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="request_revision"
                      className="h-10 rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
                    >
                      Request revision
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="reject"
                      className="h-10 rounded-md border border-red-300 bg-red-50 px-4 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                ) : null}

                {canPublish ? (
                  <button
                    type="submit"
                    name="intent"
                    value="publish"
                    className="h-10 w-full rounded bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Publish
                  </button>
                ) : null}
              </form>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No review actions are available for this status.
              </p>
            )}
          </div>

          <div className="brand-surface p-5">
            <h2 className="text-sm font-semibold text-[#002856]">
              Consent checklist
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>
                Photo/media:{" "}
                <span className="font-semibold">
                  {post.photo_consent_accepted ? "Accepted" : "Missing"}
                </span>
              </li>
              <li>
                Public posting:{" "}
                <span className="font-semibold">
                  {post.public_posting_consent_accepted ? "Accepted" : "Missing"}
                </span>
              </li>
              <li>
                Alt text:{" "}
                <span className="font-semibold">
                  {post.featured_image_alt ? "Added" : "Missing"}
                </span>
              </li>
            </ul>
          </div>

          {post.admin_note ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-amber-900">Admin note</p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                {post.admin_note}
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
