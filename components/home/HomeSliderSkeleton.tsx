export default function HomeSliderSkeleton() {
  return (
    <div className="relative aspect-16/7 bg-gray-200 animate-pulse">
      <div className="absolute bottom-0 left-0 w-full">
        <div className="flex items-center justify-between max-w-6xl mx-auto p-5">
          <div className="flex items-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gray-400" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div className="w-12 h-12 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
