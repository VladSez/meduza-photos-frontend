"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";

import { useArticleDateInViewportAtom } from "./use-article-in-viewport-context";

/**
 * A hook that calculates the article date, that is currently in viewport.
 */
export const useCalculateArticleInViewport = () => {
  const { scrollY } = useScroll();

  const ref = useRef<HTMLDivElement & { "data-article-date": string }>(null);

  const [articleDateInViewport, setArticleDateInViewport] =
    useArticleDateInViewportAtom();

  if (!scrollY) {
    throw new Error("scrollY is not defined");
  }

  // calculate the article date, that is currently in viewport
  useMotionValueEvent(scrollY, "change", (windowY) => {
    let newArticleDateInViewport: string | null = null;

    if (
      typeof ref?.current?.offsetTop !== "number" ||
      typeof ref?.current?.offsetHeight !== "number"
    ) {
      return;
    }

    const sectionOffsetTop = ref?.current?.offsetTop - 200;
    const sectionHeight = ref?.current?.offsetHeight;

    if (
      windowY >= sectionOffsetTop &&
      windowY < sectionOffsetTop + sectionHeight
    ) {
      // get the article (date) that is currently in viewport
      newArticleDateInViewport =
        ref?.current?.getAttribute("data-article-date") ?? "";
    }

    if (
      newArticleDateInViewport &&
      newArticleDateInViewport !== articleDateInViewport
    ) {
      // update the timeline (or header nav on mobile) if the article in viewport has changed
      setArticleDateInViewport(newArticleDateInViewport);
    }
  });

  return { ref, articleDateInViewport, setArticleDateInViewport };
};
