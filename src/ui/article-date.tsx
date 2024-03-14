import dayjs from "dayjs";

import { cn } from "@/lib/utils";

export function ArticleDate({
  date,
  className,
}: {
  date: string | undefined | null;
  className?: string;
}) {
  if (!date) {
    return null;
  }

  return (
    <time dateTime={new Date(date).toISOString()} className={cn("", className)}>
      {dayjs(date).format("DD MMMM YYYY")}
    </time>
  );
}
