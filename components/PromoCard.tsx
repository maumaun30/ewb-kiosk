// components/PromoCard.tsx
import type { Promo } from "@/lib/types";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PromoCardProps {
  promo: Promo;
}

function buildPromoTags(promo: Promo) {
  return [
    ...(promo.field_categories_reference?.map((t) => ({
      ...t,
      style: "border-(--purple) bg-[rgba(84,39,133,.2)]",
    })) ?? []),
    ...(promo.field_card_type?.map((t) => ({
      ...t,
      style: "border-(--pink) bg-[rgba(178,0,110,0.2)]",
    })) ?? []),
    ...(promo.field_locations?.map((t) => ({
      ...t,
      style: "border-(--green) bg-[rgba(214,224,77,0.2)]",
    })) ?? []),
  ];
}

export default function PromoCard({ promo }: PromoCardProps) {
  const promoTags = buildPromoTags(promo);

  return (
    <div
      className={`relative border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col`}
    >
      <Link
        href={`/promo/${promo.nid}`}
        className="absolute inset-0 h-full w-full z-1"
      />

      {promo.field_featured_image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${promo.field_featured_image}`}
          alt={promo.title}
          height={0}
          width={0}
          className={`w-full h-60 object-cover`}
        />
      )}

      <div className="p-4 grow flex flex-col gap-2">
        <h3 className="text-2xl leading-snug capitalize mb-0">{promo.title}</h3>

        {promo.field_promo_duration && (
          <em className="font-light mb-5">{promo.field_promo_duration}</em>
        )}

        {promo.field_excerpt && (
          <div
            className="mb-2"
            dangerouslySetInnerHTML={{
              __html: (() => {
                const words = promo.field_excerpt
                  .replace(/<[^>]*>/g, " ")
                  .trim()
                  .split(/\s+/);
                return words.length > 20
                  ? words.slice(0, 20).join(" ") + "…"
                  : words.join(" ");
              })(),
            }}
          />
        )}

        <div className="flex flex-wrap gap-x-1 gap-y-2 mb-4">
          {promoTags.map((tag) => (
            <span
              key={tag.tid}
              className={`border ${tag.style} px-4 py-1 rounded-full text-black text-[12px] text-nowrap`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <Link
            href={`/promo/${promo.nid}`}
            className="flex justify-center items-center gap-4 ew-bg-pink rounded-4xl py-2 px-4"
          >
            <span className="text-white">Check it out</span>
            <ArrowRight color="white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
