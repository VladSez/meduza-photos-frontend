"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Calendar as CalendarIcon, Loader as LoaderIcon } from "lucide-react";
import * as React from "react";
import { DayContent } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// if data for a new day (in UTC) is not available yet, we need to use previous day
const lastAvailableDate = canUseTodayDate
  ? timeNowInUTC.toDate() // today, after 14:30 (GMT+2)
  : timeNowInUTC.subtract(1, "day").toDate(); // previous day

const endDate = dayjs("2022-02-24").toDate();

export function DatePicker() {
  const { toast } = useToast();

  const { filterDate, setFilterDate } = useFilterDate();
  const [openPopover, setOpenPopover] = React.useState(false);

  const [isPending, setPending] = React.useState(false);

  return (
    <>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        trigger={
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !filterDate && "text-muted-foreground"
            )}
            onClick={() => setOpenPopover(!openPopover)}
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
                  lastAvailableDate={lastAvailableDate}
                />
              ),
            }}
            mode="single"
            selected={filterDate}
            defaultMonth={filterDate ?? lastAvailableDate}
            onSelect={async (date) => {
              setFilterDate(date);

              if (date) {
                try {
                  setPending(true);

                  await fetchPostByDate({
                    date: dayjs(date).format("YYYY/MM/DD"),
                  });
                } catch (e) {
                  if (e instanceof Error) {
                    toast({
                      variant: "destructive",
                      title: "Ошибка",
                      description: `Что-то пошло не так: попробуйте позже.`,
                    });
                  }
                } finally {
                  setPending(false);
                  setOpenPopover(false);
                }
              }
            }}
            initialFocus
            weekStartsOn={1}
            disabled={{ after: lastAvailableDate, before: endDate }}
            locale={ru}
            fromDate={endDate}
            toDate={lastAvailableDate}
          />
        }
      />
    </>
  );
}

function DateTime(
  props: DayContentProps & {
    isPending: boolean;
    filterDate: Date | undefined;
    lastAvailableDate: Date;
  }
) {
  const dateTime = format(props.date, "yyyy-MM-dd");

  const isSelectedDay = dayjs(props.date).isSame(props.filterDate, "day");

  const now = dayjs();
  // calendar date can differ from our 'lastAvailableDate' (we use previous day, when data for today is not available yet, we fetch new data at 12:30 UTC)
  const calendarTodayDate = dayjs(props.date).isSame(now, "day");

  const lastEnabledDayIsToday = dayjs(props.date).isSame(
    props.lastAvailableDate,
    "day"
  );

  // we set time to 12:30 UTC, because we fetch new data at 12:30 UTC
  // and then convert to local time (for user convenience)
  const convertUTCtoLocalTime = dayjs()
    .utc()
    .set("hour", 12)
    .set("minute", 30)
    .local();

  // show loader only for selected day (when user clicks on it)
  if (props.isPending && isSelectedDay) {
    return <LoaderIcon className="h-4 w-4 animate-spin" />;
  }

  // show tooltip, when data for today is not available yet
  if (calendarTodayDate && !lastEnabledDayIsToday) {
    return (
      <time dateTime={dateTime}>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>
                <DayContent {...props} />
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>
                <p>
                  Новые фото будут доступны сегодня после{" "}
                  {convertUTCtoLocalTime.format("HH:mm")} (12:30 UTC)
                </p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      </time>
    );
  }

  return (
    <time dateTime={dateTime}>
      <DayContent {...props} />
    </time>
  );
}
