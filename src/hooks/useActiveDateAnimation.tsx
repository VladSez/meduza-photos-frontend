import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import type { TimelineType } from "@/app/feed/page";

const OFFSET = 40;
const ZERO = 0;

/**
 * `useActiveDateAnimation()` is a custom hook that 'animates'(returns `y` value, for framer motion) the 'active date', while scrolling.
 * @param activeSectionId - the id of the currently active section
 * @param entries - an array of posts
 * @returns an object containing the y offset of the 'active date' element
 */
export const useActiveDateAnimation = ({
  activeSectionId,
  timeline,
}: {
  activeSectionId: number;
  timeline: TimelineType;
}) => {
  const [y, setY] = useState(ZERO);

  useEffect(() => {
    if (!activeSectionId) return;

    const datesByMonth = separateDatesByMonth(timeline);

    const currentActiveDate = timeline.find(
      (entry) => entry.id === activeSectionId
    )?.date;

    const currentActiveMonth = dayjs(currentActiveDate).format("MMMM YYYY");

    // find index of current active date
    const index = datesByMonth?.[currentActiveMonth]?.findIndex(
      (entry) => entry.id === activeSectionId
    );

    if (typeof index !== "number" || index === -1) {
      throw new Error("active date index not found");
    }

    const scrollOffset = index * OFFSET;

    setY(-scrollOffset);
  }, [activeSectionId, timeline, y]);

  return { y };
};
