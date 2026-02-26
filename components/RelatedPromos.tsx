// components/RelatedPromos.tsx
"use client";

import type { Promo } from "@/lib/types";

import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ArrowRight } from "lucide-react";

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
      if (promo.nid === current.nid) return false;

      const matchesCategory = promo.field_categories_reference?.some((c) =>
        categoryTids.has(c.tid),
      );
      const matchesLocation = promo.field_locations?.some((l) =>
        locationTids.has(l.tid),
      );
      const matchesCardType = promo.field_card_type?.some((ct) =>
        cardTypeTids.has(ct.tid),
      );

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
          wrapperClass="items-stretch"
        >
          {relatedPromos.map((related) => {
            const promoTags = [
              ...(related.field_categories_reference?.map((t) => ({
                ...t,
                style: "border-(--purple) bg-[rgba(84,39,133,.2)]",
              })) ?? []),
              ...(related.field_card_type?.map((t) => ({
                ...t,
                style: "border-(--pink) bg-[rgba(178,0,110,0.2)]",
              })) ?? []),
              ...(related.field_locations?.map((t) => ({
                ...t,
                style: "border-(--green) bg-[rgba(214,224,77,0.2)]",
              })) ?? []),
            ];

            return (
              <SwiperSlide
                key={related.nid}
                style={{
                  height: "auto !important",
                  display: "flex !important",
                }}
                className="relative h-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
              >
                <Link
                  href={`/promo/${related.nid}`}
                  className="absolute inset-0 h-full w-full z-1"
                ></Link>
                {related.field_featured_image && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${related.field_featured_image}`}
                    alt={related.title}
                    height={0}
                    width={0}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 grow flex flex-col gap-2">
                  <h3 className="font-semibold text-gray-800 text-lg leading-snug capitalize">
                    {related.title}
                  </h3>
                  {related.field_excerpt && (
                    <div
                      className="mb-2"
                      dangerouslySetInnerHTML={{
                        __html: related.field_excerpt,
                      }}
                    />
                  )}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {promoTags.map((tag) => (
                      <span
                        key={tag.tid}
                        className={`border ${tag.style} px-4 py-1 rounded-full text-black text-[10px] text-nowrap`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link
                      href={`/promo/${related.nid}`}
                      className="flex justify-center items-center gap-4 ew-bg-pink rounded-4xl py-2 px-4"
                    >
                      <span className="text-white font-semibold">Check It Out</span>
                      <ArrowRight color="white" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
