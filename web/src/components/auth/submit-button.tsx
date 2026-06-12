"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
};

export function SubmitButton({ children, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 w-full items-center justify-center rounded-md bg-[#174a7c] px-4 text-sm font-semibold text-white transition hover:bg-[#10385f] disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
