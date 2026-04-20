import { Suspense } from "react";

import CategoryBannerSection from "@/components/category/CategoryBannerSection";
import CategoryPromoSection from "@/components/category/CategoryPromoSection";
import BannerSectionSkeleton from "@/components/category/BannerSectionSkeleton";
import PromoSectionSkeleton from "@/components/category/PromoSectionSkeleton";

export default function Category() {
  return (
    <>
      <Suspense fallback={<BannerSectionSkeleton />}>
        <CategoryBannerSection />
      </Suspense>
      <Suspense fallback={<PromoSectionSkeleton />}>
        <CategoryPromoSection />
      </Suspense>
    </>
  );
}
