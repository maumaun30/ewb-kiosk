import { getCategories } from "@/lib/categories";

import Link from "next/link";

import Slider from "@/components/Slider";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <header>
        <Slider />
      </header>
      <section className="ew-bg-purple py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center gap-0 flex-wrap">
            <Link href={`/category/`} className={`basis-1/5 grow-0 p-2`}>
              <div
                className={`rounded-xl flex items-center justify-center flex-col gap-3 aspect-square text-center text-white p-5 shadow-md ew-bg-purple`}
              >
                <h3 className="text-md text-white font-bold">All Promos</h3>
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
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.icon}`}
                    height={120}
                    width={120}
                    alt={category.name}
                    loading="lazy"
                  />
                  <h3 className="text-md text-white font-bold">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
