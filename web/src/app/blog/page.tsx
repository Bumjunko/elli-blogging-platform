import Link from "next/link";
import { BrandHeader } from "@/components/layout/brand-header";
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
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title="ELLI Student Blog"
        eyebrow=" "
        subtitle="English learning stories from ELLI students, visible only after ELLI instructor review and publication."
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <section className="mb-6">
          <h2 className="max-w-3xl text-4xl font-semibold text-[#002856]">
            English learning stories from ELLI students.
          </h2>
          <p className="mt-3 max-w-5xl text-base leading-7 text-slate-600 md:whitespace-nowrap">
            Every post on this page has been reviewed and published by ELLI
            instructors before becoming publicly visible.
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
                className="brand-surface overflow-hidden"
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
                      className="transition hover:text-[#003b7a]"
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
                    className="brand-outline-button mt-4 h-9"
                  >
                    Read post
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : !error ? (
          <section className="brand-surface border-dashed p-8 text-center">
            <h2 className="text-lg font-semibold text-[#002856]">
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
