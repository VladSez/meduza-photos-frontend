export function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="bg-yellow-100 rounded-md mx-3 mt-7 py-5 px-3 md:px-5 md:max-w-[632px]">
        {children}
      </div>
    </div>
  );
}
