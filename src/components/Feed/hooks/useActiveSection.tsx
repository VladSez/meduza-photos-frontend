"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * returns the `active section` id
 * this is needed to highlight the `active date` while scrolling the content
 */
export const useActiveSection = () => {
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
    sections.current = document.querySelectorAll("[data-section]");

    // execute on first mount
    checkActiveDateOnScroll();

    window.addEventListener("scroll", checkActiveDateOnScroll);

    return () => {
      window.removeEventListener("scroll", checkActiveDateOnScroll);
    };
  }, [checkActiveDateOnScroll]);

  return { activeSectionId };
};
