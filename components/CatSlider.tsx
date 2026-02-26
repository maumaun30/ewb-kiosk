"use client";

import type { Category } from "@/lib/types";

import Link from "next/link";
import Image from "next/image";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";


interface Props {
  categories: Category[];
}

export default function CatSlider({ categories }: Props) {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={0}
      slidesPerView={"auto"}
      navigation
      wrapperClass="gap-2"
    >
      <SwiperSlide className="basis-[calc(100%/7-((7-1)*8px)/7)] shrink-0 grow-1 h-full">
        <Link href={`/category/`} className="block h-full">
          <div className="aspect-square rounded-xl flex items-center justify-center flex-col gap-1 text-center text-white p-2 shadow-md ew-bg-purple">
            <Image
              src="/all-promos-icon.svg"
              height={60}
              width={60}
              alt="All Promos"
            />
            <h3 className="text-md font-bold">All Promos</h3>
          </div>
        </Link>
      </SwiperSlide>

      {categories.map((category, index) => (
        <SwiperSlide
          key={category.tid}
          className="basis-[calc(100%/7-((7-1)*8px)/7)] shrink-0 grow-1 h-full"
        >
          <Link href={`/category/${category.tid}`} className="block h-full">
            <div className="aspect-square rounded-xl flex items-center justify-center flex-col gap-1 text-center text-white p-2 shadow-md ew-bg-purple">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.icon}`}
                height={60}
                width={60}
                alt={category.name}
              />
              <h3 className="text-md font-bold">{category.name}</h3>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
