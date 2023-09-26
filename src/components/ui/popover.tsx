import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Drawer } from "vaul";

import useMediaQuery from "@/hooks/useMediaQuery";

import type { Dispatch, ReactNode, SetStateAction } from "react";

export function Popover({
  trigger,
  content,
  align = "center",
  openPopover,
  setOpenPopover,
}: {
  trigger: ReactNode;
  content: ReactNode | string;
  align?: "center" | "start" | "end";
  openPopover: boolean;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
}) {
  const { device, isMobile } = useMediaQuery();

  if (!device)
    // loading placeholder, this is needed becauce 'useMediaQuery' runs on the client
    return (
      <div className="h-10 w-[280px] animate-pulse rounded bg-slate-200"></div>
    );

  // Vaul package breaks deploy on vercel, probably smth is wrong with their react version
  if (isMobile) {
    return (
      <Drawer.Root
        open={openPopover}
        onOpenChange={setOpenPopover}
        key={openPopover ? "open" : "closed"}
      >
        <div className="sm:hidden">{trigger}</div>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            <div className="flex min-h-[150px] w-full items-center justify-center overflow-hidden bg-white pb-8 align-middle shadow-xl">
              {content}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover}>
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
