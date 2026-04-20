export default function CatSliderSkeleton() {
  return (
    <div className="w-[90%] mx-auto flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-1 aspect-square rounded-xl border-2 border-white/20 animate-pulse flex flex-col items-center justify-center gap-3 p-3">
          <div className="w-[60px] h-[60px] rounded-full bg-white/15" />
          <div className="h-3 w-14 rounded bg-white/15" />
        </div>
      ))}
    </div>
  );
}
