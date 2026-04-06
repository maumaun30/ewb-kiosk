// home
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
      <header className="flex-none">
        <Slider slides={allSlides} />
      </header>
      <section className="grow ew-bg-purple py-20 px-5 flex flex-col relative">
        <div className="absolute inset-0 h-full w-full z-1 pointer-events-none">
          <Image
            src="/home-bg.jpg"
            alt=""
            height={0}
            width={0}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-2">
          <div>
            {settings.homepage.fields.promo_title.value && (
              <h2 className="ew-text-green mb-5 max-w-150 mx-auto">
                {settings.homepage.fields.promo_title.value}
              </h2>
            )}
            {settings.homepage.fields.promo_content.value ?? (
              <div
                className="text-white max-w-150 mx-auto"
                dangerouslySetInnerHTML={{
                  __html: settings.homepage.fields.promo_content.value,
                }}
              />
            )}
          </div>
          <div className="mt-10">
            {settings.homepage.fields.promo_subtitle.value && (
              <h3 className="text-3xl text-white mb-10 max-w-150 mx-auto">
                {settings.homepage.fields.promo_subtitle.value}
              </h3>
            )}
            <div className="max-w-2xl flex justify-center gap-0 flex-wrap">
              <Link
                href={`/category/`}
                className="aspect-square basis-1/4 grow-0 p-2 flex"
              >
                <div className="w-full rounded-xl flex items-center justify-center flex-col gap-3 text-center text-white p-3 shadow-md ew-bg-pink">
                  <Image
                    src="/all-promos-icon.svg"
                    height={80}
                    width={80}
                    alt="All Promos"
                    className="aspect-square"
                  />
                  <h3 className="text-md text-white mb-0 leading-tight">
                    All Promos
                  </h3>
                </div>
              </Link>

              {categories.map((category, index) => {
                const adjustedIndex = index + 1;
                const col = adjustedIndex % 4;
                const row = Math.floor(adjustedIndex / 4);
                const isPink = (row + col) % 2 === 0;

                return (
                  <Link
                    key={category.tid}
                    href={`/category/${category.tid}`}
                    className="aspect-square basis-1/4 grow-0 p-2 flex"
                  >
                    <div
                      className={`w-full rounded-xl flex items-center justify-center flex-col gap-3 text-center text-white p-3 shadow-md
          ${isPink ? "ew-bg-pink" : "ew-bg-purple"}`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.icon}`}
                        height={80}
                        width={80}
                        alt={category.name}
                        className="aspect-square"
                      />
                      <h3 className="text-md text-white mb-0 leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
