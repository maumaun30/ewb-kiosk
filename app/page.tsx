import { getCategories } from "@/lib/categories";
import { getSlides } from "@/lib/slides";
import { getSettings } from "@/lib/settings";

import Link from "next/link";
import Image from "next/image";

import Slider from "@/components/Slider";

export default async function Home() {
  const categories = await getCategories();
  const allSlides = await getSlides();
  const settings = await getSettings();

  return (
    <>
      <header>
        <Slider slides={allSlides} />
      </header>
      <section className="ew-bg-purple py-20 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <div>
            <h2 className="ew-text-green mb-5">
              {settings.homepage.fields.promo_title.value ||
                "EastWest Card Promos"}
            </h2>
            {/* <p className="text-white">
              Make every swipe count with your EastWest card.
            </p>
            <p className="text-white max-w-150 mx-auto">
              Discover exciting deals and exclusive perks from our latest
              credit, debit, and prepaid card promotions.
            </p> */}
            <div
              className="text-white max-w-150 mx-auto"
              dangerouslySetInnerHTML={{
                __html: settings.homepage.fields.promo_content.value ?? "",
              }}
            />
          </div>
          <div className="mt-20">
            <h3 className="text-3xl text-white mb-10">
              Discover Promos Made for You
            </h3>
            <div className="flex justify-center items-center gap-0 flex-wrap">
              <Link href={`/category/`} className={`basis-1/5 grow-0 p-2`}>
                <div
                  className={`rounded-xl flex items-center justify-center flex-col gap-3 aspect-square text-center text-white p-5 shadow-md ew-bg-purple`}
                >
                  <Image
                    src="/all-promos-icon.svg"
                    height={120}
                    width={120}
                    alt="All Promos"
                    className="aspect-square"
                  />
                  <h3 className="text-md text-white mb-0">All Promos</h3>
                </div>
              </Link>

              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/category/${category.tid}`}
                  className={`basis-1/5 grow-0 p-2`}
                >
                  <div
                    className={`rounded-xl flex items-center justify-center flex-col gap-3 aspect-square text-center text-white p-5 shadow-md 
                  ${index % 2 === 0 ? "ew-bg-pink" : "ew-bg-purple"}`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.icon}`}
                      height={120}
                      width={120}
                      alt={category.name}
                      className="aspect-square"
                    />
                    <h3 className="text-md text-white mb-0">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
