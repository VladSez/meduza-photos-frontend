export function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="mx-3 mt-7 rounded-md bg-yellow-100 px-3 py-5 md:max-w-[632px] md:px-5">
        {children}
      </div>
    </div>
  );
}
