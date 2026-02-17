"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
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

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl border border-amber-100/70 bg-white shadow-sm md:h-[460px]">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
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
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/10" />
          <div className="relative z-10 flex h-full max-w-[60%] flex-col justify-center px-8 py-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage shadow-sm">
              {slide.badge}
            </span>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-deep md:text-4xl">
              {slide.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              {slide.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/products"
                className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-200/60"
              >
                Shop now
              </a>
              <a
                href="#featured"
                className="rounded-full border border-sage/20 px-6 py-3 text-sm font-semibold text-sage"
              >
                View deals
              </a>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-5 left-8 z-10 flex items-center gap-2">
        {slides.map((_, index) => (
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
            setActive((prev) => (prev - 1 + slides.length) % slides.length)
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
          onClick={() => setActive((prev) => (prev + 1) % slides.length)}
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
