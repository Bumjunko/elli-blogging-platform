import Link from "next/link";
import { BrandHeader } from "@/components/layout/brand-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="ELLI Student Blogging Platform"
        eyebrow="Center for International Studies"
        subtitle="A secure, moderated publishing workflow for English Language Learners' Institute student stories."
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
        <div className="brand-rule pb-8" />
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="brand-eyebrow">
              Moderated student publishing
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold text-[#002856] sm:text-5xl">
              A secure blogging workflow for ELLI student stories.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Students draft and submit posts. ELLI instructors review content
              before anything becomes public.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/blog"
                className="brand-gold-button h-12"
              >
                Read public posts
              </Link>
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="brand-gold-button h-12"
              >
                {user ? "Open dashboard" : "Create student account"}
              </Link>
              <Link
                href="/login"
                className="brand-gold-button h-12"
              >
                Staff or student sign in
              </Link>
            </div>
          </div>

          <div className="brand-surface p-6">
            <h2 className="text-lg font-semibold text-[#002856]">
              Current workflow
            </h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#ffc627] font-semibold text-[#002856]">
                  1
                </span>
                Student signs up with an ASU email.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#ffc627] font-semibold text-[#002856]">
                  2
                </span>
                Student accepts platform and privacy consent.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#ffc627] font-semibold text-[#002856]">
                  3
                </span>
                Submissions stay private until reviewed and published.
              </li>
            </ol>
          </div>
        </div>

        <p className="mt-10 text-xs text-slate-500">
          Prototype foundation: Next.js, Supabase Auth, PostgreSQL, RLS, and
          private storage.
        </p>
      </section>
    </main>
  );
}
