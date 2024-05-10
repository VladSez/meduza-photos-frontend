import { Loader } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <>
      <Loader className="animate-spin" size={16} />
      <span>Загрузка...</span>
    </>
  );
};
