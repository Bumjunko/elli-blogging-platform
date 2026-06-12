import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-6 py-8 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-between gap-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#174a7c]">
            ELLI Blogging Platform
          </p>
          <nav className="flex gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-[#174a7c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#10385f]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-[#174a7c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#10385f]"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8a5a10]">
              Moderated student publishing
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-slate-950">
              A secure blogging workflow for ELLI student stories.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Students draft and submit posts. CIS staff reviews content before
              anything becomes public.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="rounded-md bg-[#174a7c] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#10385f]"
              >
                {user ? "Open dashboard" : "Create student account"}
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Staff or student sign in
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Current workflow
            </h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e8f1f9] font-semibold text-[#174a7c]">
                  1
                </span>
                Student signs up with an Angelo State email.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e8f1f9] font-semibold text-[#174a7c]">
                  2
                </span>
                Student accepts platform and privacy consent.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e8f1f9] font-semibold text-[#174a7c]">
                  3
                </span>
                Submissions stay private until reviewed and published.
              </li>
            </ol>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Prototype foundation: Next.js, Supabase Auth, PostgreSQL, RLS, and
          private storage.
        </p>
      </section>
    </main>
  );
}
