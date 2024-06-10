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
import { genericErrorToastSonner, toast } from "@/ui/toast";
import { Tooltip, TooltipProvider } from "@/ui/tooltip";

import { fetchLastAvailablePost } from "@/app/actions/fetch-last-available-post";
import { fetchPostByDate } from "@/app/actions/fetch-post-by-date";
import { useSelectedCalendarDateAtom } from "@/hooks/use-filter-date-context";
import { useLastAvailablePostDateAtom } from "@/hooks/use-last-available-date-context";
import { cn } from "@/lib/utils";

import type { DayContentProps } from "react-day-picker";

dayjs.extend(utc);

// the oldest date we have in db
const endDate = dayjs("2022-02-24").toDate();

export function DatePicker() {
  const [lastAvailablePostDate, setLastAvailablePostDate] =
    useLastAvailablePostDateAtom();

  const [selectedCalendarDate, setSelectedCalendarDate] =
    useSelectedCalendarDateAtom();
  const [open, setOpen] = React.useState(false);
  const [isPending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  // fetch last available article from db
  React.useEffect(() => {
    if (open && !lastAvailablePostDate) {
      fetchLastAvailablePost()
        .then(({ mostRecentPostDate }) => {
          if (mostRecentPostDate) {
            setLastAvailablePostDate(dayjs(mostRecentPostDate).toDate());
          }
        })
        .catch((error) => {
          console.error(error);

          if (error instanceof Error) {
            setError(error?.message);

            genericErrorToastSonner();
          }
        });
    }
  }, [lastAvailablePostDate, open, setLastAvailablePostDate]);

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
              !selectedCalendarDate && "text-muted-foreground"
            )}
            onClick={() => {
              setOpen((open) => {
                return !open;
              });
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedCalendarDate ? (
              dayjs(selectedCalendarDate).format(articleDateFormat)
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        }
        content={
          lastAvailablePostDate ? (
            <div className="flex items-center justify-center">
              <Calendar
                data-testid="calendar-date-picker"
                components={{
                  DayContent: (props) => {
                    return (
                      <DateTime
                        {...props}
                        isPending={isPending}
                        selectedCalendarDate={selectedCalendarDate}
                        lastAvailableDate={lastAvailablePostDate}
                      />
                    );
                  },
                }}
                mode="single"
                selected={selectedCalendarDate}
                defaultMonth={selectedCalendarDate ?? lastAvailablePostDate}
                onDayClick={async (date) => {
                  setSelectedCalendarDate(date);

                  if (date) {
                    try {
                      setPending(true);

                      await fetchPostByDate({
                        date: dayjs(date).format("YYYY/MM/DD"),
                      });
                      setOpen(false);
                    } catch (error) {
                      if (error instanceof Error) {
                        toast.error(
                          `Пост от ${dayjs(date).format(
                            articleDateFormat
                          )} не найден`
                        );
                      }
                    } finally {
                      setPending(false);
                    }
                  }
                }}
                initialFocus
                weekStartsOn={1} // Monday as a first day of the week
                disabled={{ after: lastAvailablePostDate, before: endDate }}
                locale={ru}
                fromDate={endDate}
                toDate={lastAvailablePostDate}
              />
            </div>
          ) : error ? (
            <div className="flex h-full min-h-[305.2px] w-full min-w-[276px] items-center justify-center">
              <p className="max-w-[225px]">
                Ошибка: что-то пошло не так, попробуйте позже
              </p>
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
    selectedCalendarDate: Date | undefined;
    lastAvailableDate: Date;
  }
) {
  const dateTime = format(props.date, "yyyy-MM-dd");

  const isSelectedDay = dayjs(props.date).isSame(
    props.selectedCalendarDate,
    "day"
  );

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
          content={<p>Фото за сегодня пока не доступны, попробуй позже</p>}
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
