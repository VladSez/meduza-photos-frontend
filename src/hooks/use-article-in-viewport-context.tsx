"use client";

import { atom, useAtom } from "jotai";

const articleDateInViewport = atom<string | null>(null);
export const useArticleDateInViewportAtom = () => {
  return useAtom(articleDateInViewport);
};
