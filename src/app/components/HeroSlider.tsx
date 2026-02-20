"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Slider } from "@/lib/types";

const fallbackSlides = [
  {
    title: "Shopping with us for better quality and the best price.",
    subtitle: "Fresh picks, local farms, and same-day delivery across the city.",
    image: "/hero-1.svg",
    badge: "Only this week",
  },
  {
    title: "Up to 30% off on fruits, juices, and daily essentials.",
    subtitle: "Build your healthy cart with our weekly combo offers.",
    image: "/hero-2.svg",
    badge: "Weekly savings",
  },
  {
    title: "Fast delivery, cool storage, and hand-picked quality.",
    subtitle: "From farm to door with live tracking and safe packaging.",
    image: "/hero-3.svg",
    badge: "Fresh promise",
  },
];

type HeroSliderProps = {
  slides?: Slider[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
  const items = useMemo(
    () => (slides && slides.length ? slides : fallbackSlides),
    [slides],
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) {
      setActive(0);
      return;
    }
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl border border-amber-100/70 bg-white shadow-sm md:h-[460px]">
      {items.map((slide, index) => (
        <div
          key={slide._id || slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute bottom-5 left-8 z-10 flex items-center gap-2">
        {items.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setActive(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === active ? "bg-sage" : "bg-amber-200"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2">
        <button
          onClick={() =>
            setActive((prev) => (prev - 1 + items.length) % items.length)
          }
          className="grid h-10 w-10 place-items-center rounded-full border border-amber-100/70 bg-white text-slate-600 shadow-sm hover:bg-amber-50"
          aria-label="Previous slide"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => setActive((prev) => (prev + 1) % items.length)}
          className="grid h-10 w-10 place-items-center rounded-full border border-amber-100/70 bg-white text-slate-600 shadow-sm hover:bg-amber-50"
          aria-label="Next slide"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
