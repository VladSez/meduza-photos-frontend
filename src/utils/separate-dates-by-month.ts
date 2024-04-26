import dayjs from "dayjs";

import type { TimelineType } from "@/app/feed/page";
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

  /**
   * Iterate over each date and separate them by month.
   * Like:
   * {
   *  "January 2022": [post1, post2],
   *  "February 2022": [post3, post4],
   *  ...etc
   * }
   */
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
