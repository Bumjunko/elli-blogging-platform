import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { PostEditorForm } from "@/components/posts/post-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewPostPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/posts/new");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle<{ full_name: string; email: string }>();

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold text-[#174a7c]">
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              New blog post
            </h1>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold text-slate-950">
              Write your draft
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Save a draft while writing, or submit it for CIS staff review
              when it is ready.
            </p>
          </div>
          <PostEditorForm />
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Author</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              {profile?.full_name || user.email}
            </h2>
            <p className="mt-1 break-words text-sm text-slate-600">
              {profile?.email || user.email}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-950">
              Before submitting
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>Use clear, respectful language.</li>
              <li>Avoid private documents or sensitive personal details.</li>
              <li>Add one featured image with descriptive alt text.</li>
              <li>Confirm both consent boxes before submitting.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
