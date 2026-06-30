import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PublicPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_path: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
  updated_at: string;
};

type PublicPostCard = PublicPostSummary & {
  imageUrl: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Recently published";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function addSignedImageUrls(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  posts: PublicPostSummary[],
) {
  return Promise.all(
    posts.map(async (post): Promise<PublicPostCard> => {
      if (!post.featured_image_path) {
        return {
          ...post,
          imageUrl: null,
        };
      }

      const { data } = await supabase.storage
        .from("post-images")
        .createSignedUrl(post.featured_image_path, 60 * 30);

      return {
        ...post,
        imageUrl: data?.signedUrl ?? null,
      };
    }),
  );
}

export default async function PublicBlogPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, featured_image_path, featured_image_alt, published_at, updated_at",
    )
    .eq("review_status", "approved")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(24)
    .returns<PublicPostSummary[]>();

  const publicPosts = await addSignedImageUrls(supabase, posts ?? []);

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-[#174a7c]">
              ELLI Blogging Platform
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              Student Blog
            </h1>
          </div>
          <nav className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="flex h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="flex h-10 items-center rounded-md bg-[#174a7c] px-4 text-sm font-semibold text-white transition hover:bg-[#10385f]"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <section className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8a5a10]">
            Published after CIS review
          </p>
          <h2 className="mt-2 max-w-3xl text-4xl font-semibold tracking-normal text-slate-950">
            English learning stories from ELLI students.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Every post on this page has been reviewed and published by CIS
            staff before becoming publicly visible.
          </p>
        </section>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Public posts could not be loaded. Please try again later.
          </div>
        ) : null}

        {publicPosts.length > 0 ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicPosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                {post.imageUrl ? (
                  <Link href={`/blog/${post.slug}`} className="block bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={post.featured_image_alt ?? ""}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="aspect-[16/9] bg-[#e8f1f9]" />
                )}

                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    {formatDate(post.published_at)}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-7 text-slate-950">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition hover:text-[#174a7c]"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    Read post
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : !error ? (
          <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-950">
              No public posts yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Published student posts will appear here after review.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
