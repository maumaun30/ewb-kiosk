// components/RelatedPromos.tsx
"use client";

import { useState } from "react";

import type { Promo } from "@/lib/types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ArrowRight, ArrowLeft } from "lucide-react";

import PromoCard from "./PromoCard";

function getRelatedPromos(current: Promo, all: Promo[]): Promo[] {
  const categoryTids = new Set(
    current.field_categories_reference?.map((c) => c.tid) ?? [],
  );
  const locationTids = new Set(
    current.field_locations?.map((l) => l.tid) ?? [],
  );
  const cardTypeTids = new Set(
    current.field_card_type?.map((ct) => ct.tid) ?? [],
  );

  return all
    .filter((promo) => {
      if (promo.nid === current.nid) {
        return false;
      }

      const matchesCategory = promo.field_categories_reference?.some((c) =>
        categoryTids.has(c.tid),
      );
      const matchesLocation = promo.field_locations?.some((l) =>
        locationTids.has(l.tid),
      );
      const matchesCardType = promo.field_card_type?.some((ct) =>
        cardTypeTids.has(ct.tid),
      );

      return matchesCategory ?? matchesLocation ?? matchesCardType;
    })
    .slice(0, 9);
}

export default function RelatedPromos({
  current,
  all,
}: {
  current: Promo;
  all: Promo[];
}) {
  const relatedPromos = getRelatedPromos(current, all);
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  if (relatedPromos.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto pb-20 px-5">
        <div className="flex items-center justify-between mb-8">
          <h2>Related Promos</h2>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={3}
          spaceBetween={24}
          navigation={{ prevEl, nextEl }}
          pagination={{
            clickable: true,
            el: ".related-pagination",
            bulletClass: "related-bullet",
            bulletActiveClass: "related-bullet-active",
          }}
          className="pb-12"
          wrapperClass="pb-5"
          style={{ alignItems: "stretch" }}
        >
          {relatedPromos.map((related) => (
            <SwiperSlide key={related.nid} className="related">
              <PromoCard promo={related} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex items-center justify-between">
          <div className="related-pagination flex items-center gap-3" />
          <div className="flex items-center gap-2">
            <button
              ref={setPrevEl}
              aria-label="Previous"
              className="flex items-center justify-center w-12 h-12 rounded-full ew-bg-pink transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft color="white" size={18} strokeWidth={2.5} />
            </button>
            <button
              ref={setNextEl}
              aria-label="Next"
              className="flex items-center justify-center w-12 h-12 rounded-full ew-bg-pink text-white transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <style>{`
          .related.swiper-slide {
            height: auto !important;
            display: flex !important;
          }
          .related-bullet {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: #cccccc;
            cursor: pointer;
            transition: all 0.2s ease;
            opacity: 0.7;
          }
          .related-bullet-active {
            background: var(--pink);
            opacity: 1;
            transform: scale(1.5);
          }
        `}</style>
      </div>
    </section>
  );
}
