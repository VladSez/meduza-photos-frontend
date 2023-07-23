"use client";

import { separateDatesByMonth } from "@/utils/separate-dates-by-month";
import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import { useActiveSection } from "./hooks/useActiveSection";
import { useActiveDateScroll } from "./hooks/useActiveDateScroll";
import { PostsSchemaType } from "@/utils/zod-schema";
import { memo } from "react";
import { UseInfiniteQueryResult } from "@tanstack/react-query";

export const Dates = memo(
  ({
    entries,
    page,
  }: {
    entries: PostsSchemaType;
    fetchNextPage: UseInfiniteQueryResult["fetchNextPage"];
  }) => {
    const { activeSectionId } = useActiveSection({ entries });
    const { y } = useActiveDateScroll({
      activeSectionId,
      entries,
    });

    const datesByMonth = separateDatesByMonth(entries);

    return (
      <>
        {Object.entries(datesByMonth).map(([month, entries]) => {
          const isActiveMonth = entries.some(
            ({ id }) => id === Number(activeSectionId)
          );

          // show only months with 'active' dates
          if (!isActiveMonth) {
            return null;
          }

          return (
            <div key={month} className="mx-8 md:my-10">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-lg text-gray-600"
              >
                {month}
              </motion.p>
              {JSON.stringify({ page })}
              <div className="overflow-hidden h-44">
                {entries.map(({ id, date }) => {
                  const isActiveDate = id === Number(activeSectionId);

                  return (
                    <Date
                      key={id}
                      date={date}
                      isActiveDate={isActiveDate}
                      y={y}
                      page={page}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }
);

Dates.displayName = "Dates";

const Date = memo(
  ({
    date,
    isActiveDate = false,
    y,
    page,
  }: {
    date: PostsSchemaType[0]["date"];
    isActiveDate: boolean;
    y: number;
  }) => {
    return (
      <motion.div
        initial={page === 1 ? { opacity: 0 } : false}
        animate={{ y, opacity: 1 }}
        transition={{ type: "spring", mass: 0.5 }}
        className={clsx(
          "my-4",
          isActiveDate ? "text-black font-semibold" : "text-slate-300"
        )}
      >
        {dayjs(date).format("DD MMMM")}
      </motion.div>
    );
  }
);

Date.displayName = "Date";
