export const ArticlePlaceholder = () => {
  return (
    <div
      className="mt-20 flex flex-col items-center justify-start gap-10 animate-in fade-in"
      data-testid="article-placeholder"
    >
      <div className="mx-auto w-full max-w-2xl animate-pulse p-4">
        {/* Title placeholder */}
        <div className="flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-5 rounded bg-slate-200"></div>
            <div className="h-5 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-5 rounded bg-slate-200"></div>
                <div className="col-span-1 h-5 rounded bg-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Date placeholder */}
        <div className="mx-auto my-5 h-3 w-72 rounded bg-slate-200"></div>

        {/* Article text placeholder */}
        <div className="mt-14 flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-3 rounded bg-slate-200"></div>
            <div className="h-3 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-3 rounded bg-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Image placeholder */}
        <div className="mt-5 h-48 w-full animate-pulse rounded-md bg-slate-200 p-4"></div>
      </div>
    </div>
  );
};
