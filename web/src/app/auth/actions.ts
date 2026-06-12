"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeNextPath } from "@/lib/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  message: string;
  status: "idle" | "error" | "success";
};

const consentVersion = "2026-06-12";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isAngeloEmail(email: string) {
  return email.toLowerCase().endsWith("@angelo.edu");
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = getText(formData, "fullName");
  const email = getText(formData, "email").toLowerCase();
  const password = getText(formData, "password");
  const consentAccepted = formData.get("privacyConsent") === "on";

  if (!fullName || !email || !password) {
    return {
      status: "error",
      message: "Please enter your name, ASU email, and password.",
    };
  }

  if (!isAngeloEmail(email)) {
    return {
      status: "error",
      message: "Please use a valid @angelo.edu email address.",
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: "Please use a password with at least 8 characters.",
    };
  }

  if (!consentAccepted) {
    return {
      status: "error",
      message: "Please accept the privacy and platform consent to continue.",
    };
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      data: {
        full_name: fullName,
        privacy_consent_accepted: true,
        privacy_consent_version: consentVersion,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    status: "success",
    message:
      "Account created. If your email is already confirmed, you can sign in now. Otherwise, check your ASU email.",
  };
}

export async function signInAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getText(formData, "email").toLowerCase();
  const password = getText(formData, "password");
  const nextPath = getSafeNextPath(getText(formData, "next"));

  if (!email || !password) {
    return {
      status: "error",
      message: "Please enter your email and password.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  redirect(nextPath);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
