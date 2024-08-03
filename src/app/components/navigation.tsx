"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Search } from "@/ui/search";

import { useGlobalErrorAtom } from "@/hooks/use-global-error-context";
import { cn } from "@/lib/utils";

import { ArticleDateNav } from "./article-date-nav";

export const PATHS = {
  feed: "/feed",
  calendar: "/calendar",
} as const;

type Navigation = {
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
] as const satisfies readonly Navigation[];

export function Navigation() {
  const pathname = usePathname();
  const isFeedPage = pathname === PATHS.feed;

  const [globalError] = useGlobalErrorAtom();

  return (
    <>
      <motion.nav className="fixed top-0 z-10 flex w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 w-full items-center">
          <div className="flex w-full flex-col sm:w-[250px]">
            <div
              className={cn(
                "relative bottom-2 space-x-3 px-3 md:px-7 lg:bottom-0",
                // we use 'bottom-2' when <ArticleDateNav /> is shown (to create some space for date), otherwise 'bottom-0'
                { "bottom-0": !isFeedPage || globalError }
              )}
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
            </div>
            <div>
              <ArticleDateNav />
            </div>
          </div>
          <div className="mr-5 w-3/4">
            <Search />
          </div>
        </div>
      </motion.nav>
    </>
  );
}
