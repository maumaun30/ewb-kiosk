export default function PromoDetailSkeleton() {
  return (
    <>
      <section>
        <div className="max-w-6xl mx-auto py-20 px-5">
          <div className="flex items-center justify-center gap-10">
            <div className="flex-1 flex flex-col gap-4 animate-pulse">
              <div className="h-12 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-1/3 rounded bg-gray-200 mb-4" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
              <div className="flex flex-wrap gap-2 mt-6">
                <div className="h-7 w-24 rounded-full bg-gray-200" />
                <div className="h-7 w-20 rounded-full bg-gray-200" />
                <div className="h-7 w-28 rounded-full bg-gray-200" />
              </div>
            </div>
            <div className="flex-1 animate-pulse">
              <div className="w-full aspect-square rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-6xl mx-auto pb-20 px-5 flex flex-col gap-4 animate-pulse">
          <div className="h-9 w-56 rounded bg-gray-200 mb-1" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>
      </section>
    </>
  );
}
