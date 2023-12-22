"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";

import { useArticleInViewport } from "./use-article-in-viewport";

/**
 * A hook that calculates the article (articleId), that is currently in viewport.
 */
export const useCalculateArticleInViewport = () => {
  const { scrollY } = useScroll();

  const ref = useRef<HTMLDivElement & { "data-article-date": string }>(null);

  const {
    articleInViewport,
    setArticleInViewport,
    articleDateInViewport,
    setArticleDateInViewport,
  } = useArticleInViewport();

  if (!scrollY) {
    throw new Error("scrollY is not defined");
  }

  // calculate the article (articleId), that is currently in viewport
  useMotionValueEvent(scrollY, "change", (windowY) => {
    let newAriticleInViewportId: string | null = null;
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
      // get the article (id) that is currently in viewport
      newAriticleInViewportId = ref?.current?.id ?? "";

      // get the article (date) that is currently in viewport
      newArticleDateInViewport =
        ref?.current?.getAttribute("data-article-date") ?? "";
    }

    if (
      newAriticleInViewportId &&
      newAriticleInViewportId !== articleInViewport
    ) {
      setArticleInViewport(newAriticleInViewportId);
    }

    if (
      newArticleDateInViewport &&
      newArticleDateInViewport !== articleDateInViewport
    ) {
      setArticleDateInViewport(newArticleDateInViewport);
    }
  });

  return { ref, articleInViewport, setArticleInViewport };
};
