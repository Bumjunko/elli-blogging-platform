import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandHeader } from "@/components/layout/brand-header";
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
      "A published ELLI student blog post reviewed by ELLI instructors.",
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
    <main className="min-h-screen brand-page text-slate-950">
      <BrandHeader
        title={post.title}
        eyebrow={`Published ${formatDate(post.published_at)}`}
        backHref="/blog"
        backLabel="Back to student blog"
        maxWidth="max-w-4xl"
      />

      <article className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="brand-surface p-5 sm:p-8">
          <p className="brand-eyebrow">
            ELLI Student Blog
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[#002856] sm:text-5xl">
            {post.title}
          </h2>
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
