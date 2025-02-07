"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { Pagination, FreeMode } from "swiper/modules";
import Image from "next/image";
import SampleImage from "@/public/images/accounts-icon.png";
const carouselData = [
  {
    id: 1,
    image: SampleImage.src,
    title: "2024 Mercedes-Benz S-Class",
    description: "Experience luxury with cutting-edge technology and premium interiors.",
    price: "$110,000",
    fuelType: "Petrol",
    horsepower: "496 HP",
    buttonText: "Explore Now",
  },
  {
    id: 2,
    image: SampleImage.src,
    title: "Land Rover Defender 110",
    description: "Built for adventure, with rugged durability and off-road capabilities.",
    price: "$68,000",
    fuelType: "Diesel",
    horsepower: "395 HP",
    buttonText: "Check Availability",
  },
  {
    id: 3,
    image:SampleImage.src,
    title: "Tesla Model X Plaid",
    description: "Go green with an all-electric SUV featuring a 340-mile range and autopilot.",
    price: "$98,490",
    fuelType: "Electric",
    horsepower: "1,020 HP",
    buttonText: "Order Now",
  },
  {
    id: 4,
    image: SampleImage.src,
    title: "Porsche 911 Turbo S",
    description: "640 HP, 0-60 in 2.6 sec – a true high-performance masterpiece.",
    price: "$207,000",
    fuelType: "Petrol",
    horsepower: "640 HP",
    buttonText: "View Details",
  },
  {
    id: 5,
    image: SampleImage.src,
    title: "Toyota Highlander Hybrid",
    description: "A spacious, fuel-efficient family SUV with Toyota's legendary reliability.",
    price: "$45,000",
    fuelType: "Hybrid",
    horsepower: "243 HP",
    buttonText: "Find Out More",
  },
];

export default function CarouselTemplate() {
  const [slidesView, setSlidesView] = useState(1.5);
  const [spaceBetween, setSpaceBetween] = useState(10);

  return (
    <div className="max-w-[50%] mx-auto py-6">
      {/* User Controls */}
     

      {/* Swiper Carousel */}
      <Swiper
        slidesPerView={slidesView}
        spaceBetween={spaceBetween}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[Pagination, FreeMode]}
        className="w-full"
      >
        {carouselData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
              {/* Image */}
              <Image src={item.image} alt={item.title} width={400} height={250} className="w-full h-48 object-cover" />

              {/* Car Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>

                {/* Additional Details */}
                <div className="flex justify-between mt-2 text-sm text-gray-700">
                  <span className="font-medium">💲 {item.price}</span>
                  <span>⛽ {item.fuelType}</span>
                  <span>⚡ {item.horsepower}</span>
                </div>

                {/* Call to Action Button */}
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  {item.buttonText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
