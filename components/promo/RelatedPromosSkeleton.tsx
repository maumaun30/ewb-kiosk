function CardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm bg-white flex flex-col animate-pulse">
      <div className="w-full h-60 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-7 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
        </div>
        <div className="h-10 w-full rounded-4xl bg-gray-200 mt-2" />
      </div>
    </div>
  );
}

export default function RelatedPromosSkeleton() {
  return (
    <section>
      <div className="max-w-6xl mx-auto pb-20 px-5">
        <div className="h-9 w-48 rounded bg-gray-200 animate-pulse mb-8" />
        <div className="grid grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
