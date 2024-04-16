"use client";

import { useDebouncedCallback, useLocalStorage } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { decode } from "html-entities";
import { X as DeleteIcon, Lightbulb, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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
import { Separator } from "./separator";
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

const useSearchHistoryLocalStorage = () => {
  return useLocalStorage<{ text: string; id: string }[]>({
    key: "previous-search-queries",
    defaultValue: [],
  });
};

const SEARCH_SCREENS = {
  INITIAL: "initial",
  HISTORY: "history",
  LOADING: "loading",
  NOT_FOUND: "not_found",
  SEARCH_RESULTS: "search_results",
  ERROR: "error",
} as const;

type SEARCH_SCREEN_KEYS = (typeof SEARCH_SCREENS)[keyof typeof SEARCH_SCREENS];

type SearchSteps = {
  [key in SEARCH_SCREEN_KEYS]: React.ReactNode;
};

type SearchContentProps = {
  close: () => void;
};

const SearchContent = ({ close }: SearchContentProps) => {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<MeduzaArticles[]>([]);
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  const [step, setStep] = React.useState<SEARCH_SCREEN_KEYS>(
    SEARCH_SCREENS.INITIAL
  );

  const [localStorageValue, setLocalStorageValue] =
    useSearchHistoryLocalStorage();

  const { toast } = useToast();

  const router = useRouter();

  const { isMobile } = useMediaQuery();

  const handleSearch = (searchQuery: string) => {
    searchPosts({ search: searchQuery })
      .then((res) => {
        const hasResults = res?.results?.length > 0;

        if (hasResults) {
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

        if (hasResults) {
          setStep(SEARCH_SCREENS.SEARCH_RESULTS);
        } else if (searchQuery) {
          setStep(SEARCH_SCREENS.NOT_FOUND);
        }
      })
      .catch((error) => {
        console.error(error);

        if (searchQuery && error) {
          setStep(SEARCH_SCREENS.ERROR);
        }

        if (error instanceof Error) {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: `Что-то пошло не так: попробуйте позже.`,
          });
        }
      });
  };

  // https://mantine.dev/hooks/use-debounced-callback/
  const debouncedHandleSearch = useDebouncedCallback((searchQuery: string) => {
    handleSearch(searchQuery);
  }, 800);

  React.useEffect(() => {
    if (search) {
      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        setStep(SEARCH_SCREENS.LOADING);
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
  const hasHistorySaved = localStorageValue?.length > 0;

  const searchQuery = search.trim();
  const hasNoResults = results?.length === 0;

  const canShowHistory = hasHistorySaved && !searchQuery && hasNoResults;

  useEffect(() => {
    if (canShowHistory) {
      setStep(SEARCH_SCREENS.HISTORY);
    } else if (noHistorySaved && !searchQuery) {
      setStep(SEARCH_SCREENS.INITIAL);
    }
  }, [canShowHistory, noHistorySaved, searchQuery]);

  const SearchScreens = {
    [SEARCH_SCREENS.INITIAL]: (
      <CommandEmpty className="min-h-[70px]">
        <div className="flex w-[99%] flex-col space-y-2">
          <div className="">Попробуйте поискать что-нибудь</div>
          <div className="space-x-3 space-y-1.5">
            <SearchChips search={search} setSearch={setSearch} step={step} />
          </div>
        </div>
      </CommandEmpty>
    ),
    [SEARCH_SCREENS.HISTORY]: (
      <SearchHistory
        setSearch={setSearch}
        localStorageValue={localStorageValue}
        setLocalStorageValue={setLocalStorageValue}
      />
    ),
    [SEARCH_SCREENS.LOADING]: (
      <CommandEmpty className="flex min-h-[100px] items-center justify-center">
        <div className="inline-flex items-center text-sm">
          <Loader className="mr-1.5 animate-spin" size={16} />
          Загрузка...
        </div>
      </CommandEmpty>
    ),
    [SEARCH_SCREENS.NOT_FOUND]: (
      <CommandEmpty className="min-h-[70px]">
        <div className="ml-1 flex w-[99%] flex-col">
          <div className="">
            Ничего не найдено по запросу &quot;{search}&quot;
          </div>
        </div>
      </CommandEmpty>
    ),
    [SEARCH_SCREENS.SEARCH_RESULTS]: results?.map((result, index) => {
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
                textToHighlight={stripHtmlTags(decode(result?.header ?? ""))}
              />
            </div>
            <ArticleDate date={result?.dateString} className="text-xs" />
          </div>
          <Highlighter
            highlightClassName="bg-yellow-300 font-semibold"
            unhighlightClassName={`break-words text-gray-900 [&>span]:font-light`}
            searchWords={search?.split(" ") ?? []}
            autoEscape={true}
            textToHighlight={stripHtmlTags(decode(result?.subtitle ?? ""))}
          />
        </CommandItem>
      );
    }),
    [SEARCH_SCREENS.ERROR]: (
      <div className="">Что-то пошло не так. Попробуйте позже</div>
    ),
  } as const satisfies SearchSteps;

  const SearchScreenComponent = SearchScreens[step];

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
          className={cn("h-[365px] overflow-y-auto rounded-md p-2")}
          type="always"
        >
          <CommandList className="">
            {step === SEARCH_SCREENS.INITIAL ? null : (
              <div className="space-x-3 space-y-1.5">
                <SearchChips
                  search={search}
                  setSearch={setSearch}
                  step={step}
                />
              </div>
            )}
            <CommandGroup
              heading={
                step === SEARCH_SCREENS.SEARCH_RESULTS ? (
                  <div className="">Результаты: {results?.length ?? ""}</div>
                ) : undefined
              }
            >
              {SearchScreenComponent}
            </CommandGroup>
          </CommandList>
        </ScrollArea>
        <Separator className="h-[0.5px]" />
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

export const SEARCH_TERMS = [
  "Вчера",
  "Неделю назад",
  "Месяц назад",
  "Год назад",
  "24 февраля 2022",
  "Киев",
] as const;

type SearchChipsProps = {
  step: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const SearchChips = ({ step, search, setSearch }: SearchChipsProps) => {
  return SEARCH_TERMS.map((searchText) => {
    const isDisabled = step === SEARCH_SCREENS.LOADING;
    const isSelected = search === searchText;

    return (
      <Button
        data-testid="search-chip"
        disabled={step === SEARCH_SCREENS.LOADING}
        key={searchText}
        variant={"secondary"}
        data-active={isSelected}
        className={cn(
          "ml-3 h-[22px] text-xs font-normal",
          { "disabled:opacity-100": isDisabled && isSelected },
          {
            "bg-gray-800 text-gray-100 hover:bg-gray-800/95": isSelected,
          }
        )}
        onClick={() => {
          setSearch(searchText);
        }}
      >
        {searchText}
      </Button>
    );
  });
};

type SearchHistoryProps = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  localStorageValue: { text: string; id: string }[];
  setLocalStorageValue: React.Dispatch<
    React.SetStateAction<{ text: string; id: string }[]>
  >;
};

const SearchHistory = ({
  setSearch,
  localStorageValue,
  setLocalStorageValue,
}: SearchHistoryProps) => {
  return (
    <CommandEmpty className="min-h-[70px]">
      <div className="ml-1 flex w-[99%] flex-col">
        <div className="flex flex-col items-start space-y-2">
          <p className="mb-2 ml-0.5 text-xs font-medium">История:</p>
          <AnimatePresence initial={false} mode="popLayout">
            {localStorageValue?.map((item) => {
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
                    delayDuration={700}
                    trigger={
                      <Button
                        data-testid={`apply-history-search-query-${item.text}`}
                        size="sm"
                        variant={"secondary"}
                        className="w-full text-xs font-semibold"
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
                    delayDuration={700}
                    trigger={
                      <Button
                        data-testid={`delete-history-search-query-${item.text}`}
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
      </div>
    </CommandEmpty>
  );
};
