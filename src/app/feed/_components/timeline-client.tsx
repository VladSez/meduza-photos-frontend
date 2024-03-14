"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { memo } from "react";

import { useActiveDateAnimation } from "@/hooks/use-active-date-animation";
import { useArticleInViewport } from "@/hooks/use-article-in-viewport";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import type { PostsSchemaType } from "@/utils/zod-schema";
import type { TimelineType } from "./timeline-server";

export const TimelineClient = memo(function Timeline({
  timeline,
}: {
  timeline: TimelineType;
}) {
  const { articleInViewport } = useArticleInViewport();
  const articleInViewportId = Number(articleInViewport);

  const datesByMonth = Object.entries(separateDatesByMonth(timeline));

  return (
    <>
      <div className="fixed top-20">
        {datesByMonth.map(([month, days]) => {
          // check if there are any 'active' dates in this month
          const isActiveMonth = days.some(({ id }) => {
            return id === Number(articleInViewportId);
          });

          // show only months with 'active' dates
          if (!isActiveMonth) {
            return null;
          }

          return (
            <MonthWithDays
              key={month}
              month={month}
              days={days}
              articleInViewportId={articleInViewportId}
            />
          );
        })}
      </div>
    </>
  );
});

const MonthWithDays = ({
  month,
  days,
  articleInViewportId,
}: {
  days: TimelineType;
  articleInViewportId: number;
  month: string;
}) => {
  return (
    <motion.div
      key={month}
      className="min-w-[200px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-8 md:my-10">
        <motion.p className="text-lg font-semibold capitalize text-gray-600">
          {month}
        </motion.p>

        <div className="relative h-44 overflow-hidden">
          <Days days={days} articleInViewportId={articleInViewportId} />
        </div>
      </div>
    </motion.div>
  );
};

const Days = memo(function Days({
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

        return <Day key={id} date={date} isActiveDate={isActiveDate} y={y} />;
      })}
    </>
  );
});

const Day = memo(function Day({
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
