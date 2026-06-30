import type { createSupabaseServerClient } from "@/lib/supabase/server";

export type PostReviewStatus =
  | "draft"
  | "submitted"
  | "revision_requested"
  | "approved"
  | "rejected"
  | "archived";

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

type RecordPostStatusHistoryParams = {
  supabase: SupabaseServerClient;
  postId: string;
  changedBy: string;
  fromStatus: PostReviewStatus | null;
  toStatus: PostReviewStatus;
  note: string;
  recordUnchangedStatus?: boolean;
};

export async function recordPostStatusHistory({
  supabase,
  postId,
  changedBy,
  fromStatus,
  toStatus,
  note,
  recordUnchangedStatus = false,
}: RecordPostStatusHistoryParams) {
  if (!recordUnchangedStatus && fromStatus === toStatus) {
    return {
      error: null,
      skipped: true,
    };
  }

  const { error } = await supabase.from("post_status_history").insert({
    post_id: postId,
    changed_by: changedBy,
    from_status: fromStatus,
    to_status: toStatus,
    note,
  });

  return {
    error,
    skipped: false,
  };
}
