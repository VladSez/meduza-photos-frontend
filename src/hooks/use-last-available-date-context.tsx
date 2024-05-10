"use client";

import { atom, useAtom } from "jotai";

const lastAvailabledPostDate = atom<Date | null>(null);
export const useLastAvailablePostDateAtom = () => {
  return useAtom(lastAvailabledPostDate);
};
