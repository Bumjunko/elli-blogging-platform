"use client";

import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "@/app/auth/actions";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: AuthFormState = {
  message: "",
  status: "idle",
};

export function SignupForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-slate-800">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#174a7c] focus:ring-2 focus:ring-[#174a7c]/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-800">
          ASU email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@angelo.edu"
          required
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#174a7c] focus:ring-2 focus:ring-[#174a7c]/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-800">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#174a7c] focus:ring-2 focus:ring-[#174a7c]/20"
        />
      </div>

      <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
        <input
          name="privacyConsent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#174a7c]"
        />
        <span>
          I understand this platform is for moderated ELLI blog submissions and
          agree to the privacy and platform-use consent for this prototype.
        </span>
      </label>

      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton pendingLabel="Creating account...">Create account</SubmitButton>
    </form>
  );
}
