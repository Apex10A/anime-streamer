'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import styles from "./HeroSection.module.css";
import Banner from "./Banner";
import { Anime } from '@/types/anime';

interface HeroSectionProps {
  featuredAnimes?: Anime[];
}

export default function HeroSection({ featuredAnimes = [] }: HeroSectionProps) {
  return (
    <section className="relative h-[600px] px-4 max-[1390px]:h-[530px] max-[1300px]:h-[500px] max-md:h-[420px] overflow-hidden bg-black">
      {/* Navigation Buttons */}
      <div className={`absolute right-5 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-20 ${styles.navigationButtons}`}>
        <div className={`${styles.buttonNext} button-next w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors duration-300`}></div>
        <div className={`${styles.buttonPrev} button-prev w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors duration-300`}></div>
      </div>

      {featuredAnimes && featuredAnimes.length > 0 ? (
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop
          allowTouchMove
          navigation={{
            nextEl: ".button-next",
            prevEl: ".button-prev",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Navigation, Autoplay, Pagination]}
          className={`h-full ${styles.heroSwiper}`}
          style={{
            "--swiper-pagination-color": "#9333ea",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-opacity": "0.3",
          } as React.CSSProperties}
        >
          {featuredAnimes.map((item, index) => (
            <SwiperSlide key={index} className="relative group">
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              <Banner item={item} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No featured anime available</p>
          </div>
        </div>
      )}
    </section>
  );
}
