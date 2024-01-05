"use client";

import { Command } from "cmdk";
import { decode } from "html-entities";
import debounce from "lodash.debounce";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Highlighter from "react-highlight-words";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { searchPosts } from "@/app/actions/search-posts";
import { stripHtmlTags } from "@/utils/strip-html-tags";

import { ArticleDate } from "./article-date";
import { useToast } from "./use-toast";

import type { MeduzaArticles } from "@prisma/client";

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const [results, setResults] = React.useState<MeduzaArticles[]>([]);

  const [isLoading, setLoading] = React.useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const debouncedChangeHandler = React.useMemo(() => {
    return debounce((search: string) => {
      setLoading(true);

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

  const handleChange = (event: string) => {
    setSearch(event);
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen((open) => {
            return !open;
          });
        }}
        className="relative inline-flex h-8 w-full max-w-[208px] items-center justify-start rounded-md border bg-transparent px-4 py-2 text-sm shadow-sm transition-colors hover:bg-slate-50/50 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="inline-flex">Поиск...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* bug: https://github.com/pacocoursey/cmdk/issues/103 */}
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
          <CommandList>
            <CommandGroup heading={`Результаты: ${results?.length ?? ""}`}>
              {isLoading ? null : (
                <CommandEmpty className="min-h-[70px]">
                  <div>Ничего не найдено</div>
                </CommandEmpty>
              )}
              {isLoading ? (
                <CommandEmpty className="min-h-[70px]">
                  <div className="inline-flex text-xs">
                    <Loader className="mr-1.5 animate-spin" size={16} />
                    Загрузка...
                  </div>
                </CommandEmpty>
              ) : (
                results?.map((result) => {
                  return (
                    <CommandItem
                      className="space-y-2 px-3 py-2"
                      key={result.id}
                      onSelect={() => {
                        setOpen(false);
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
        </Command>
      </CommandDialog>
    </>
  );
}
