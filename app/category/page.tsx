import { Suspense } from "react";
import { SkeletonTracker } from "@/context/SkeletonLoadingContext";

import CategoryBannerSection from "@/components/category/CategoryBannerSection";
import CategoryPromoSection from "@/components/category/CategoryPromoSection";
import BannerSectionSkeleton from "@/components/category/BannerSectionSkeleton";
import PromoSectionSkeleton from "@/components/category/PromoSectionSkeleton";

export default function Category() {
  return (
    <>
      <Suspense fallback={<SkeletonTracker><BannerSectionSkeleton /></SkeletonTracker>}>
        <CategoryBannerSection />
      </Suspense>
      <Suspense fallback={<SkeletonTracker><PromoSectionSkeleton /></SkeletonTracker>}>
        <CategoryPromoSection />
      </Suspense>
    </>
  );
}
