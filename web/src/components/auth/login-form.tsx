"use client";

import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/app/auth/actions";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: AuthFormState = {
  message: "",
  status: "idle",
};

type LoginFormProps = {
  message?: string;
  nextPath: string;
};

export function LoginForm({ message, nextPath }: LoginFormProps) {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#003b7a] focus:ring-2 focus:ring-[#003b7a]/20"
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
          autoComplete="current-password"
          required
          className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#003b7a] focus:ring-2 focus:ring-[#003b7a]/20"
        />
      </div>

      {message ? (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {message}
        </p>
      ) : null}

      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}

      <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>
    </form>
  );
}
