import { redirect } from "next/navigation";
import { BrandHeader } from "@/components/layout/brand-header";
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
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="New Blog Post"
        eyebrow="Student submission"
        subtitle="Draft an ELLI story, add one accessible featured image, and submit it for ELLI instructor review."
        backHref="/dashboard"
        backLabel="Back to dashboard"
        maxWidth="max-w-5xl"
      />

      <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <section className="brand-surface p-5">
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold text-[#002856]">
              Write your draft
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Save a draft while writing, or submit it for ELLI instructor review
              when it is ready.
            </p>
          </div>
          <PostEditorForm />
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

          <div className="brand-panel p-5">
            <h2 className="text-sm font-semibold text-[#002856]">
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
