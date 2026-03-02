"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function Slider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      // onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log("slide change")}
    >
      <SwiperSlide>
        <div className="max-w-6xl py-20 px-5 mx-auto aspect-video flex flex-col justify-center">
          <div className="flex justify-end">
            <div className="w-1/2">
              <h2 className="ew-text-purple mb-5">
                Start Your Banking Journey with Ease
              </h2>
              <p className="mb-5">
                Open your EastWest account anytime, anywhere with EasyWay.
              </p>
              <Link
                href="/"
                className="ew-bg-purple ew-text-green rounded-sm px-5 py-3 font-bold inline-flex gap-2 items-center"
              >
                <span>Open Your Account Today</span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
