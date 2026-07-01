import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { BrandHeader } from "@/components/layout/brand-header";
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
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="Sign in"
        eyebrow="Student and staff access"
        subtitle="Continue drafting, submitting, or reviewing ELLI student blog posts."
        maxWidth="max-w-5xl"
      />

      <section className="mx-auto grid w-full max-w-5xl items-start gap-8 px-6 py-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="brand-eyebrow">
              Welcome back
            </p>
            <h2 className="max-w-2xl text-4xl font-semibold text-[#002856]">
              Sign in to continue your blog submission.
            </h2>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Students can manage drafts and submissions. ELLI instructors can
              review posts after an admin role is assigned.
            </p>
          </div>
        </div>

        <div className="brand-surface p-6">
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold text-[#002856]">Sign in</h2>
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
            <Link href="/signup" className="font-semibold text-[#003b7a]">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
