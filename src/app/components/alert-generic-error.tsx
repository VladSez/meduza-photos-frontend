import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";

export function AlertGenericError() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>
        Что-то пошло не так. Попробуйте позже.
      </AlertDescription>
    </Alert>
  );
}
