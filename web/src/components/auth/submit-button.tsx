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
      ? "bg-[#003b7a] text-white hover:bg-[#002856] disabled:bg-slate-400"
      : "border border-slate-300 bg-white text-[#002856] hover:bg-[#eef5fb] disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={`flex h-11 w-full items-center justify-center rounded px-4 text-sm font-semibold transition disabled:cursor-not-allowed ${classes}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
