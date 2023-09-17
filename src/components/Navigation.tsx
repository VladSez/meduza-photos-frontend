"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useArticleInViewport } from "@/hooks/useArticleInViewport";

const PATHS = {
  feed: "/feed",
  calendar: "/calendar",
} as const;

type NAVIGATION = {
  href: string;
  label: string;
};

const NAV_LINKS = [
  {
    href: PATHS.feed,
    label: "Лента",
  },
  {
    href: PATHS.calendar,
    label: "Календарь",
  },
] as const satisfies Readonly<NAVIGATION[]>;

export function Navigation() {
  const pathname = usePathname();

  const isFeedPage = pathname === PATHS.feed;

  const { articleDateInViewport } = useArticleInViewport();

  return (
    <motion.nav className="fixed top-2 z-10 mx-3 my-7 md:mx-7">
      <div className="space-x-3">
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
      </div>

      {isFeedPage && articleDateInViewport ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-0 block lg:hidden"
        >
          {dayjs(articleDateInViewport).format("D MMMM")}
        </motion.span>
      ) : null}
    </motion.nav>
  );
}
