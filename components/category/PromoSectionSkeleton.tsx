function PromoCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm bg-white flex flex-col animate-pulse">
      <div className="w-full h-60 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-7 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="flex gap-2 flex-wrap mt-1">
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-24 rounded-full bg-gray-200" />
        </div>
        <div className="h-10 w-full rounded-4xl bg-gray-200 mt-auto" />
      </div>
    </div>
  );
}

export default function PromoSectionSkeleton() {
  return (
    <section className="pb-20 pt-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 w-96 rounded bg-gray-200 animate-pulse mb-10" />
      </div>

      <div className="max-w-6xl mx-auto mb-10 flex flex-wrap gap-4 items-end justify-end animate-pulse">
        <div className="h-13 w-full rounded-4xl bg-gray-200 mb-10" />
        <div className="h-13 w-36 rounded-4xl bg-gray-200" />
        <div className="h-13 w-36 rounded-4xl bg-gray-200" />
        <div className="h-13 w-36 rounded-4xl bg-gray-200" />
        <div className="h-13 w-36 rounded-4xl bg-gray-200" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <PromoCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
