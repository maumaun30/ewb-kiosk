import { getPromo } from "@/lib/promos";
import Image from "next/image";

interface Props {
  nid: string;
}

export default async function PromoDetailSection({ nid }: Props) {
  const promo = await getPromo(nid);

  const tags = [
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

  return (
    <>
      <section>
        <div className="max-w-6xl mx-auto py-20 px-5">
          <div className="flex items-center justify-center gap-10">
            <div className="flex-1">
              <h1 className="mb-2">{promo.title}</h1>
              {promo.field_promo_duration && (
                <div className="mb-10">
                  <em className="font-light">{promo.field_promo_duration}</em>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: promo.field_excerpt ?? "" }} />
              <div className="mt-10 flex flex-wrap gap-2 items-center">
                {tags.map((tag) => (
                  <div
                    key={tag.tid}
                    className={`border ${tag.style} px-4 py-1 rounded-full text-black text-[12px] text-nowrap`}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${promo.field_featured_image}`}
                alt={promo.title}
                className="w-full rounded-2xl"
                height={0}
                width={0}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="promo-mechanics">
        <div className="max-w-6xl mx-auto pb-20 px-5">
          <h2 className="mb-5">Promo Mechanics</h2>
          <div dangerouslySetInnerHTML={{ __html: promo.body ?? "" }} />
        </div>
      </section>
    </>
  );
}
