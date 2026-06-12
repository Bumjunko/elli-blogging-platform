import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSafeNextPath } from "@/lib/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeNextPath(resolvedSearchParams?.next);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(nextPath);
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
              Welcome back
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-slate-950">
              Sign in to continue your blog submission.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Students can manage drafts and submissions. CIS staff can review
              posts after an admin role is assigned.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold text-slate-950">Sign in</h2>
            <p className="text-sm leading-6 text-slate-600">
              Use the account connected to your ELLI blog submissions.
            </p>
          </div>
          <LoginForm
            message={resolvedSearchParams?.message}
            nextPath={nextPath}
          />
          <p className="mt-6 text-sm text-slate-600">
            Need an account?{" "}
            <Link href="/signup" className="font-semibold text-[#174a7c]">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
