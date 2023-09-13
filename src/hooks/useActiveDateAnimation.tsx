"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import type { TimelineType } from "@/app/feed/page";

const OFFSET = 40;
const ZERO = 0;

/**
 * `useActiveDateAnimation()` is a custom hook that 'animates'(returns `y` value, for framer motion) the 'active date', while scrolling.
 * @param articleInViewportId - the id of the currently active section
 * @param entries - an array of posts
 * @returns an object containing the y offset of the 'active date' element
 */
export const useActiveDateAnimation = ({
  articleInViewportId,
  timeline,
}: {
  articleInViewportId: number;
  timeline: TimelineType;
}) => {
  const [y, setY] = useState(-ZERO);

  useEffect(() => {
    if (!articleInViewportId) return;

    const datesByMonth = separateDatesByMonth(timeline);

    const currentActiveDate = timeline.find(
      (entry) => entry.id === articleInViewportId
    )?.date;

    const currentActiveMonth = dayjs(currentActiveDate).format("MMMM YYYY");

    // find index of the current active date in 'active' month
    const index =
      datesByMonth?.[currentActiveMonth]?.findIndex(
        (entry) => entry.id === articleInViewportId
      ) ?? 0;

    const scrollOffset = index * OFFSET;

    setY(-scrollOffset);
  }, [articleInViewportId, timeline, y]);

  return { y };
};
