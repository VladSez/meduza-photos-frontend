import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sometimes the API returns duplicate items. This function filters out the duplicates.
 */
export function filterOutDuplicateIds<T extends { id: number }>(
  items: T[]
): T[] {
  if (Array.isArray(items)) {
    const ids = new Set<number>();

    return items.filter((item) => {
      if (ids.has(item.id)) {
        return false;
      }
      ids.add(item.id);
      return true;
    });
  } else {
    throw new TypeError("items is not an array");
  }
}
