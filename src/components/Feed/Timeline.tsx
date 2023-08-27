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
  activeSectionId,
  timeline,
}: {
  page: number;
  activeSectionId: number;
  timeline: TimelineType;
}) {
  const datesByMonth = Object.entries(separateDatesByMonth(timeline));

  return (
    <>
      {datesByMonth.map(([month, entries]) => {
        const isActiveMonth = entries.some(
          ({ id }) => id === Number(activeSectionId)
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
                  timeline={entries}
                  activeSectionId={activeSectionId}
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
  timeline,
  activeSectionId,
}: {
  timeline: TimelineType;
  activeSectionId: number;
}) {
  const { y } = useActiveDateAnimation({
    activeSectionId,
    timeline,
  });

  return (
    <>
      {timeline.map(({ id, date }) => {
        const isActiveDate = id === Number(activeSectionId);

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
