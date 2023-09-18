export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mt-28 flex flex-col items-center justify-start gap-10">
        <div className="mx-auto mb-8 w-full max-w-xl p-4">
          {/* Title placeholder */}
          <div className="flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
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
        </div>
      </div>
      <div className="mx-5 mt-24">
        {/* Month placeholder */}
        <div className="mb-[57px] mt-4 h-5 w-72 rounded bg-slate-200"></div>

        <div className="flex flex-row flex-wrap gap-4">
          <CardPlaceholder />
          <CardPlaceholder />
          <CardPlaceholder />
          <CardPlaceholder />
        </div>
      </div>
    </div>
  );
}

const CardPlaceholder = () => {
  return (
    <div className="h-[300px] w-full max-w-xl rounded-md shadow md:w-[350px]">
      {/* Card image placeholder */}
      <div className="h-48 w-full rounded-md rounded-b-none bg-slate-200"></div>

      {/* Card text placeholder */}
      <div className="flex space-x-4 p-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-2 rounded bg-slate-200"></div>
          <div className="h-2 rounded bg-slate-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-slate-200"></div>
              <div className="col-span-1 h-2 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
