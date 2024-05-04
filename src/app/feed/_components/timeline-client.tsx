"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { memo } from "react";

import { useActiveDateAnimation } from "@/hooks/use-active-date-animation";
import { useArticleDateInViewportAtom } from "@/hooks/use-article-in-viewport-context";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import type { PostsSchemaType } from "@/utils/zod-schema";
import type { TimelineType } from "../page";

export const TimelineClient = memo(function Timeline({
  timeline,
}: {
  timeline: TimelineType;
}) {
  const [articleDateInViewport] = useArticleDateInViewportAtom();

  const datesByMonth = Object.entries(separateDatesByMonth(timeline));

  return (
    <>
      <div className="fixed top-20">
        {datesByMonth.map(([month, days]) => {
          // check if there are any 'active' dates in this month
          const isActiveMonth = days.some(({ date }) => {
            const isoDateString = dayjs(date).toISOString();

            return isoDateString === articleDateInViewport;
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
              articleDateInViewport={articleDateInViewport}
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
  articleDateInViewport,
}: {
  days: TimelineType;
  articleDateInViewport: string | null;
  month: string;
}) => {
  return (
    <motion.div
      key={month}
      className="min-w-[200px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-testid="timeline-month-with-days"
    >
      <div className="mx-8 md:my-10">
        <motion.p className="text-lg font-semibold capitalize text-gray-600">
          {month}
        </motion.p>

        <div className="relative h-44 overflow-hidden">
          <Days days={days} articleDateInViewport={articleDateInViewport} />
        </div>
      </div>
    </motion.div>
  );
};

const Days = memo(function Days({
  days,
  articleDateInViewport,
}: {
  days: TimelineType;
  articleDateInViewport: string | null;
}) {
  const { y } = useActiveDateAnimation({
    articleDateInViewport,
    timeline: days,
  });

  return (
    <>
      {days.map(({ id, date }) => {
        const isActiveDate =
          dayjs(date).toISOString() === articleDateInViewport;

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

// TODO: experiment with the refactored timeline logic:
// "use client";

// import clsx from "clsx";
// import dayjs from "dayjs";
// import { motion } from "framer-motion";
// import { memo } from "react";

// import { useActiveDateAnimation } from "@/hooks/use-active-date-animation";
// import { useArticleInViewportContext } from "@/hooks/use-article-in-viewport-context";
// import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

// import type { PostsSchemaType } from "@/utils/zod-schema";
// import type { TimelineType } from "./timeline-server";

// export const TimelineClient = memo(function Timeline({
//   timeline,
//   mostRecentArticleId,
// }: {
//   timeline: TimelineType;
//   mostRecentArticleId: number;
// }) {
//   const { articleInViewport } = useArticleInViewportContext();
//   const articleInViewportId = articleInViewport || mostRecentArticleId;

//   const datesByMonth = Object.entries(separateDatesByMonth(timeline));

//   const lastMonth = datesByMonth?.[0];
//   const lastMonthStr = lastMonth?.[0];
//   const lastMonthDays = lastMonth?.[1];

//   return (
//     <>
//       <div className="fixed top-20">
//         {JSON.stringify({ articleInViewportId, mostRecentArticleId }, null, 2)}

//         {articleInViewportId ? null : (
//           <motion.div
//             key={lastMonthStr}
//             className="min-w-[200px]"
//             // initial={{ opacity: 0 }}
//             // animate={{ opacity: 1 }}
//             data-testid="timeline-month-with-days"
//           >
//             <div className="mx-8 md:my-10">
//               <motion.p className="text-lg font-semibold capitalize text-gray-600">
//                 {lastMonthStr}
//               </motion.p>

//               <div className="relative h-44 overflow-hidden">
//                 <Days
//                   days={lastMonthDays}
//                   articleInViewportId={articleInViewportId}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {articleInViewportId
//           ? datesByMonth.map(([month, days]) => {
//               // check if there are any 'active' dates in this month
//               const isActiveMonth = days.some(({ id }) => {
//                 return id === Number(articleInViewportId);
//               });

//               if (!isActiveMonth) {
//                 return null;
//               }

//               return (
//                 <MonthWithDays
//                   key={month}
//                   month={month}
//                   days={days}
//                   articleInViewportId={Number(articleInViewportId)}
//                 />
//               );
//             })
//           : null}
//       </div>
//     </>
//   );
// });

// const MonthWithDays = ({
//   month,
//   days,
//   articleInViewportId,
// }: {
//   days: TimelineType;
//   articleInViewportId: number;
//   month: string;
// }) => {
//   return (
//     <motion.div
//       key={month}
//       className="min-w-[200px]"
//       // initial={{ opacity: 0 }}
//       // animate={{ opacity: 1 }}
//       // initial={{ opacity: 1 }}
//       // animate={{ opacity: 1 }}
//       // exit={{ opacity: 0 }}
//       data-testid="timeline-month-with-days"
//     >
//       <div className="mx-8 md:my-10">
//         <motion.p className="text-lg font-semibold capitalize text-gray-600">
//           {month}
//         </motion.p>

//         <div className="relative h-44 overflow-hidden">
//           <Days days={days} articleInViewportId={articleInViewportId} />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const Days = memo(function Days({
//   days,
//   articleInViewportId,
// }: {
//   days: TimelineType;
//   articleInViewportId: number;
// }) {
//   const { y } = useActiveDateAnimation({
//     articleInViewportId,
//     timeline: days,
//   });

//   return (
//     <>
//       {days.map(({ id, date }) => {
//         const isActiveDate = id === articleInViewportId;

//         return <Day key={id} date={date} isActiveDate={isActiveDate} y={y} />;
//       })}
//     </>
//   );
// });

// const Day = memo(function Day({
//   date,
//   isActiveDate = false,
//   y,
// }: {
//   date: PostsSchemaType[0]["date"];
//   isActiveDate: boolean;
//   y: number;
// }) {
//   return (
//     <motion.div
//       animate={{ y }}
//       transition={{ type: "spring", mass: 0.5 }}
//       className={clsx(
//         "my-4",
//         isActiveDate ? "font-semibold text-black" : "text-slate-300"
//       )}
//     >
//       {dayjs(date).format("D MMMM")}
//     </motion.div>
//   );
// });
