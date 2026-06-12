import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
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
    <main className="min-h-screen bg-[#f5f7fa] px-6 py-10 text-slate-950">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <Link href="/" className="text-sm font-semibold text-[#174a7c]">
            ELLI Blogging Platform
          </Link>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8a5a10]">
              Student access
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-slate-950">
              Create your moderated ELLI blogging account.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Use your ASU email to join the prototype workflow for
              drafting, submitting, and tracking student blog posts.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold text-slate-950">Sign up</h2>
            <p className="text-sm leading-6 text-slate-600">
              Accounts are limited to @angelo.edu addresses.
            </p>
          </div>
          <SignupForm />
          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#174a7c]">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
