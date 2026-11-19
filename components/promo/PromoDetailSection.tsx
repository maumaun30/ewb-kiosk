import { getPromo } from "@/lib/promos";
import Image from "next/image";
import { buildPromoTags } from "@/lib/promo-tags";

interface Props {
  nid: string;
}

export default async function PromoDetailSection({ nid }: Props) {
  const promo = await getPromo(nid);

  const tags = buildPromoTags(promo);

  return (
    <section>
      <div className="max-w-6xl mx-auto pt-10 pb-12 px-5">
        {promo.field_featured_image && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${promo.field_featured_image}`}
            alt={promo.title}
            className="w-full aspect-10/7 object-cover rounded-3xl shadow-sm mb-8"
            height={0}
            width={0}
            sizes="(max-width: 1152px) 100vw, 1152px"
            loading="eager"
          />
        )}

        <h1 className="mb-2">{promo.title}</h1>
        {promo.field_promo_duration && (
          <div className="mb-6">
            <em className="font-light text-gray-600">
              {promo.field_promo_duration}
            </em>
          </div>
        )}
        {promo.field_excerpt && (
          <div
            className="text-[22px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: promo.field_excerpt }}
          />
        )}
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            {tags.map((tag) => (
              <div
                key={tag.tid}
                className={`border ${tag.style} px-4 py-1.5 rounded-full text-black text-base text-nowrap`}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
