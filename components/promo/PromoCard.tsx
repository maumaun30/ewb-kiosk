import type { Promo } from "@/lib/types";
import { buildPromoTags } from "@/lib/promo-tags";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PromoCardProps {
  promo: Promo;
}

const MAX_VISIBLE_TAGS = 2;
const EXCERPT_WORDS = 20;

function buildExcerpt(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/);
  return words.length > EXCERPT_WORDS
    ? `${words.slice(0, EXCERPT_WORDS).join(" ")}…`
    : words.join(" ");
}

export default function PromoCard({ promo }: PromoCardProps) {
  const promoTags = buildPromoTags(promo);
  const visibleTags = promoTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = promoTags.length - visibleTags.length;

  return (
    <div className="relative h-full border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      <Link
        href={`/promo/${promo.nid}`}
        aria-label={promo.title}
        className="absolute inset-0 h-full w-full z-1"
      />

      {promo.field_featured_image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${promo.field_featured_image}`}
          alt={promo.title}
          height={0}
          width={0}
          className="w-full aspect-10/7 object-cover shrink-0"
        />
      )}

      <div className="p-4 grow flex flex-col gap-2">
        <h3 className="text-xl leading-snug capitalize mb-0 line-clamp-2">
          {promo.title}
        </h3>

        {promo.field_promo_duration && (
          <em className="text-base font-light text-gray-600 line-clamp-1">
            {promo.field_promo_duration}
          </em>
        )}

        {promo.field_excerpt && (
          <p
            className="text-base leading-snug text-gray-800 mb-0 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: buildExcerpt(promo.field_excerpt) }}
          />
        )}

        {promoTags.length > 0 && (
          <div className="flex flex-nowrap gap-1 overflow-hidden mt-1 mb-3">
            {visibleTags.map((tag) => (
              <span
                key={tag.tid}
                className={`border ${tag.style} px-3 py-1 rounded-full text-black text-[12px] text-nowrap truncate min-w-0`}
              >
                {tag.name}
              </span>
            ))}
            {hiddenTagCount > 0 && (
              <span className="shrink-0 border border-gray-300 bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-[12px] text-nowrap">
                +{hiddenTagCount}
              </span>
            )}
          </div>
        )}

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
