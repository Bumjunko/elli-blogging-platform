"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BrandMenuProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

type BrandMenuItem = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
};

function getMenuItems({
  isAuthenticated,
  isAdmin,
}: BrandMenuProps): BrandMenuItem[] {
  const items: BrandMenuItem[] = [
    {
      href: "/",
      label: "Home",
      match: (pathname) => pathname === "/",
    },
    {
      href: "/blog",
      label: "ELLI Student Blog",
      match: (pathname) => pathname.startsWith("/blog"),
    },
  ];

  if (isAuthenticated) {
    items.push({
      href: "/dashboard",
      label: "Dashboard",
      match: (pathname) => pathname.startsWith("/dashboard"),
    });
  }

  if (isAdmin) {
    items.push({
      href: "/admin",
      label: "Admin Review",
      match: (pathname) => pathname.startsWith("/admin"),
    });
  }

  if (!isAuthenticated) {
    items.push(
      {
        href: "/login",
        label: "Sign In",
        match: (pathname) => pathname.startsWith("/login"),
      },
      {
        href: "/signup",
        label: "Sign Up",
        match: (pathname) => pathname.startsWith("/signup"),
      },
    );
  }

  return items;
}

export function BrandMenu({ isAuthenticated, isAdmin }: BrandMenuProps) {
  const pathname = usePathname();
  const menuItems = getMenuItems({ isAuthenticated, isAdmin });

  return (
    <details className="brand-menu">
      <summary className="brand-menu-button">
        <span>Menu</span>
        <span className="brand-menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>
      <div className="brand-menu-panel">
        <nav aria-label="Primary navigation">
          {menuItems.map((item) => {
            const isActive = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`brand-menu-item ${isActive ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </details>
  );
}
