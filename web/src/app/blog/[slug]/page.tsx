import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type PublicPostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_path: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
  updated_at: string;
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

function renderParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

async function getPublishedPost(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, featured_image_path, featured_image_alt, published_at, updated_at",
    )
    .eq("slug", slug)
    .eq("review_status", "approved")
    .eq("is_published", true)
    .maybeSingle<PublicPostDetail>();

  if (error || !post) {
    return {
      post: null,
      imageUrl: null,
    };
  }

  if (!post.featured_image_path) {
    return {
      post,
      imageUrl: null,
    };
  }

  const { data } = await supabase.storage
    .from("post-images")
    .createSignedUrl(post.featured_image_path, 60 * 30);

  return {
    post,
    imageUrl: data?.signedUrl ?? null,
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPublishedPost(slug);

  if (!post) {
    return {
      title: "Post not found | ELLI Blogging Platform",
    };
  }

  return {
    title: `${post.title} | ELLI Student Blog`,
    description:
      post.excerpt ??
      "A published ELLI student blog post reviewed by CIS staff.",
  };
}

export default async function PublicBlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;
  const { post, imageUrl } = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = renderParagraphs(post.content);

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/blog" className="text-sm font-semibold text-[#174a7c]">
              Back to student blog
            </Link>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Published {formatDate(post.published_at)}
            </p>
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

      <article className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8a5a10]">
            ELLI Student Blog
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {post.excerpt}
            </p>
          ) : null}

          {imageUrl ? (
            <figure className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={post.featured_image_alt ?? ""}
                className="aspect-[16/9] w-full object-cover"
              />
              {post.featured_image_alt ? (
                <figcaption className="border-t border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
                  {post.featured_image_alt}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="mt-8 space-y-5 text-base leading-8 text-slate-800">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
