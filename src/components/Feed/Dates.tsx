"use client";

import { separateDatesByMonth } from "@/utils/separate-dates-by-month";
import { MeduzaArticles } from "@prisma/client";
import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import { useActiveSection } from "./hooks/useActiveSection";
import { useActiveDateScroll } from "./hooks/useActiveDateScroll";

export const Dates = ({ entries }: { entries: MeduzaArticles[] }) => {
  const { activeSectionId } = useActiveSection();
  const { y } = useActiveDateScroll({ activeSectionId, entries });

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
            <p className="font-semibold text-lg text-gray-600">{month}</p>
            <div className="overflow-hidden h-96">
              {entries.map(({ id, date }) => {
                const isActiveDate = id === Number(activeSectionId);

                return (
                  <Date
                    key={date?.toDateString()}
                    date={date}
                    isActiveDate={isActiveDate}
                    y={y}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Date = ({
  date,
  isActiveDate = false,
  y,
}: {
  date: MeduzaArticles["date"];
  isActiveDate: boolean;
  y: number;
}) => {
  return (
    <motion.div
      key={date?.toDateString()}
      initial={{ opacity: 0 }}
      animate={{ y, opacity: 1 }}
      transition={{ type: "spring" }}
      className={clsx(
        "my-4",
        isActiveDate ? "text-black font-semibold" : "text-slate-300"
      )}
    >
      {dayjs(date).format("DD MMMM")}
    </motion.div>
  );
};
