import type { CSSProperties } from "react";
import { getCategories } from "@/lib/categories";
import { getSettings } from "@/lib/settings";
import Link from "next/link";
import Image from "next/image";
import { TILE_COLUMNS, tileGridWidth } from "./tileGrid";

export default async function HomeCategoriesSection() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  // +1 for the "All Promos" tile
  const rows = Math.ceil((categories.length + 1) / TILE_COLUMNS);

  // Square tiles sized so every row fits the remaining screen height
  const gridStyle: CSSProperties = { width: tileGridWidth(rows) };

  return (
    <section className="flex-1 min-h-0 ew-bg-purple py-10 px-5 flex flex-col relative">
      <div className="absolute inset-0 h-full w-full z-1 pointer-events-none">
        <Image
          src="/home-bg.jpg"
          alt=""
          height={0}
          width={0}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="max-w-6xl w-full mx-auto text-center relative z-2 flex-1 min-h-0 flex flex-col">
        <div className="shrink-0">
          {settings.homepage.fields.promo_title.value && (
            <h2 className="ew-text-green mb-5 max-w-150 mx-auto">
              {settings.homepage.fields.promo_title.value}
            </h2>
          )}
          {settings.homepage.fields.promo_content.value && (
            <div
              className="text-white max-w-150 mx-auto"
              dangerouslySetInnerHTML={{
                __html: settings.homepage.fields.promo_content.value,
              }}
            />
          )}
        </div>
        <div className="mt-6 flex-1 min-h-0 flex flex-col">
          {settings.homepage.fields.promo_subtitle.value && (
            <h3 className="shrink-0 text-3xl text-white mb-6 max-w-150 mx-auto">
              {settings.homepage.fields.promo_subtitle.value}
            </h3>
          )}
          <div className="flex-1 min-h-0 [container-type:size]">
            <div
              className="mx-auto flex justify-center gap-0 flex-wrap"
              style={gridStyle}
            >
              <Link
                href={`/category/`}
                className="aspect-square basis-1/4 grow-0 min-w-0 p-2 flex"
              >
                <div className="w-full min-w-0 [container-type:inline-size] rounded-xl flex items-center justify-center flex-col gap-2 text-center text-white p-3 shadow-md ew-bg-pink overflow-hidden">
                  <Image
                    src="/all-promos-icon.svg"
                    height={80}
                    width={80}
                    alt="All Promos"
                    className="aspect-square w-[45%] max-w-20 h-auto"
                  />
                  <h3 className="text-[min(1.25rem,14cqw)] text-white mb-0 leading-tight max-w-full break-words">
                    All Promos
                  </h3>
                </div>
              </Link>

              {categories.map((category, index) => {
                const adjustedIndex = index + 1;
                const col = adjustedIndex % TILE_COLUMNS;
                const row = Math.floor(adjustedIndex / TILE_COLUMNS);
                const isPink = (row + col) % 2 === 0;

                return (
                  <Link
                    key={category.tid}
                    href={`/category/${category.tid}`}
                    className="aspect-square basis-1/4 grow-0 min-w-0 p-2 flex"
                  >
                    <div
                      className={`w-full min-w-0 [container-type:inline-size] rounded-xl flex items-center justify-center flex-col gap-2 text-center text-white p-3 shadow-md overflow-hidden
          ${isPink ? "ew-bg-pink" : "ew-bg-purple"}`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.icon}`}
                        height={80}
                        width={80}
                        alt={category.name}
                        className="aspect-square w-[45%] max-w-20 h-auto"
                      />
                      <h3 className="text-[min(1.25rem,14cqw)] text-white mb-0 leading-tight max-w-full break-words">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
