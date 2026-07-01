import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BrandHeader } from "@/components/layout/brand-header";
import { PostEditorForm } from "@/components/posts/post-editor-form";
import type { PostReviewStatus } from "@/lib/posts/status-history";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EditPostPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

type EditablePost = {
  id: string;
  author_id: string;
  title: string;
  excerpt: string | null;
  content: string;
  review_status: PostReviewStatus;
  is_published: boolean;
  admin_note: string | null;
  featured_image_path: string | null;
  featured_image_alt: string | null;
  photo_consent_accepted: boolean;
  public_posting_consent_accepted: boolean;
  updated_at: string;
};

type Profile = {
  email: string;
  full_name: string;
};

type StatusHistoryEntry = {
  id: string;
  from_status: PostReviewStatus | null;
  to_status: PostReviewStatus;
  note: string | null;
  created_at: string;
};

const statusLabels: Record<PostReviewStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  revision_requested: "Revision requested",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
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

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/dashboard/posts/${postId}/edit`)}`);
  }

  const [
    { data: profile },
    { data: post, error: postError },
    { data: statusHistory, error: historyError },
  ] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle<Profile>(),
      supabase
        .from("posts")
        .select(
          "id, author_id, title, excerpt, content, review_status, is_published, admin_note, featured_image_path, featured_image_alt, photo_consent_accepted, public_posting_consent_accepted, updated_at",
        )
        .eq("id", postId)
        .maybeSingle<EditablePost>(),
      supabase
        .from("post_status_history")
        .select("id, from_status, to_status, note, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: false })
        .returns<StatusHistoryEntry[]>(),
    ]);

  if (postError || !post || post.author_id !== user.id) {
    notFound();
  }

  const canEdit =
    !post.is_published &&
    ["draft", "revision_requested"].includes(post.review_status);

  return (
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="Edit Blog Post"
        eyebrow={statusLabels[post.review_status]}
        subtitle={
          canEdit
            ? "Update your draft or revision response before sending it back to an ELLI instructor."
            : "This post is locked while it moves through review or publication."
        }
        backHref="/dashboard"
        backLabel="Back to dashboard"
        maxWidth="max-w-5xl"
      />

      <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <section className="brand-surface p-5">
          <div className="mb-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-[#002856]">
                {canEdit ? "Update your draft" : "Post is locked"}
              </h2>
              <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {statusLabels[post.review_status]}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {canEdit
                ? "Save changes while writing, or submit the updated post for ELLI instructor review."
                : "This post cannot be edited while it is waiting for review, approved, rejected, archived, or published."}
            </p>
          </div>

          {canEdit ? (
            <PostEditorForm
              mode="edit"
              postId={post.id}
              initialValues={{
                title: post.title,
                excerpt: post.excerpt ?? "",
                content: post.content,
                featuredImageAlt: post.featured_image_alt ?? "",
                featuredImagePath: post.featured_image_path,
                photoConsent: post.photo_consent_accepted,
                publicPostingConsent: post.public_posting_consent_accepted,
              }}
            />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-[#002856]">
                No edits available
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Return to the dashboard to track this post&apos;s review status.
                If an ELLI instructor requests a revision, editing will become
                available again.
              </p>
              <Link
                href="/dashboard"
                className="brand-primary-button mt-4"
              >
                Go to dashboard
              </Link>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="brand-surface p-5">
            <p className="text-sm font-semibold text-slate-500">Author</p>
            <h2 className="mt-2 text-lg font-semibold text-[#002856]">
              {profile?.full_name || user.email}
            </h2>
            <p className="mt-1 break-words text-sm text-slate-600">
              {profile?.email || user.email}
            </p>
          </div>

          <div className="brand-surface p-5">
            <p className="text-sm font-semibold text-slate-500">Post status</p>
            <h2 className="mt-2 text-lg font-semibold text-[#002856]">
              {statusLabels[post.review_status]}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Updated {new Date(post.updated_at).toLocaleDateString()}
            </p>
          </div>

          <div className="brand-surface p-5">
            <h2 className="text-sm font-semibold text-[#002856]">
              Status history
            </h2>

            {historyError ? (
              <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                {historyError.message}
              </p>
            ) : null}

            {statusHistory && statusHistory.length > 0 ? (
              <ol className="mt-4 divide-y divide-slate-200">
                {statusHistory.map((entry) => (
                  <li key={entry.id} className="py-3">
                    <p className="text-sm font-semibold text-[#002856]">
                      {formatStatusTransition(entry)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDateTime(entry.created_at)}
                    </p>
                    {entry.note ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {entry.note}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No status changes have been recorded yet.
              </p>
            )}
          </div>

          <div className="brand-surface p-5">
            <p className="text-sm font-semibold text-slate-500">
              Featured image
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[#002856]">
              {post.featured_image_path ? "Attached" : "Not added yet"}
            </h2>
            {post.featured_image_alt ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {post.featured_image_alt}
              </p>
            ) : null}
          </div>

          {post.admin_note ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-amber-900">
                ELLI instructor note
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                {post.admin_note}
              </p>
            </div>
          ) : null}

          {canEdit ? (
            <div className="brand-panel p-5">
              <h2 className="text-sm font-semibold text-[#002856]">
                Editing rules
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>Drafts can be updated before review.</li>
                <li>Revision requests can be edited and resubmitted.</li>
                <li>Submitted posts lock while an ELLI instructor reviews them.</li>
                <li>A new featured image replaces the current one.</li>
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
