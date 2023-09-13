export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-10">
      <div className="mx-auto w-full max-w-xl rounded-md p-4 shadow">
        <div className="flex animate-pulse space-x-4">
          <div className="h-10 w-10 rounded-full bg-slate-200"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                <div className="col-span-1 h-2 rounded bg-slate-200"></div>
              </div>
              <div className="h-2 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div className="my-4 h-48 w-full animate-pulse rounded-md bg-slate-200 p-4"></div>
      </div>
      <div className="mx-auto w-full max-w-xl rounded-md p-4 shadow">
        <div className="flex animate-pulse space-x-4">
          <div className="h-10 w-10 rounded-full bg-slate-200"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                <div className="col-span-1 h-2 rounded bg-slate-200"></div>
              </div>
              <div className="h-2 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div className="my-4 h-48 w-full animate-pulse rounded-md bg-slate-200 p-4"></div>
      </div>
    </div>
  );
}
