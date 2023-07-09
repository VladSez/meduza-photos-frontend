"use client";

import { separateDatesByMonth } from "@/utils/separate-dates-by-month";
import { MeduzaArticles } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

/**
 * `useActiveDateScroll()` is used to animate the 'active date' while scrolling
 * @param activeSectionId
 * @param entries
 * @returns y - the y offset of the 'active date' element
 *
 */
export const useActiveDateScroll = ({
  activeSectionId,
  entries,
}: {
  activeSectionId: string;
  entries: MeduzaArticles[];
}) => {
  const [y, setY] = useState(0);

  const datesByMonth = separateDatesByMonth(entries);

  useEffect(() => {
    if (!activeSectionId) return;

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
  }, [activeSectionId, datesByMonth, entries]);

  return { y };
};
