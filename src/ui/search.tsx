"use client";

import { decode } from "html-entities";
import debounce from "lodash.debounce";
import { Loader } from "lucide-react";
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/ui/drawer";

import { searchPosts } from "@/app/actions/search-posts";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { stripHtmlTags } from "@/utils/strip-html-tags";

import { ArticleDate } from "./article-date";
import { ScrollArea } from "./scroll-area";
import { useToast } from "./use-toast";

import type { MeduzaArticles } from "@prisma/client";

export function Search({ isApple = false }) {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();

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
      {isDesktop ? (
        <>
          <SearchTrigger setOpen={setOpen} isApple={isApple} />
          <CommandDialog open={open} onOpenChange={setOpen}>
            <SearchContent close={close} />
          </CommandDialog>
        </>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <SearchTrigger setOpen={setOpen} isApple={isApple} />
          </DrawerTrigger>
          <DrawerContent className="max-h-[87%]">
            <div
              className={cn(
                "mx-auto mt-5 flex h-full w-full max-w-md flex-col p-4"
              )}
            >
              <SearchContent close={close} isDrawer />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

const KeyboardShortcuts = ({ isApple = false }) => {
  if (isApple) {
    return (
      <>
        <span className="text-xs">⌘</span>K
      </>
    );
  }
  return (
    <>
      <span className="text-xs">Ctrl</span>K
    </>
  );
};

type SearchTriggerProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isApple: boolean;
};

const SearchTrigger = React.forwardRef<
  React.ElementRef<"button">,
  SearchTriggerProps
>(({ setOpen, isApple }, ref) => {
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
        <KeyboardShortcuts isApple={isApple} />
      </kbd>
    </button>
  );
});

SearchTrigger.displayName = "SearchTrigger";

type SearchContentProps = {
  close: () => void;
  isDrawer?: boolean;
};

const SearchContent = ({ close, isDrawer }: SearchContentProps) => {
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
        className={cn(
          "h-[300px] overflow-y-auto rounded-md p-2",
          isDrawer && "h-[65vh]"
        )}
        type="always"
      >
        <CommandList className="">
          <CommandGroup heading={`Результаты: ${results?.length ?? ""}`}>
            {isLoading ? null : (
              <CommandEmpty className="min-h-[70px]">
                <div>Ничего не найдено</div>
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
                      // setOpen(false);
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
    </Command>
  );
};
