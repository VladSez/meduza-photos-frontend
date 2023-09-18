"use client";

import { useContext } from "react";

import { FilterDateContext } from "@/app/providers";

export const useFilterDate = () => {
  return useContext(FilterDateContext);
};
