"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { useArticleInViewport } from "@/hooks/useArticleInViewport";

import { PATHS } from "./navigation";

export function ArticleDateNav() {
  const pathname = usePathname();
  const isFeedPage = pathname === PATHS.feed;

  const { articleDateInViewport } = useArticleInViewport();

  const shouldShowArticleDate = isFeedPage && articleDateInViewport;

  if (!isFeedPage) {
    return null;
  }

  return (
    <>
      {shouldShowArticleDate ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 block px-3 md:px-7 lg:hidden"
        >
          {dayjs(articleDateInViewport).format("D MMMM")}
        </motion.span>
      ) : (
        <ArticleDatePlaceHolder />
      )}
    </>
  );
}

const ArticleDatePlaceHolder = () => {
  return (
    <div className="absolute bottom-1 mx-3 h-4 w-28 animate-pulse rounded bg-slate-200 md:mx-7 lg:hidden" />
  );
};
