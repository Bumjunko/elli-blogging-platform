"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PostFormValues = {
  title: string;
  excerpt: string;
  content: string;
  photoConsent: boolean;
  publicPostingConsent: boolean;
};

export type PostFormState = {
  message: string;
  status: "idle" | "error";
  values: PostFormValues;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getValues(formData: FormData): PostFormValues {
  return {
    title: getText(formData, "title"),
    excerpt: getText(formData, "excerpt"),
    content: getText(formData, "content"),
    photoConsent: formData.get("photoConsent") === "on",
    publicPostingConsent: formData.get("publicPostingConsent") === "on",
  };
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "post";
}

function createSlug(title: string) {
  return `${slugify(title)}-${randomUUID().slice(0, 8)}`;
}

function createError(message: string, values: PostFormValues): PostFormState {
  return {
    status: "error",
    message,
    values,
  };
}

function validatePost(values: PostFormValues, shouldSubmit: boolean) {
  if (values.title.length < 3 || values.title.length > 140) {
    return "Title must be between 3 and 140 characters.";
  }

  if (values.excerpt.length > 220) {
    return "Excerpt must be 220 characters or fewer.";
  }

  if (values.content.length < 20) {
    return "Content must be at least 20 characters.";
  }

  if (
    shouldSubmit &&
    (!values.photoConsent || !values.publicPostingConsent)
  ) {
    return "Please accept both consent checkboxes before submitting for review.";
  }

  return null;
}

function getPostErrorMessage(message: string) {
  if (message.includes("posts_title_check")) {
    return "Title must be between 3 and 140 characters.";
  }

  if (message.includes("posts_content_check")) {
    return "Content must be at least 20 characters.";
  }

  if (message.includes("posts_submission_requires_consent")) {
    return "Please accept both consent checkboxes before submitting for review.";
  }

  return message;
}

export async function createPostAction(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const values = getValues(formData);
  const intent = getText(formData, "intent");
  const shouldSubmit = intent === "submit";
  const validationError = validatePost(values, shouldSubmit);

  if (validationError) {
    return createError(validationError, values);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/posts/new");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle<{ id: string }>();

  if (!profile) {
    return createError(
      "Your profile is not ready yet. Please sign out, sign in again, and retry.",
      values,
    );
  }

  const { data: draft, error: insertError } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: values.title,
      slug: createSlug(values.title),
      excerpt: values.excerpt || null,
      content: values.content,
      review_status: "draft",
      is_published: false,
      photo_consent_accepted: values.photoConsent,
      public_posting_consent_accepted: values.publicPostingConsent,
    })
    .select("id")
    .single<{ id: string }>();

  if (insertError) {
    return createError(getPostErrorMessage(insertError.message), values);
  }

  if (shouldSubmit) {
    const { error: submitError } = await supabase
      .from("posts")
      .update({
        review_status: "submitted",
        submitted_at: new Date().toISOString(),
        photo_consent_accepted: true,
        public_posting_consent_accepted: true,
      })
      .eq("id", draft.id);

    if (submitError) {
      return createError(
        `Draft saved, but submission failed: ${getPostErrorMessage(
          submitError.message,
        )}`,
        values,
      );
    }
  }

  revalidatePath("/dashboard");
  redirect(
    shouldSubmit
      ? "/dashboard?message=Post%20submitted%20for%20review."
      : "/dashboard?message=Draft%20saved.",
  );
}
