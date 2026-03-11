"use client";

import { useState } from "react";

import type { Category } from "@/lib/types";

import Link from "next/link";
import Image from "next/image";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  categories: Category[];
  activeCategoryId?: string;
}

export default function CatSlider({ categories, activeCategoryId }: Props) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  const isAllActive = !activeCategoryId;

  // +1 to account for the "All Promos" slide at index 0
  const activeIndex = activeCategoryId
    ? categories.findIndex((c) => String(c.tid) === activeCategoryId) + 1
    : 0;

  return (
    <div className="w-[90%] mx-auto">
      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={5}
        initialSlide={activeIndex}
        navigation={{ prevEl, nextEl }}
      >
        <SwiperSlide className="h-full">
          <Link href={`/category/`} className="block h-full">
            <div
              className={`aspect-square rounded-xl flex items-center justify-center flex-col gap-3 text-center text-white p-3 ew-bg-purple`}
            >
              <Image
                src="/all-promos-icon.svg"
                height={80}
                width={80}
                alt="All Promos"
                className="aspect-square"
              />
              <h3 className="text-md m-0 leading-tight">All Promos</h3>
            </div>
          </Link>
        </SwiperSlide>

        {categories.map((category) => {
          const isActive = String(category.tid) === activeCategoryId;

          return (
            <SwiperSlide key={category.tid} className="h-full">
              <Link href={`/category/${category.tid}`} className="block h-full">
                <div
                  className={`aspect-square rounded-xl flex items-center justify-center flex-col gap-3 text-center text-white p-3 ew-bg-purple`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.icon}`}
                    height={80}
                    width={80}
                    alt={category.name}
                    className="aspect-square"
                  />
                  <h3 className="text-md m-0 leading-tight">{category.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        ref={setPrevEl}
        aria-label="Previous"
        className="absolute left-[calc(5%-6px)] top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full ew-bg-pink transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-1"
      >
        <ArrowLeft color="white" size={18} strokeWidth={2.5} />
      </button>
      <button
        ref={setNextEl}
        aria-label="Next"
        className="absolute right-[calc(5%-6px)] top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full ew-bg-pink text-white hover:opacity-80 transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-1"
      >
        <ArrowRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
