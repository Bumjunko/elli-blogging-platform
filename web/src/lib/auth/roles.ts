import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileRole = "student" | "admin";

export type CurrentProfile = {
  id: string;
  email: string;
  full_name: string;
  role: ProfileRole;
};

function createLoginRedirect(nextPath: string) {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export async function getAuthenticatedProfile(nextPath: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(createLoginRedirect(nextPath));
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle<CurrentProfile>();

  return {
    profile,
    profileError,
    supabase,
    user,
  };
}

export async function requireAdminProfile(nextPath = "/admin") {
  const context = await getAuthenticatedProfile(nextPath);

  if (context.profileError || !context.profile) {
    redirect("/dashboard?message=Profile%20not%20found.");
  }

  if (context.profile.role !== "admin") {
    redirect("/dashboard?message=Admin%20access%20is%20required.");
  }

  return {
    profile: context.profile,
    supabase: context.supabase,
    user: context.user,
  };
}
