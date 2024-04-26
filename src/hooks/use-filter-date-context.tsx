"use client";

import { useContext } from "react";

import { FilterDateContext } from "@/app/providers";

export const useFilterDateContext = () => {
  return useContext(FilterDateContext);
};
