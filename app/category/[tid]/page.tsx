import { Suspense } from "react";

import CategoryBannerSection from "@/components/category/CategoryBannerSection";
import CategoryPromoSection from "@/components/category/CategoryPromoSection";
import BannerSectionSkeleton from "@/components/category/BannerSectionSkeleton";
import PromoSectionSkeleton from "@/components/category/PromoSectionSkeleton";

export default async function CategoryByTid({
  params,
}: {
  params: Promise<{ tid: string }>;
}) {
  const { tid } = await params;

  return (
    <>
      <Suspense fallback={<BannerSectionSkeleton />}>
        <CategoryBannerSection tid={tid} />
      </Suspense>
      <Suspense fallback={<PromoSectionSkeleton />}>
        <CategoryPromoSection initialCategory={tid} />
      </Suspense>
    </>
  );
}
