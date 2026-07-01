import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BrandMenu } from "./brand-menu";

type BrandHeaderProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  maxWidth?: "max-w-4xl" | "max-w-5xl" | "max-w-6xl";
};

type HeaderProfile = {
  role: "student" | "admin";
};

async function getBrandMenuContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<HeaderProfile>();

  return {
    isAuthenticated: true,
    isAdmin: profile?.role === "admin",
  };
}

export function BrandLogo() {
  return (
    <Link href="/" className="brand-logo-link">
      <span className="brand-logo-mark">
        <Image
          src="/ASU_simple_logo.png"
          alt="Angelo State University logo"
          width={64}
          height={64}
          priority
        />
      </span>
      <span className="brand-logo-text">
        <span>ELLI</span>
        <span>Blogging Platform</span>
      </span>
    </Link>
  );
}

export async function BrandHeader({
  title,
  eyebrow = "Angelo State University",
  subtitle,
  backHref,
  backLabel,
  maxWidth = "max-w-6xl",
}: BrandHeaderProps) {
  const menuContext = await getBrandMenuContext();

  return (
    <header className="brand-header">
      <div className="brand-header-inner">
        <BrandLogo />

        <div className={`brand-header-copy ${maxWidth}`}>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/75">
            {backHref && backLabel ? (
              <>
                <Link href={backHref} className="brand-header-back">
                  {backLabel}
                </Link>
                <span aria-hidden="true" className="text-white/35">
                  /
                </span>
              </>
            ) : null}
            <span>{eyebrow}</span>
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/78 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>

        <BrandMenu {...menuContext} />
      </div>
    </header>
  );
}
