export default function HomeCategoriesSkeleton() {
  return (
    <section className="grow ew-bg-purple py-20 px-5 flex flex-col relative">
      <div className="max-w-6xl mx-auto text-center relative z-2 w-full">
        <div>
          <div className="h-10 w-96 mx-auto rounded-lg bg-white/10 animate-pulse mb-5" />
          <div className="h-5 w-72 mx-auto rounded bg-white/10 animate-pulse" />
        </div>
        <div className="mt-10">
          <div className="h-8 w-80 mx-auto rounded bg-white/10 animate-pulse mb-10" />
          <div className="max-w-2xl flex justify-center gap-0 flex-wrap mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square basis-1/4 grow-0 p-2 flex">
                <div className="w-full rounded-xl flex items-center justify-center flex-col gap-3 p-3 border-2 border-white/20 animate-pulse">
                  <div className="w-[80px] h-[80px] rounded-full bg-white/15" />
                  <div className="h-4 w-16 rounded bg-white/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}