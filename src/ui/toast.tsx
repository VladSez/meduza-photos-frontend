"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// https://sonner.emilkowal.ski/toaster
const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner richColors closeButton {...props} />;
};

const genericErrorToastSonner = () => {
  return toast.error("Что-то пошло не так. Попробуйте позже.");
};

// eslint-disable-next-line unicorn/prefer-export-from
export { Toaster, toast, genericErrorToastSonner };
