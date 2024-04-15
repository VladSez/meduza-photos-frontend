"use client";

import { useDebouncedCallback, useLocalStorage } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { decode } from "html-entities";
import { X as DeleteIcon, Lightbulb, Loader } from "lucide-react";
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
import { Tooltip, TooltipProvider } from "@/ui/tooltip";

import { searchPosts } from "@/app/actions/search-posts";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { stripHtmlTags } from "@/utils/strip-html-tags";

import { ArticleDate } from "./article-date";
import { Button } from "./button";
import { Popover } from "./popover";
import { ScrollArea } from "./scroll-area";
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

export const SEARCH_TERMS = [
  "Вчера",
  "Неделю назад",
  "Месяц назад",
  "Год назад",
] as const;

type SearchContentProps = {
  close: () => void;
};

const SearchContent = ({ close }: SearchContentProps) => {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<MeduzaArticles[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  const [localStorageValue, setLocalStorageValue] = useLocalStorage<
    { text: string; id: string }[]
  >({
    key: "previous-search-queries",
    defaultValue: [],
  });

  const { toast } = useToast();

  const router = useRouter();

  const { isMobile } = useMediaQuery();

  // https://mantine.dev/hooks/use-debounced-callback/
  const debouncedHandleSearch = useDebouncedCallback((searchQuery: string) => {
    searchPosts({ search: searchQuery })
      .then((res) => {
        if (res?.results?.length > 0) {
          // Add search query to localStorage
          setLocalStorageValue((prevSearchQueries) => {
            const isDuplicate = prevSearchQueries.some((item) => {
              return item.text.toLowerCase() === searchQuery.toLowerCase();
            });

            if (!isDuplicate && searchQuery.length > 0) {
              return [
                ...prevSearchQueries,
                { text: searchQuery, id: Date.now().toString() },
              ];
            }
            return prevSearchQueries;
          });
        }

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
  }, 800);

  React.useEffect(() => {
    if (search) {
      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        setLoading(true);
      }

      debouncedHandleSearch(trimmedSearch);
    } else {
      debouncedHandleSearch("");
    }
  }, [debouncedHandleSearch, search]);

  const handleChange = (searchQuery: string) => {
    setSearch(searchQuery);
  };

  const noHistorySaved = localStorageValue?.length === 0;

  const canShowHistory =
    localStorageValue?.length > 0 && !search.trim() && results?.length === 0;

  return (
    // bug: https://github.com/pacocoursey/cmdk/issues/103
    <TooltipProvider>
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
          data-testid="search-input"
        />

        <ScrollArea
          className={cn("h-[345px] overflow-y-auto rounded-md p-2")}
          type="always"
        >
          <CommandList className="">
            <div className="space-x-3 space-y-1.5">
              {SEARCH_TERMS.map((chip) => {
                return (
                  <Button
                    disabled={isLoading}
                    key={chip}
                    variant={"secondary"}
                    className="ml-3 h-[22px] text-xs"
                    onClick={() => {
                      setSearch(chip);
                    }}
                  >
                    {chip}
                  </Button>
                );
              })}
            </div>
            <CommandGroup
              heading={
                canShowHistory || isLoading ? undefined : (
                  <div className="">Результаты: {results?.length ?? ""}</div>
                )
              }
            >
              {isLoading ? null : (
                <CommandEmpty className="min-h-[70px]">
                  <div className="ml-1 flex w-[99%] flex-col">
                    {canShowHistory ? (
                      <div className="flex flex-col items-start space-y-2">
                        <p className="mb-2 ml-0.5 text-xs font-medium">
                          История:
                        </p>
                        <AnimatePresence initial={false} mode="popLayout">
                          {localStorageValue?.map((item, index) => {
                            return (
                              <motion.div
                                key={item.id}
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{
                                  opacity: { duration: 0.2 },
                                }}
                                className="flex w-full flex-row flex-nowrap items-center"
                              >
                                <Tooltip
                                  trigger={
                                    <Button
                                      data-testid={`apply-history-search-query-${index}`}
                                      size="sm"
                                      variant={"secondary"}
                                      className="w-full text-xs"
                                      onClick={() => {
                                        setSearch(item.text);
                                      }}
                                    >
                                      {item.text}
                                    </Button>
                                  }
                                  content={"Нажмите чтобы применить запрос"}
                                />

                                <Tooltip
                                  trigger={
                                    <Button
                                      data-testid={`delete-history-search-query-${index}`}
                                      variant="ghost"
                                      size="icon"
                                      className="ml-0.5 h-9 w-9"
                                      onClick={() => {
                                        // Remove item from localStorage
                                        setLocalStorageValue((prev) => {
                                          return prev.filter((prevItem) => {
                                            return prevItem.id !== item.id;
                                          });
                                        });
                                      }}
                                    >
                                      <DeleteIcon
                                        size={17}
                                        className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
                                      />
                                    </Button>
                                  }
                                  content={"Удалить этот запрос из истории"}
                                />
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    ) : noHistorySaved && !search ? (
                      <div className="">Ничего не найдено</div>
                    ) : (
                      <div className="">
                        Ничего не найдено по запросу &quot;{search}&quot;
                      </div>
                    )}
                  </div>
                </CommandEmpty>
              )}

              {isLoading ? (
                <CommandEmpty className="flex min-h-[100px] items-center justify-center">
                  <div className="inline-flex items-center text-sm">
                    <Loader className="mr-1.5 animate-spin" size={16} />
                    Загрузка...
                  </div>
                </CommandEmpty>
              ) : (
                results?.map((result, index) => {
                  return (
                    <CommandItem
                      data-testid={`search-result-${index}`}
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
          {isMobile ? (
            <Popover
              open={isPopoverOpen}
              setOpen={setPopoverOpen}
              trigger={
                <div className="inline-flex cursor-pointer font-medium text-gray-900 opacity-70 transition-opacity hover:opacity-100">
                  <p className="text-xs">Подсказка</p>
                  <Lightbulb className="ml-0.5" size={16} />
                </div>
              }
              content={
                <p className="h-[200px]">
                  Попробуйте ввести дату в поле для поиска в формате
                  &quot;24.02.2022&quot; или &quot;3 недели назад&quot;
                </p>
              }
            />
          ) : (
            <Tooltip
              trigger={
                <div className="inline-flex cursor-pointer font-medium text-gray-900 opacity-70 transition-opacity hover:opacity-100">
                  <p className="text-xs">Подсказка</p>
                  <Lightbulb className="ml-0.5" size={16} />
                </div>
              }
              content={
                <p>
                  Попробуйте ввести дату в поле для поиска в формате
                  &quot;24.02.2022&quot; или &quot;3 недели назад&quot;
                </p>
              }
            />
          )}
        </div>
      </Command>
    </TooltipProvider>
  );
};
