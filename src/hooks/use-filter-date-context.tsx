"use client";

import { atom, useAtom } from "jotai";

const selectedCalendarDate = atom<Date | undefined>(undefined);
export const useSelectedCalendarDateAtom = () => {
  return useAtom(selectedCalendarDate);
};
