import { MeduzaArticles } from "@prisma/client";
import dayjs from "dayjs";

export const separateDatesByMonth = (dates: MeduzaArticles[]) => {
  if (!dates) {
    throw new Error("Dates are not defined");
  }

  if (!Array.isArray(dates)) {
    throw new Error("Dates are not an array");
  }

  const datesByMonth: {
    [key: string]: MeduzaArticles[];
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
