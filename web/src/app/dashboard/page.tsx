import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { BrandHeader } from "@/components/layout/brand-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Profile = {
  email: string;
  full_name: string;
  role: "student" | "admin";
};

type PostSummary = {
  id: string;
  title: string;
  review_status:
    | "draft"
    | "submitted"
    | "revision_requested"
    | "approved"
    | "rejected"
    | "archived";
  is_published: boolean;
  updated_at: string;
};

const statusLabels: Record<PostSummary["review_status"], string> = {
  draft: "Draft",
  submitted: "Submitted",
  revision_requested: "Revision requested",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

function canEditPost(post: PostSummary) {
  return (
    !post.is_published &&
    ["draft", "revision_requested"].includes(post.review_status)
  );
}

type DashboardPageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const [{ data: profile }, { data: posts, error: postsError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("email, full_name, role")
        .eq("id", user.id)
        .maybeSingle<Profile>(),
      supabase
        .from("posts")
        .select("id, title, review_status, is_published, updated_at")
        .eq("author_id", user.id)
        .order("updated_at", { ascending: false })
        .returns<PostSummary[]>(),
  ]);

  return (
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="Student Dashboard"
        eyebrow="ELLI submission workspace"
        subtitle="Create drafts, submit stories for ELLI instructor review, and track publication status."
      />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="brand-surface p-5">
          <p className="text-sm font-semibold text-slate-500">Signed in as</p>
          <h2 className="mt-2 text-lg font-semibold text-[#002856]">
            {profile?.full_name || user.email}
          </h2>
          <p className="mt-1 break-words text-sm text-slate-600">
            {profile?.email || user.email}
          </p>
          <div className="mt-4 inline-flex rounded bg-[#ffc627] px-3 py-1 text-sm font-semibold capitalize text-[#002856]">
            {profile?.role ?? "student"}
          </div>

          {profile?.role === "admin" ? (
            <Link
              href="/admin"
              className="brand-primary-button mt-5 flex w-full"
            >
              Admin review
            </Link>
          ) : null}

          <form action={signOutAction} className="mt-3">
            <button type="submit" className="brand-outline-button w-full">
              Sign out
            </button>
          </form>

          {!profile ? (
            <p className="mt-5 rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
              Your auth account exists, but the profile row was not found.
            </p>
          ) : null}
        </aside>

        <section className="space-y-6">
          <div className="brand-surface p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#002856]">
                  My blog submissions
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Create drafts, submit posts for review, and track status.
                </p>
              </div>
              <Link
                href="/dashboard/posts/new"
                className="brand-gold-button"
              >
                New post
              </Link>
            </div>
          </div>

          {resolvedSearchParams?.message ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              {resolvedSearchParams.message}
            </div>
          ) : null}

          {postsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {postsError.message}
            </div>
          ) : null}

          {posts && posts.length > 0 ? (
            <div className="brand-surface overflow-hidden">
              <ul className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-[#002856]">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Updated {new Date(post.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {statusLabels[post.review_status]}
                      </span>
                      {post.is_published ? (
                        <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                          Published
                        </span>
                      ) : null}
                      {canEditPost(post) ? (
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="brand-outline-button h-8"
                        >
                          Edit
                        </Link>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="brand-surface border-dashed p-8 text-center">
              <h3 className="text-lg font-semibold text-[#002856]">
                No submissions yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Create your first draft to start the submission workflow.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
