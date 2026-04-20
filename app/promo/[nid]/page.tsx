import { Suspense } from "react";
import { SkeletonTracker } from "@/context/SkeletonLoadingContext";

import PromoDetailSection from "@/components/promo/PromoDetailSection";
import PromoDetailSkeleton from "@/components/promo/PromoDetailSkeleton";
import RelatedPromosSection from "@/components/promo/RelatedPromosSection";
import RelatedPromosSkeleton from "@/components/promo/RelatedPromosSkeleton";

export default async function PromoPage({
  params,
}: {
  params: Promise<{ nid: string }>;
}) {
  const { nid } = await params;

  return (
    <>
      <Suspense fallback={<SkeletonTracker><PromoDetailSkeleton /></SkeletonTracker>}>
        <PromoDetailSection nid={nid} />
      </Suspense>
      <Suspense fallback={<SkeletonTracker><RelatedPromosSkeleton /></SkeletonTracker>}>
        <RelatedPromosSection nid={nid} />
      </Suspense>
    </>
  );
}
