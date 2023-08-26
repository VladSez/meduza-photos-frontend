"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  {
    href: "/feed",
    label: "Лента",
  },
  {
    href: "/calendar",
    label: "Календарь",
  },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="fixed top-2 z-10 mx-3 my-7 space-x-3 md:mx-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link
            href={href}
            key={href}
            className={clsx(
              `text-xl hover:underline`,
              isActive ? `font-semibold text-blue-600` : `text-gray-900`
            )}
          >
            {label}
          </Link>
        );
      })}
    </motion.nav>
  );
}
