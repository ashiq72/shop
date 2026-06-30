"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Slider } from "@/lib/types";

const fallbackSlides: Slider[] = [
  {
    title: "Fresh market essentials, delivered to your door.",
    subtitle:
      "Shop produce, pantry staples, and everyday favorites from one trusted local storefront.",
    image: "/store-hero.jpg",
    buttonText: "Shop the catalog",
    link: "/products",
  },
];

export default function HeroSlider({ slides }: { slides?: Slider[] }) {
  const items = useMemo(
    () => (slides?.length ? slides : fallbackSlides),
    [slides],
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const interval = window.setInterval(
      () => setActive((value) => (value + 1) % items.length),
      6000,
    );
    return () => window.clearInterval(interval);
  }, [items.length]);

  const move = (direction: number) =>
    setActive((value) => (value + direction + items.length) % items.length);

  return (
    <section className="store-hero" aria-label="Store promotions">
      {items.map((slide, index) => (
        <div
          className={`store-hero-slide ${index === active ? "active" : ""}`}
          key={slide._id || slide.title}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="store-hero-shade" />
          <div className="store-shell store-hero-content">
            <p>Freshly selected</p>
            <h1>{slide.title}</h1>
            {slide.subtitle ? <span>{slide.subtitle}</span> : null}
            <Link href={slide.link || "/products"}>
              {slide.buttonText || "Shop now"}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      ))}

      {items.length > 1 ? (
        <>
          <div className="store-hero-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous slide">
              <ArrowLeft size={19} />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next slide">
              <ArrowRight size={19} />
            </button>
          </div>
          <div className="store-hero-dots">
            {items.map((slide, index) => (
              <button
                type="button"
                key={slide._id || `${slide.title}-${index}`}
                className={index === active ? "active" : ""}
                onClick={() => setActive(index)}
                aria-label={`Show promotion ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
