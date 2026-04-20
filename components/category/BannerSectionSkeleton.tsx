import CatSliderSkeleton from "./CatSliderSkeleton";

export default function BannerSectionSkeleton() {
  return (
    <section className="aspect-16/7 relative mb-25 bg-gray-200 animate-pulse">
      <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-3">
        <div className="max-w-6xl mx-auto px-5 relative">
          <div className="bg-white rounded-2xl shadow-md p-3">
            <CatSliderSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}
