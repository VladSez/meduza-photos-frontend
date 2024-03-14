import * as PopoverPrimitive from "@radix-ui/react-popover";

import { Drawer, DrawerContent, DrawerTrigger } from "@/ui/drawer";

import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import type { Dispatch, ReactNode, SetStateAction } from "react";

export function Popover({
  trigger,
  content,
  align = "center",
  open,
  setOpen,
}: {
  trigger: ReactNode;
  content: ReactNode | string;
  align?: "center" | "start" | "end";
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { device, isMobile } = useMediaQuery();

  if (!device) {
    // loading placeholder, this is needed becauce 'useMediaQuery' runs on the client
    return (
      <div className="h-10 w-[280px] animate-pulse rounded bg-slate-200"></div>
    );
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="">
          <div
            className={cn(
              "mx-auto mt-5 flex h-full w-full max-w-md flex-col p-4"
            )}
          >
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger className="hidden sm:inline-flex" asChild>
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        sideOffset={8}
        align={align}
        className="z-50 hidden items-center rounded-md border border-gray-200 bg-white drop-shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:block"
      >
        {content}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}
