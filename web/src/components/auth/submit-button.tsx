"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  name?: string;
  pendingLabel: string;
  value?: string;
  variant?: "primary" | "secondary";
};

export function SubmitButton({
  children,
  name,
  pendingLabel,
  value,
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const classes =
    variant === "primary"
      ? "bg-[#174a7c] text-white hover:bg-[#10385f] disabled:bg-slate-400"
      : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={`flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed ${classes}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
