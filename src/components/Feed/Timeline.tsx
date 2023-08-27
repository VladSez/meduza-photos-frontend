"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { memo } from "react";

import { useActiveDateAnimation } from "@/hooks/useActiveDateAnimation";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import type { TimelineType } from "@/app/feed/page";
import type { PostsSchemaType } from "@/utils/zod-schema";

export const Timeline = memo(function Timeline({
  articleInViewportId,
  timeline,
}: {
  page: number;
  articleInViewportId: number;
  timeline: TimelineType;
}) {
  const datesByMonth = Object.entries(separateDatesByMonth(timeline));

  return (
    <>
      {datesByMonth.map(([month, days]) => {
        // check if there are any 'active' dates in this month
        const isActiveMonth = days.some(
          ({ id }) => id === Number(articleInViewportId)
        );

        // show only months with 'active' dates
        if (!isActiveMonth) {
          return null;
        }

        return (
          <div key={month} className="min-w-[200px]">
            <div className="mx-8 md:my-10">
              <motion.p
                animate={{ opacity: 1 }}
                className="text-lg font-semibold capitalize text-gray-600"
              >
                {month}
              </motion.p>

              <div className="relative h-44 overflow-hidden">
                <MonthDays
                  days={days}
                  articleInViewportId={articleInViewportId}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
});

const MonthDays = memo(function MonthDays({
  days,
  articleInViewportId,
}: {
  days: TimelineType;
  articleInViewportId: number;
}) {
  const { y } = useActiveDateAnimation({
    articleInViewportId,
    timeline: days,
  });

  return (
    <>
      {days.map(({ id, date }) => {
        const isActiveDate = id === Number(articleInViewportId);

        return <Date key={id} date={date} isActiveDate={isActiveDate} y={y} />;
      })}
    </>
  );
});

const Date = memo(function Date({
  date,
  isActiveDate = false,
  y,
}: {
  date: PostsSchemaType[0]["date"];
  isActiveDate: boolean;
  y: number;
}) {
  return (
    <motion.div
      animate={{ y }}
      transition={{ type: "spring", mass: 0.5 }}
      className={clsx(
        "my-4",
        isActiveDate ? "font-semibold text-black" : "text-slate-300"
      )}
    >
      {dayjs(date).format("D MMMM")}
    </motion.div>
  );
});
