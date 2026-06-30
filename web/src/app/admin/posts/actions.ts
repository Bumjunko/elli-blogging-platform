"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminProfile } from "@/lib/auth/roles";
import {
  recordPostStatusHistory,
  type PostReviewStatus,
} from "@/lib/posts/status-history";

type ReviewStatus = PostReviewStatus;

type ReviewIntent = "request_revision" | "approve" | "reject" | "publish";

type ReviewActionPost = {
  id: string;
  review_status: ReviewStatus;
  is_published: boolean;
  reviewed_at: string | null;
  admin_note: string | null;
};

const intentLabels: Record<ReviewIntent, string> = {
  request_revision: "Revision requested",
  approve: "Post approved",
  reject: "Post rejected",
  publish: "Post published",
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getIntent(formData: FormData): ReviewIntent | null {
  const value = getText(formData, "intent");

  if (
    value === "request_revision" ||
    value === "approve" ||
    value === "reject" ||
    value === "publish"
  ) {
    return value;
  }

  return null;
}

function createReviewRedirect(
  postId: string,
  params: { message?: string; error?: string },
) {
  const searchParams = new URLSearchParams();

  if (params.message) {
    searchParams.set("message", params.message);
  }

  if (params.error) {
    searchParams.set("error", params.error);
  }

  const suffix = searchParams.toString();
  return `/admin/posts/${postId}${suffix ? `?${suffix}` : ""}`;
}

function validateAction(
  intent: ReviewIntent,
  post: ReviewActionPost,
  adminNote: string,
) {
  if (post.is_published) {
    return "Published posts cannot be changed from this review screen.";
  }

  if (
    (intent === "request_revision" || intent === "reject") &&
    adminNote.length < 3
  ) {
    return "Please add an admin note before requesting revision or rejecting.";
  }

  if (
    (intent === "request_revision" ||
      intent === "approve" ||
      intent === "reject") &&
    post.review_status !== "submitted"
  ) {
    return "Only submitted posts can be reviewed with that action.";
  }

  if (intent === "publish" && post.review_status !== "approved") {
    return "Only approved posts can be published.";
  }

  return null;
}

function getNextStatus(intent: ReviewIntent, currentStatus: ReviewStatus) {
  if (intent === "request_revision") {
    return "revision_requested";
  }

  if (intent === "approve" || intent === "publish") {
    return "approved";
  }

  if (intent === "reject") {
    return "rejected";
  }

  return currentStatus;
}

export async function reviewPostAction(formData: FormData) {
  const postId = getText(formData, "postId");
  const intent = getIntent(formData);
  const adminNote = getText(formData, "adminNote");
  const confirmed = formData.get("confirmReviewAction") === "on";

  if (!postId) {
    redirect("/admin?message=Post%20ID%20is%20missing.");
  }

  if (!intent) {
    redirect(
      createReviewRedirect(postId, {
        error: "Review action is missing.",
      }),
    );
  }

  if (adminNote.length > 2000) {
    redirect(
      createReviewRedirect(postId, {
        error: "Admin note must be 2000 characters or fewer.",
      }),
    );
  }

  if (!confirmed) {
    redirect(
      createReviewRedirect(postId, {
        error: "Please confirm the review action before submitting.",
      }),
    );
  }

  const { profile, supabase } = await requireAdminProfile(
    `/admin/posts/${postId}`,
  );

  const { data: post, error: readError } = await supabase
    .from("posts")
    .select("id, review_status, is_published, reviewed_at, admin_note")
    .eq("id", postId)
    .maybeSingle<ReviewActionPost>();

  if (readError || !post) {
    redirect(
      createReviewRedirect(postId, {
        error: readError?.message || "Post could not be found.",
      }),
    );
  }

  const validationError = validateAction(intent, post, adminNote);

  if (validationError) {
    redirect(
      createReviewRedirect(postId, {
        error: validationError,
      }),
    );
  }

  const now = new Date().toISOString();
  const nextStatus = getNextStatus(intent, post.review_status);
  const nextAdminNote =
    adminNote || post.admin_note || (intent === "publish" ? "Published." : null);

  const updatePayload =
    intent === "publish"
      ? {
          review_status: nextStatus,
          is_published: true,
          reviewed_at: post.reviewed_at ?? now,
          published_at: now,
          admin_note: nextAdminNote,
        }
      : {
          review_status: nextStatus,
          is_published: false,
          reviewed_at: now,
          published_at: null,
          admin_note: nextAdminNote,
        };

  const { error: updateError } = await supabase
    .from("posts")
    .update(updatePayload)
    .eq("id", post.id);

  if (updateError) {
    redirect(
      createReviewRedirect(postId, {
        error: updateError.message,
      }),
    );
  }

  const historyNote = adminNote || intentLabels[intent];
  const { error: historyError } = await recordPostStatusHistory({
    supabase,
    postId: post.id,
    changedBy: profile.id,
    fromStatus: post.review_status,
    toStatus: nextStatus,
    note: historyNote,
    recordUnchangedStatus: intent === "publish",
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/posts/${post.id}`);
  revalidatePath("/dashboard");

  redirect(
    createReviewRedirect(postId, {
      message: historyError
        ? `${intentLabels[intent]}, but status history was not recorded.`
        : `${intentLabels[intent]}.`,
    }),
  );
}
