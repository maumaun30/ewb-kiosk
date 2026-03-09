"use client";

import { useState } from "react";

import type { Slide } from "@/lib/types";

import Link from "next/link";

import { ArrowRight, ArrowLeft } from "lucide-react";

import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SliderProps {
  slides: Slide[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation={{ prevEl, nextEl }}
        loop={true}
        autoplay={{
          delay: 7000,
        }}
        pagination={{
          clickable: true,
          el: ".related-pagination",
          bulletClass: "related-bullet",
          bulletActiveClass: "related-bullet-active",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative home-slide">
            {slide.background_image && (
              <div className="absolute inset-0 h-full w-full z-1">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${slide.background_image}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="max-w-6xl py-20 px-5 mx-auto aspect-video flex flex-col justify-center">
              <div className="flex justify-end relative z-2">
                <div className="w-1/2">
                  <div dangerouslySetInnerHTML={{ __html: slide.body ?? "" }} />

                  {slide.field_cta_link && slide.field_cta_title && (
                    <Link
                      href={slide.field_cta_link}
                      className="ew-bg-purple ew-text-green rounded-4xl py-2 px-10 font-semibold inline-flex gap-4 items-center"
                    >
                      <span>{slide.field_cta_title}</span>
                      <ArrowRight />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-0 left-0 z-1 w-full">
        <div className="flex items-center justify-between max-w-6xl mx-auto p-5">
          <div className="related-pagination flex items-center gap-3" />
          <div className="flex items-center gap-2">
            <button
              ref={setPrevEl}
              aria-label="Previous"
              className="flex items-center justify-center w-12 h-12 rounded-full ew-bg-purple transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft color="white" size={18} strokeWidth={2.5} />
            </button>
            <button
              ref={setNextEl}
              aria-label="Next"
              className="flex items-center justify-center w-12 h-12 rounded-full ew-bg-purple text-white transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
          .related.swiper-slide {
            height: auto !important;
            display: flex !important;
          }
          .related-bullet {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: #cccccc;
            cursor: pointer;
            transition: all 0.2s ease;
            opacity: 0.7;
          }
          .related-bullet-active {
            background: var(--purple);
            opacity: 1;
            transform: scale(1.5);
          }
        `}</style>
    </div>
  );
};

export default Slider;
