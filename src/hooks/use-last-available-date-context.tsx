"use client";

import { useContext } from "react";

import { LastAvailablePostDateContext } from "@/app/providers";

export const useLastAvailablePostDateContext = () => {
  return useContext(LastAvailablePostDateContext);
};
