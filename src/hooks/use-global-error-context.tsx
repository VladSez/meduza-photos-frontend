"use client";

import { atom, useAtom } from "jotai";

const globalError = atom<Error | null>(null);
export const useGlobalErrorAtom = () => {
  return useAtom(globalError);
};
