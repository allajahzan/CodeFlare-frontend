import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function MySlider() {
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      navigation
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination, Autoplay]}
      className="w-full h-[400px]"
    >
      <SwiperSlide>
        <img src="https://via.placeholder.com/800x400" alt="Slide 1" className="w-full h-full object-cover" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/800x400" alt="Slide 2" className="w-full h-full object-cover" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/800x400" alt="Slide 3" className="w-full h-full object-cover" />
      </SwiperSlide>
    </Swiper>
  );
}
