"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Calendar as CalendarIcon, Loader as LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { DayContent } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover } from "@/components/ui/popover";

import { fetchPostByDate } from "@/app/actions/fetch-post-by-date";
import { useFilterDate } from "@/hooks/useFilterDate";
import { cn } from "@/lib/utils";

import { useToast } from "../ui/use-toast";

import type { DayContentProps } from "react-day-picker";

dayjs.extend(utc);

// time in utc
const timeNowInUTC = dayjs().utc();
const localTime = timeNowInUTC.local();

const isLocalDayTheSameAsUTCDay =
  timeNowInUTC.format("DD") === localTime.format("DD");

// time in utc: 14:30 (GMT+2) our timezone
const timeInUTCWhenWeFetchNewPostsInBE = timeNowInUTC
  .clone()
  .set("hour", 12)
  .set("minute", 30);

// first we compare hours (in UTC) within one day, but if it's next day locally and previous day in UTC, we need to compare days
const canUseTodayDate =
  timeNowInUTC.isAfter(timeInUTCWhenWeFetchNewPostsInBE) &&
  isLocalDayTheSameAsUTCDay;

const today = canUseTodayDate
  ? timeNowInUTC.toDate() // today, after 14:30 (GMT+2)
  : timeNowInUTC.subtract(1, "day").toDate(); // previous day

const endDate = dayjs("2022-02-24").toDate();

export function DatePicker() {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = React.useTransition();

  const { filterDate, setFilterDate } = useFilterDate();
  const [openSharePopover, setopenSharePopoverPopover] = React.useState(false);

  return (
    <>
      <Popover
        openPopover={openSharePopover}
        setOpenPopover={setopenSharePopoverPopover}
        trigger={
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !filterDate && "text-muted-foreground"
            )}
            onClick={() => setopenSharePopoverPopover(!openSharePopover)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filterDate ? (
              dayjs(filterDate).format("DD MMMM, YYYY")
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        }
        content={
          <Calendar
            components={{
              DayContent: (props) => (
                <DateTime
                  {...props}
                  isPending={isPending}
                  filterDate={filterDate}
                />
              ),
            }}
            mode="single"
            selected={filterDate}
            defaultMonth={filterDate ?? today}
            onSelect={(date) => {
              setFilterDate(date);

              if (date) {
                startTransition(async () => {
                  const { article } = await fetchPostByDate({
                    date: dayjs(date).format("YYYY/MM/DD"),
                  });

                  if (article?.id) {
                    router.push(`/calendar/${article?.id}`);
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Uh oh! Something went wrong.",
                      description: "There was a problem with your request.",
                    });
                  }
                });
              }
            }}
            initialFocus
            weekStartsOn={1}
            disabled={{ after: today, before: endDate }}
            locale={ru}
            fromDate={endDate}
            toDate={today}
          />
        }
      />
    </>
  );
}

function DateTime(
  props: DayContentProps & { isPending: boolean; filterDate: Date | undefined }
) {
  const dateTime = format(props.date, "yyyy-MM-dd");

  const isActiveDay = dayjs(props.date).isSame(props.filterDate, "day");

  if (props.isPending && isActiveDay) {
    return <LoaderIcon className="h-4 w-4 animate-spin" />;
  }

  return (
    <time dateTime={dateTime}>
      <DayContent {...props} />
    </time>
  );
}
