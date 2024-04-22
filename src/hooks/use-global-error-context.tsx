"use client";

import { useContext } from "react";

import { GlobalErrorContext } from "@/app/providers";

export const useGlobalErrorContext = () => {
  return useContext(GlobalErrorContext);
};
