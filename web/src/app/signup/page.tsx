import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { BrandHeader } from "@/components/layout/brand-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="Create Account"
        eyebrow="ASU email required"
        subtitle="Join the moderated prototype workflow for drafting, submitting, and tracking ELLI student blog posts."
        maxWidth="max-w-5xl"
      />

      <section className="mx-auto grid w-full max-w-5xl items-start gap-8 px-6 py-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="brand-eyebrow">
              Student access
            </p>
            <h2 className="max-w-2xl text-4xl font-semibold text-[#002856]">
              Create your moderated ELLI blogging account.
            </h2>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Use your ASU email to join the prototype workflow for
              drafting, submitting, and tracking student blog posts.
            </p>
          </div>
        </div>

        <div className="brand-surface p-6">
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold text-[#002856]">Sign up</h2>
            <p className="text-sm leading-6 text-slate-600">
              Accounts are limited to @angelo.edu addresses.
            </p>
          </div>
          <SignupForm />
          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#003b7a]">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
