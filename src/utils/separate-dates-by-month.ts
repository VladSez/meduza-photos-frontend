import dayjs from "dayjs";

import type { TimelineType } from "@/components/feed/timeline-async";
import type { PostsSchemaType } from "./zod-schema";

/**
 * Separates an array of dates by month and returns an object with each month as a key and an array of dates as a value.
 */
export const separateDatesByMonth = <T extends TimelineType | PostsSchemaType>(
  dates: T
) => {
  if (!dates) {
    throw new TypeError("Dates are not defined");
  }

  if (!Array.isArray(dates)) {
    throw new TypeError("Dates are not an array");
  }

  const datesByMonth: {
    [key: string]: (T extends Array<infer U> ? U : never)[];
  } = {};

  for (const dateEntry of dates) {
    const month = dayjs(dateEntry?.date).format("MMMM YYYY");

    if (!datesByMonth[month]) {
      datesByMonth[month] = [];
    }

    datesByMonth?.[month]?.push(
      dateEntry as T extends Array<infer U> ? U : never
    );
  }

  return datesByMonth;
};
