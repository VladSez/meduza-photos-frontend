"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Calendar as CalendarIcon, LoaderIcon } from "lucide-react";
import * as React from "react";
import { DayContent } from "react-day-picker";

import { articleDateFormat } from "@/ui/article-date";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Popover } from "@/ui/popover";
import { Tooltip, TooltipProvider } from "@/ui/tooltip";

import { fetchLastAvailablePost } from "@/app/actions/fetch-last-available-post";
import { fetchPostByDate } from "@/app/actions/fetch-post-by-date";
import { useFilterDateContext } from "@/hooks/use-filter-date-context";
import { cn } from "@/lib/utils";
import { toastGenericError } from "@/utils/toast-generic-error";

import { useToast } from "../../../ui/use-toast";

import type { DayContentProps } from "react-day-picker";

dayjs.extend(utc);

// the oldest date we have in db
const endDate = dayjs("2022-02-24").toDate();

export function DatePicker() {
  const { toast } = useToast();

  const { filterDate, setFilterDate } = useFilterDateContext();
  const [open, setOpen] = React.useState(false);

  const [isPending, setPending] = React.useState(false);

  const [lastAvailableDate, setLastAvailableDate] = React.useState<Date>();
  const [error, setError] = React.useState("");

  // fetch last available article from db
  React.useEffect(() => {
    if (open) {
      fetchLastAvailablePost()
        .then(({ mostRecentPost }) => {
          if (mostRecentPost) {
            setLastAvailableDate(dayjs(mostRecentPost.dateString).toDate());
          }
        })
        .catch((error) => {
          console.error(error);

          if (error instanceof Error) {
            setError(error?.message);

            toast(toastGenericError);
          }
        });
    }
  }, [open, toast]);

  return (
    <>
      <Popover
        open={open}
        setOpen={setOpen}
        trigger={
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !filterDate && "text-muted-foreground"
            )}
            onClick={() => {
              setOpen((open) => {
                return !open;
              });
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filterDate ? (
              dayjs(filterDate).format(articleDateFormat)
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        }
        content={
          lastAvailableDate ? (
            <div className="flex items-center justify-center">
              <Calendar
                data-testid="calendar-date-picker"
                components={{
                  DayContent: (props) => {
                    return (
                      <DateTime
                        {...props}
                        isPending={isPending}
                        filterDate={filterDate}
                        lastAvailableDate={lastAvailableDate}
                      />
                    );
                  },
                }}
                mode="single"
                selected={filterDate}
                defaultMonth={filterDate ?? lastAvailableDate}
                onDayClick={async (date) => {
                  setFilterDate(date);

                  if (date) {
                    try {
                      setPending(true);

                      console.info("client", {
                        date,
                        iso: dayjs(date).toISOString(),
                        utc: dayjs(date).utc().format(),
                      });
                      await fetchPostByDate({
                        // date: dayjs(date).toISOString(),
                        date: dayjs(date).utc().toISOString(),
                      });
                    } catch (error) {
                      if (error instanceof Error) {
                        toast({
                          variant: "destructive",
                          title: "Ошибка",
                          description: `Пост от ${dayjs(date).format(articleDateFormat)} не найден`,
                        });
                      }
                    } finally {
                      setPending(false);
                      setOpen(false);
                    }
                  }
                }}
                initialFocus
                weekStartsOn={1} // Monday as a first day of the week
                disabled={{ after: lastAvailableDate, before: endDate }}
                locale={ru}
                fromDate={endDate}
                toDate={lastAvailableDate}
              />
            </div>
          ) : error ? (
            <div className="flex h-full min-h-[305.2px] w-full min-w-[276px] items-center justify-center">
              Ошибка: что-то пошло не так, попробуйте позже
            </div>
          ) : (
            <div className="flex h-full min-h-[305.2px] w-full min-w-[276px] items-center justify-center">
              <LoaderIcon className="h-4 w-4 animate-spin" />
            </div>
          )
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

  // show loader only for selected day (when user clicks on it)
  if (props.isPending && isSelectedDay) {
    return <LoaderIcon className="h-4 w-4 animate-spin" />;
  }

  const now = dayjs();
  const calendarTodayDate = dayjs(props.date).isSame(now, "day");

  const lastEnabledDayIsToday = dayjs(props.date).isSame(
    props.lastAvailableDate,
    "day"
  );

  // https://console.cron-job.org/jobs/4416660/history
  const timeWhenWeFetchNewData = dayjs().utc().set("hour", 13).set("minute", 0);

  const localTimeFormat = timeWhenWeFetchNewData.local().format("HH:mm");
  const utcTimeFormat = timeWhenWeFetchNewData.format("HH:mm");

  // show tooltip, when data for today is not available yet
  if (calendarTodayDate && !lastEnabledDayIsToday) {
    return (
      <TooltipProvider>
        <Tooltip
          trigger={
            <time
              dateTime={dateTime}
              className="flex h-full w-full items-center justify-center"
            >
              <div>
                <DayContent {...props} />
              </div>
            </time>
          }
          content={
            <p>
              Новые фото должны быть доступны сегодня после{" "}
              {/* We show times in both local and utc format for better ux */}
              {localTimeFormat} ({utcTimeFormat} UTC)
            </p>
          }
        />
      </TooltipProvider>
    );
  }

  return (
    <time dateTime={dateTime}>
      <DayContent {...props} />
    </time>
  );
}
