"use client";

import { useActionState } from "react";
import {
  createPostAction,
  type PostFormState,
} from "@/app/dashboard/posts/actions";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: PostFormState = {
  status: "idle",
  message: "",
  values: {
    title: "",
    excerpt: "",
    content: "",
    photoConsent: false,
    publicPostingConsent: false,
  },
};

export function PostEditorForm() {
  const [state, formAction] = useActionState(createPostAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-800">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          minLength={3}
          maxLength={140}
          required
          defaultValue={state.values.title}
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#174a7c] focus:ring-2 focus:ring-[#174a7c]/20"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between gap-3">
          <label
            htmlFor="excerpt"
            className="text-sm font-medium text-slate-800"
          >
            Excerpt
          </label>
          <span className="text-xs text-slate-500">Optional, 220 max</span>
        </div>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          maxLength={220}
          defaultValue={state.values.excerpt}
          className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-[#174a7c] focus:ring-2 focus:ring-[#174a7c]/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium text-slate-800">
          Blog content
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          minLength={20}
          required
          defaultValue={state.values.content}
          className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-[#174a7c] focus:ring-2 focus:ring-[#174a7c]/20"
        />
      </div>

      <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            name="photoConsent"
            type="checkbox"
            defaultChecked={state.values.photoConsent}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#174a7c]"
          />
          <span>
            I confirm that I have permission to include any people or media
            described in this post.
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            name="publicPostingConsent"
            type="checkbox"
            defaultChecked={state.values.publicPostingConsent}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#174a7c]"
          />
          <span>
            I understand this post may become public after CIS staff review and
            approval.
          </span>
        </label>
      </div>

      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton
          name="intent"
          pendingLabel="Saving draft..."
          value="draft"
          variant="secondary"
        >
          Save draft
        </SubmitButton>
        <SubmitButton
          name="intent"
          pendingLabel="Submitting..."
          value="submit"
          variant="primary"
        >
          Submit for review
        </SubmitButton>
      </div>
    </form>
  );
}
