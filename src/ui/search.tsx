"use client";

import { decode } from "html-entities";
import debounce from "lodash.debounce";
import { Lightbulb, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Highlighter from "react-highlight-words";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";

import { searchPosts } from "@/app/actions/search-posts";
import { cn } from "@/lib/utils";
import { stripHtmlTags } from "@/utils/strip-html-tags";

import { ArticleDate } from "./article-date";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { useToast } from "./use-toast";

import type { MeduzaArticles } from "@prisma/client";

export function Search() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        setOpen((open) => {
          return !open;
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      return document.removeEventListener("keydown", down);
    };
  }, []);

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <SearchTrigger setOpen={setOpen} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <SearchContent close={close} />
      </CommandDialog>
    </>
  );
}

const KeyboardShortcuts = () => {
  return (
    <>
      <span className="text-xs">⌘</span>K
    </>
  );
};

type SearchTriggerProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchTrigger = React.forwardRef<
  React.ElementRef<"button">,
  SearchTriggerProps
>(({ setOpen }, ref) => {
  return (
    <button
      onClick={() => {
        setOpen((open) => {
          return !open;
        });
      }}
      className="relative inline-flex h-8 w-full max-w-[208px] items-center justify-start rounded-md border bg-transparent px-4 py-2 text-sm shadow-sm transition-colors hover:bg-slate-50/50 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
      ref={ref}
    >
      <span className="inline-flex">Поиск...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <KeyboardShortcuts />
      </kbd>
    </button>
  );
});

SearchTrigger.displayName = "SearchTrigger";

type SearchContentProps = {
  close: () => void;
};

const SearchContent = ({ close }: SearchContentProps) => {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<MeduzaArticles[]>([]);
  const [isLoading, setLoading] = React.useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const debouncedChangeHandler = React.useMemo(() => {
    return debounce((search: string) => {
      if (search) {
        setLoading(true);
      }

      searchPosts({ search: search.trim() })
        .then((res) => {
          setResults(res?.results);
        })
        .catch((error) => {
          console.error(error);

          if (error instanceof Error) {
            toast({
              variant: "destructive",
              title: "Ошибка",
              description: `Что-то пошло не так: попробуйте позже.`,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 400);
  }, [toast]);

  React.useEffect(() => {
    if (search) {
      debouncedChangeHandler(search);
    } else {
      debouncedChangeHandler("");
    }
  }, [debouncedChangeHandler, search]);

  const handleChange = (event: string) => {
    setSearch(event);
  };

  return (
    // bug: https://github.com/pacocoursey/cmdk/issues/103
    <Command
      filter={() => {
        return 1;
      }}
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Поиск..."
        autoFocus
        onValueChange={handleChange}
        value={search}
      />

      <ScrollArea
        className={cn("h-[345px] overflow-y-auto rounded-md p-2")}
        type="always"
      >
        <CommandList className="">
          {/* <p className="ml-3 text-xs">Попробуйте поискать:</p> */}
          <div className="space-x-3 space-y-1">
            <Button
              variant={"secondary"}
              className="ml-3 h-[22px] text-xs"
              onClick={() => {
                setSearch("Вчера");
              }}
            >
              Вчера
            </Button>
            <Button
              variant={"secondary"}
              className="h-[22px] text-xs"
              onClick={() => {
                setSearch("Неделю назад");
              }}
            >
              Неделю назад
            </Button>
            <Button
              variant={"secondary"}
              className="h-[22px] text-xs"
              onClick={() => {
                setSearch("Месяц назад");
              }}
            >
              Месяц назад
            </Button>
            <Button
              variant={"secondary"}
              className="h-[22px] text-xs"
              onClick={() => {
                setSearch("Год назад");
              }}
            >
              Год назад
            </Button>
          </div>
          <CommandGroup
            heading={
              <div className="">Результаты: {results?.length ?? ""}</div>
            }
          >
            {isLoading ? null : (
              <CommandEmpty className="min-h-[70px]">
                <div className="">Ничего не найдено</div>
              </CommandEmpty>
            )}
            {isLoading ? (
              <CommandEmpty className="min-h-[70px]">
                <div className="inline-flex items-center text-sm">
                  <Loader className="mr-1.5 animate-spin" size={16} />
                  Загрузка...
                </div>
              </CommandEmpty>
            ) : (
              results?.map((result) => {
                return (
                  <CommandItem
                    className="my-3 space-y-2 px-4 py-3 first:mt-0 last:mb-0"
                    key={result.id}
                    onSelect={() => {
                      close();
                      router.push(`/calendar/${result?.id}`);
                    }}
                  >
                    <div className="mb-2">
                      <div>
                        <Highlighter
                          highlightClassName="bg-yellow-300 font-semibold"
                          unhighlightClassName={`break-words font-semibold text-gray-900 [&>span]:font-light`}
                          searchWords={search?.split(" ") ?? []}
                          autoEscape={true}
                          textToHighlight={stripHtmlTags(
                            decode(result?.header ?? "")
                          )}
                        />
                      </div>
                      <ArticleDate
                        date={result?.dateString}
                        className="text-xs"
                      />
                    </div>
                    <Highlighter
                      highlightClassName="bg-yellow-300 font-semibold"
                      unhighlightClassName={`break-words text-gray-900 [&>span]:font-light`}
                      searchWords={search?.split(" ") ?? []}
                      autoEscape={true}
                      textToHighlight={stripHtmlTags(
                        decode(result?.subtitle ?? "")
                      )}
                    />
                  </CommandItem>
                );
              })
            )}
          </CommandGroup>
        </CommandList>
      </ScrollArea>
      <div className="flex justify-end p-3">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="inline-flex cursor-pointer font-medium text-gray-900 opacity-70 transition-opacity hover:opacity-100">
                <p className="text-xs">Подсказка</p>
                <Lightbulb className="ml-0.5" size={16} />
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>
                <p>
                  Попробуйте ввести дату в поле для поиска в формате
                  &quot;24.02.2022&quot; или &quot;3 недели назад&quot;
                </p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Command>
  );
};
