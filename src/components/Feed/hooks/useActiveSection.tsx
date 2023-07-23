"use client";

import { PostsSchemaType } from "@/utils/zod-schema";
import throttle from "lodash.throttle";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * returns the `active section` id
 * this is needed to highlight the `active date` while scrolling the content
 */
export const useActiveSection = ({ entries }: { entries: PostsSchemaType }) => {
  const sections = useRef<NodeListOf<HTMLElement>>();
  const [activeSectionId, setActiveSectionId] = useState("");

  const checkActiveDateOnScroll = useCallback(() => {
    const pageYOffset = window.scrollY;
    let newActiveSectionId: string | null = null;

    sections?.current?.forEach((section) => {
      const sectionOffsetTop = section?.offsetTop - 200;
      const sectionHeight = section?.offsetHeight;

      if (
        pageYOffset >= sectionOffsetTop &&
        pageYOffset < sectionOffsetTop + sectionHeight
      ) {
        newActiveSectionId = section.id;
      }
    });

    if (newActiveSectionId && activeSectionId !== newActiveSectionId) {
      setActiveSectionId(newActiveSectionId);
    }
  }, [activeSectionId]);

  // highlight `active date` on scroll
  useEffect(() => {
    // we re-execute this useEffect, when we do pagination page 1 -> page 2
    const noDataAvailable = !sections?.current?.length;
    const hasNewData = sections.current?.length !== entries.length;

    if (noDataAvailable || hasNewData) {
      sections.current = document.querySelectorAll("[data-section]");
    }

    // execute only first mount (on init mount, we don't scroll)
    if (noDataAvailable) {
      checkActiveDateOnScroll();
    }

    window.addEventListener("scroll", throttle(checkActiveDateOnScroll, 250));

    return () => {
      window.removeEventListener("scroll", checkActiveDateOnScroll);
    };
  }, [checkActiveDateOnScroll, entries]);

  return { activeSectionId, sections };
};
