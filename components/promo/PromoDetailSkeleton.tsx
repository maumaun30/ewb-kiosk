export default function PromoDetailSkeleton() {
  return (
    <section>
      <div className="max-w-6xl mx-auto pt-10 pb-12 px-5 flex flex-col gap-4 animate-pulse">
        <div className="w-full aspect-10/7 rounded-3xl bg-gray-200 mb-4" />
        <div className="h-12 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-1/3 rounded bg-gray-200 mb-2" />
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-5 w-5/6 rounded bg-gray-200" />
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="h-8 w-28 rounded-full bg-gray-200" />
          <div className="h-8 w-24 rounded-full bg-gray-200" />
          <div className="h-8 w-32 rounded-full bg-gray-200" />
        </div>
      </div>
    </section>
  );
}
