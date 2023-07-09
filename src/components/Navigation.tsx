"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  {
    href: "/feed",
    label: "Feed",
  },
  {
    href: "/calendar",
    label: "Calendar",
  },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="space-x-3 m-7 fixed top-2 z-10">
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link
            href={href}
            key={href}
            className={clsx(
              `text-xl hover:underline`,
              isActive ? `text-blue-600 font-semibold` : `text-gray-900`
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
