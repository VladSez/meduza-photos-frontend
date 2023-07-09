import { prisma } from "@/lib/prisma";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Calendar() {
  const entries = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
  });

  const datesByMonth = separateDatesByMonth(entries);

  return (
    <>
      <h1 className="text-gray-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white mt-32 mb-10">
        Chronicles of war in Ukraine
      </h1>
      <p className="mt-6 mb-14 text-lg text-gray-500 text-center max-w-3xl mx-auto dark:text-slate-400">
        Photos are from{" "}
        <a
          href="https://meduza.io"
          target="_blank"
          className="text-gray-900 hover:underline"
          rel="noopener"
        >
          meduza.io
        </a>
      </p>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 md:my-14 md:mx-10">
        {Object.entries(datesByMonth).map(([month, entries]) => (
          <div key={month} className="mx-8 md:my-10">
            <h3 className="text-4xl sm:text-5xl font-medium my-6 mb-10 text-gray-900">
              {month}
            </h3>
            <ul>
              {entries.map((entry) => (
                <li key={entry?.id} className={`text-xl text-gray-900 my-1`}>
                  <Link
                    href={`/calendar/${entry.id}`}
                    className="hover:underline"
                  >
                    {dayjs(entry?.date).format("DD MMMM")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </>
  );
}
