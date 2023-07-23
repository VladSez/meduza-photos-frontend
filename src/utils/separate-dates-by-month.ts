import dayjs from "dayjs";

import { PostsSchemaType } from "./zod-schema";

export const separateDatesByMonth = (dates: PostsSchemaType) => {
  if (!dates) {
    throw new Error("Dates are not defined");
  }

  if (!Array.isArray(dates)) {
    throw new Error("Dates are not an array");
  }

  const datesByMonth: {
    [key: string]: PostsSchemaType;
  } = {};

  dates.forEach((entry) => {
    const month = dayjs(entry?.date).format("MMMM YYYY");

    if (!datesByMonth[month]) {
      datesByMonth[month] = [];
    }

    datesByMonth?.[month]?.push(entry);
  });

  return datesByMonth;
};
