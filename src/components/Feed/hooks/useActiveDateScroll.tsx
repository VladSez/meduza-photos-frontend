"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { separateDatesByMonth } from "@/utils/separate-dates-by-month";
import { PostsSchemaType } from "@/utils/zod-schema";

/**
 * `useActiveDateScroll()` is a custom hook that animates the 'active date' while scrolling.
 * @param activeSectionId - the id of the currently active section
 * @param entries - an array of posts
 * @returns an object containing the y offset of the 'active date' element
 */
export const useActiveDateScroll = ({
  activeSectionId,
  entries,
}: {
  activeSectionId: string;
  entries: PostsSchemaType;
}) => {
  const [y, setY] = useState(0);

  useEffect(() => {
    if (!activeSectionId) return;

    const datesByMonth = separateDatesByMonth(entries);

    const currentActiveDate = entries.find(
      (entry) => entry.id === Number(activeSectionId)
    )?.date;

    const currentActiveMonth = dayjs(currentActiveDate).format("MMMM YYYY");

    // find index of current active date
    const index = datesByMonth?.[currentActiveMonth]?.findIndex(
      (entry) => entry.id === Number(activeSectionId)
    );

    if (typeof index !== "number" || index === -1) {
      throw new Error("active date index not found");
    }

    const offset = 40;

    const scrollOffset = index * offset;

    const startOfMonth = index === 0;

    setY(startOfMonth ? 0 : -scrollOffset);
  }, [activeSectionId, entries]);

  return { y };
};
