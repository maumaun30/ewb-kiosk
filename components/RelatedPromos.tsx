// components/RelatedPromos.tsx
"use client";

import Link from "next/link";
import type { Promo } from "@/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function getRelatedPromos(current: Promo, all: Promo[]): Promo[] {
  const categoryTids = new Set(current.field_categories_reference?.map((c) => c.tid) ?? []);
  const locationTids = new Set(current.field_locations?.map((l) => l.tid) ?? []);
  const cardTypeTids = new Set(current.field_card_type?.map((ct) => ct.tid) ?? []);

  return all
    .filter((promo) => {
      if (promo.nid === current.nid) return false;

      const matchesCategory = promo.field_categories_reference?.some((c) => categoryTids.has(c.tid));
      const matchesLocation = promo.field_locations?.some((l) => locationTids.has(l.tid));
      const matchesCardType = promo.field_card_type?.some((ct) => cardTypeTids.has(ct.tid));

      return matchesCategory || matchesLocation || matchesCardType;
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

  if (relatedPromos.length === 0) return null;

  return (
    <section>
      <div className="max-w-5xl mx-auto py-20 px-5">
        <h2 className="text-2xl font-semibold mb-8">Related Promos</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={24}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {relatedPromos.map((related) => (
            <SwiperSlide key={related.nid}>
              <Link
                href={`/promo/${related.nid}`}
                className="group rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                {related.field_featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${related.field_featured_image}`}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-base leading-snug mb-2 group-hover:ew-text-purple transition-colors">
                    {related.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {related.field_categories_reference?.map((c) => (
                      <span
                        key={c.tid}
                        className="border border-(--purple) bg-[rgba(84,39,133,.2)] px-3 py-0.5 rounded-full ew-text-purple text-[10px]"
                      >
                        {c.name}
                      </span>
                    ))}
                    {related.field_card_type?.map((ct) => (
                      <span
                        key={ct.tid}
                        className="border border-(--purple) bg-[rgba(84,39,133,.2)] px-3 py-0.5 rounded-full ew-text-purple text-[10px]"
                      >
                        {ct.name}
                      </span>
                    ))}
                    {related.field_locations?.map((l) => (
                      <span
                        key={l.tid}
                        className="border border-(--purple) bg-[rgba(84,39,133,.2)] px-3 py-0.5 rounded-full ew-text-purple text-[10px]"
                      >
                        {l.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}