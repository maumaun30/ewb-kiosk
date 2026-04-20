import { Suspense } from "react";
import { getCategory } from "@/lib/categories";
import { getSettings } from "@/lib/settings";
import Image from "next/image";

import CatSliderWrapper from "./CatSliderWrapper";
import CatSliderSkeleton from "./CatSliderSkeleton";

interface Props {
  tid?: string;
}

export default async function CategoryBannerSection({ tid }: Props) {
  let bannerSrc: string | null = null;
  let categoryName: string | null = null;
  let hasBanner = true;

  if (tid) {
    const category = await getCategory(tid);
    bannerSrc = category.banner
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${category.banner}`
      : null;
    categoryName = category.name;
    hasBanner = !!category.banner;
  } else {
    const settings = await getSettings();
    bannerSrc =
      settings?.category_page?.fields?.all_promos_banner.value ??
      "/all-promos-bg.webp";
  }

  return (
    <section
      className={`aspect-16/7 relative mb-25 ${!hasBanner && tid ? "bg-(--green)" : ""}`}
    >
      <div className="w-full absolute inset-0 h-full z-1 pointer-events-none">
        {bannerSrc && (
          <Image
            src={bannerSrc}
            height={0}
            width={0}
            alt={categoryName ?? "Banner"}
            sizes="100vw"
            className="w-full h-full object-cover pointer-events-none"
          />
        )}
      </div>

      {!hasBanner && tid && categoryName && (
        <div className="max-w-6xl mx-auto py-20 px-5 h-full flex justify-center items-center text-center relative z-2">
          <h1 className="text-(--purple)">{categoryName}</h1>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-3">
        <div className="max-w-6xl mx-auto px-5 relative">
          <Suspense fallback={<CatSliderSkeleton />}>
            <CatSliderWrapper activeCategoryId={tid} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
