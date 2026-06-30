"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  recordPostStatusHistory,
  type PostReviewStatus,
} from "@/lib/posts/status-history";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PostFormValues = {
  title: string;
  excerpt: string;
  content: string;
  featuredImageAlt: string;
  featuredImagePath: string | null;
  photoConsent: boolean;
  publicPostingConsent: boolean;
};

type ExistingPost = {
  id: string;
  author_id: string;
  review_status: PostReviewStatus;
  is_published: boolean;
  featured_image_path: string | null;
};

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

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
    featuredImageAlt: getText(formData, "featuredImageAlt"),
    featuredImagePath: null,
    photoConsent: formData.get("photoConsent") === "on",
    publicPostingConsent: formData.get("publicPostingConsent") === "on",
  };
}

function getImageFile(formData: FormData) {
  const value = formData.get("featuredImage");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
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

function createImagePath(userId: string, postId: string, file: File) {
  const extension = allowedImageTypes.get(file.type) ?? "jpg";
  return `${userId}/${postId}/featured-${Date.now()}-${randomUUID().slice(
    0,
    8,
  )}.${extension}`;
}

function getEditablePostRedirect(postId: string) {
  return `/dashboard/posts/${postId}/edit`;
}

function createError(message: string, values: PostFormValues): PostFormState {
  return {
    status: "error",
    message,
    values,
  };
}

function validatePost(
  values: PostFormValues,
  shouldSubmit: boolean,
  imageFile: File | null,
  existingImagePath?: string | null,
) {
  if (values.title.length < 3 || values.title.length > 140) {
    return "Title must be between 3 and 140 characters.";
  }

  if (values.excerpt.length > 220) {
    return "Excerpt must be 220 characters or fewer.";
  }

  if (values.content.length < 20) {
    return "Content must be at least 20 characters.";
  }

  if (values.featuredImageAlt.length > 180) {
    return "Image alt text must be 180 characters or fewer.";
  }

  if (imageFile && !allowedImageTypes.has(imageFile.type)) {
    return "Featured image must be a JPG, PNG, or WebP file.";
  }

  if (imageFile && imageFile.size > maxImageSize) {
    return "Featured image must be 5 MB or smaller.";
  }

  const hasFeaturedImage = Boolean(imageFile || existingImagePath);

  if ((imageFile || existingImagePath) && !values.featuredImageAlt) {
    return "Please add alt text for the featured image.";
  }

  if (shouldSubmit && !hasFeaturedImage) {
    return "Please upload a featured image before submitting for review.";
  }

  if (
    shouldSubmit &&
    (!values.photoConsent || !values.publicPostingConsent)
  ) {
    return "Please accept both consent checkboxes before submitting for review.";
  }

  return null;
}

async function uploadPostImage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  postId: string,
  imageFile: File | null,
) {
  if (!imageFile) {
    return null;
  }

  const imagePath = createImagePath(userId, postId, imageFile);
  const { error } = await supabase.storage
    .from("post-images")
    .upload(imagePath, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return imagePath;
}

async function removePostImage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  imagePath: string | null,
) {
  if (!imagePath) {
    return;
  }

  await supabase.storage.from("post-images").remove([imagePath]);
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

  if (message.includes("featured_image_alt")) {
    return "Image alt text must be 180 characters or fewer.";
  }

  return message;
}

function getStudentHistoryNote(
  fromStatus: PostReviewStatus,
  toStatus: PostReviewStatus,
) {
  if (toStatus === "submitted") {
    return fromStatus === "revision_requested"
      ? "Revision submitted for review."
      : "Submitted for review.";
  }

  if (fromStatus === "revision_requested" && toStatus === "draft") {
    return "Revision changes saved as draft.";
  }

  return "Status updated.";
}

export async function createPostAction(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const values = getValues(formData);
  const imageFile = getImageFile(formData);
  const intent = getText(formData, "intent");
  const shouldSubmit = intent === "submit";
  const validationError = validatePost(values, shouldSubmit, imageFile);

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

  const postId = randomUUID();
  let uploadedImagePath: string | null = null;

  try {
    uploadedImagePath = await uploadPostImage(
      supabase,
      user.id,
      postId,
      imageFile,
    );
  } catch (error) {
    return createError(
      `Image upload failed: ${
        error instanceof Error ? error.message : "Please try again."
      }`,
      values,
    );
  }

  const valuesWithImage = {
    ...values,
    featuredImagePath: uploadedImagePath,
  };

  const { data: draft, error: insertError } = await supabase
    .from("posts")
    .insert({
      id: postId,
      author_id: user.id,
      title: values.title,
      slug: createSlug(values.title),
      excerpt: values.excerpt || null,
      content: values.content,
      featured_image_path: uploadedImagePath,
      featured_image_alt: uploadedImagePath ? values.featuredImageAlt : null,
      review_status: "draft",
      is_published: false,
      photo_consent_accepted: values.photoConsent,
      public_posting_consent_accepted: values.publicPostingConsent,
    })
    .select("id")
    .single<{ id: string }>();

  if (insertError) {
    await removePostImage(supabase, uploadedImagePath);
    return createError(
      getPostErrorMessage(insertError.message),
      values,
    );
  }

  let historyWarning = false;
  const draftHistory = await recordPostStatusHistory({
    supabase,
    postId: draft.id,
    changedBy: profile.id,
    fromStatus: null,
    toStatus: "draft",
    note: "Draft created.",
  });

  historyWarning = Boolean(draftHistory.error);

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
        valuesWithImage,
      );
    }

    const submitHistory = await recordPostStatusHistory({
      supabase,
      postId: draft.id,
      changedBy: profile.id,
      fromStatus: "draft",
      toStatus: "submitted",
      note: "Submitted for review.",
    });

    historyWarning = historyWarning || Boolean(submitHistory.error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  redirect(
    `/dashboard?message=${encodeURIComponent(
      historyWarning
        ? shouldSubmit
          ? "Post submitted for review, but status history was not fully recorded."
          : "Draft saved, but status history was not recorded."
        : shouldSubmit
          ? "Post submitted for review."
          : "Draft saved.",
    )}`,
  );
}

export async function updatePostAction(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const values = getValues(formData);
  const imageFile = getImageFile(formData);
  const postId = getText(formData, "postId");
  const intent = getText(formData, "intent");
  const shouldSubmit = intent === "submit";

  if (!postId) {
    return createError("Post ID is missing. Please return to the dashboard.", values);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(getEditablePostRedirect(postId))}`);
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

  const { data: existingPost, error: readError } = await supabase
    .from("posts")
    .select("id, author_id, review_status, is_published, featured_image_path")
    .eq("id", postId)
    .maybeSingle<ExistingPost>();

  if (readError) {
    return createError(getPostErrorMessage(readError.message), values);
  }

  if (!existingPost || existingPost.author_id !== user.id) {
    return createError("This post could not be found in your drafts.", values);
  }

  if (
    existingPost.is_published ||
    !["draft", "revision_requested"].includes(existingPost.review_status)
  ) {
    return createError(
      "Only drafts or posts that need revision can be edited.",
      values,
    );
  }

  const validationError = validatePost(
    values,
    shouldSubmit,
    imageFile,
    existingPost.featured_image_path,
  );

  if (validationError) {
    return createError(validationError, {
      ...values,
      featuredImagePath: existingPost.featured_image_path,
    });
  }

  let uploadedImagePath: string | null = null;

  try {
    uploadedImagePath = await uploadPostImage(
      supabase,
      user.id,
      postId,
      imageFile,
    );
  } catch (error) {
    return createError(
      `Image upload failed: ${
        error instanceof Error ? error.message : "Please try again."
      }`,
      {
        ...values,
        featuredImagePath: existingPost.featured_image_path,
      },
    );
  }

  const nextImagePath = uploadedImagePath ?? existingPost.featured_image_path;
  const nextStatus = shouldSubmit ? "submitted" : "draft";
  const { error: updateError } = await supabase
    .from("posts")
    .update({
      title: values.title,
      excerpt: values.excerpt || null,
      content: values.content,
      featured_image_path: nextImagePath,
      featured_image_alt: nextImagePath ? values.featuredImageAlt : null,
      review_status: nextStatus,
      is_published: false,
      submitted_at: shouldSubmit ? new Date().toISOString() : null,
      photo_consent_accepted: shouldSubmit ? true : values.photoConsent,
      public_posting_consent_accepted: shouldSubmit
        ? true
        : values.publicPostingConsent,
    })
    .eq("id", postId);

  if (updateError) {
    await removePostImage(supabase, uploadedImagePath);
    return createError(getPostErrorMessage(updateError.message), {
      ...values,
      featuredImagePath: nextImagePath,
    });
  }

  const history = await recordPostStatusHistory({
    supabase,
    postId,
    changedBy: profile.id,
    fromStatus: existingPost.review_status,
    toStatus: nextStatus,
    note: getStudentHistoryNote(existingPost.review_status, nextStatus),
  });

  if (uploadedImagePath && existingPost.featured_image_path) {
    await removePostImage(supabase, existingPost.featured_image_path);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath(`/admin/posts/${postId}`);
  revalidatePath(getEditablePostRedirect(postId));
  redirect(
    `/dashboard?message=${encodeURIComponent(
      history.error
        ? shouldSubmit
          ? "Post submitted for review, but status history was not recorded."
          : "Draft updated, but status history was not recorded."
        : shouldSubmit
          ? "Post submitted for review."
          : "Draft updated.",
    )}`,
  );
}
