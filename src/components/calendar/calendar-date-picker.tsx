"use client";

import { ru } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Calendar as CalendarIcon, Loader as LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { fetchPostByDate } from "@/app/actions/fetch-post-by-date";
import { useFilterDate } from "@/hooks/useFilterDate";
import { cn } from "@/lib/utils";

import { useToast } from "../ui/use-toast";

dayjs.extend(utc);

const today = dayjs().toDate();

export function DatePicker() {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = React.useTransition();

  const { filterDate, setFilterDate } = useFilterDate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !filterDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {filterDate ? (
            dayjs(filterDate).format("DD MMMM, YYYY")
          ) : (
            <span>Выберите дату</span>
          )}
          {isPending ? (
            <LoaderIcon className="ml-auto h-4 w-4 animate-spin" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={filterDate}
          defaultMonth={filterDate ?? today}
          onSelect={(date) => {
            setFilterDate(date);

            if (date) {
              startTransition(async () => {
                const { article } = await fetchPostByDate({
                  date: dayjs(date).utc(true).format("YYYY/MM/DD"),
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
          disabled={{ after: today, before: dayjs("2022-02-24").toDate() }}
          locale={ru}
          styles={{
            caption: { textTransform: "capitalize" },
          }}
          fromDate={dayjs("2022-02-24").toDate()}
          toDate={today}
        />
      </PopoverContent>
    </Popover>
  );
}
