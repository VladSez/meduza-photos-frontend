import type { Toast } from "@/ui/use-toast";

export const toastGenericError = {
  variant: "destructive",
  title: "Ошибка",
  description: `Что-то пошло не так. Попробуйте позже.`,
} as const satisfies Toast;
