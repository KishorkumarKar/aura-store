"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Slide {
  id: number;
  eyebrow: string;
  title: string;
  copy: string;
  cta: { href: string; label: string };
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    eyebrow: "New Arrivals",
    title: "Objects made to be used, not just displayed",
    copy: "Small-batch furniture and textiles from independent makers, chosen for how they age.",
    cta: { href: "/products", label: "Shop the collection" },
    image:
      "https://placehold.co/1600x900/2F4739/F6F3EC?text=Living+Room+Edit",
  },
  {
    id: 2,
    eyebrow: "This Week",
    title: "Linen, restocked in three new colorways",
    copy: "Stonewashed and pre-shrunk, cut generously, and finished by hand.",
    cta: { href: "/products?category=Textiles", label: "Shop Textiles" },
    image: "https://placehold.co/1600x900/B5651D/F6F3EC?text=Linen+Restock",
  },
  {
    id: 3,
    eyebrow: "Studio Notes",
    title: "Walnut bookshelves, built in runs of twelve",
    copy: "We work with one workshop in Vermont — no dropshipping, no unlimited runs.",
    cta: { href: "/products?category=Furniture", label: "Shop Furniture" },
    image: "https://placehold.co/1600x900/5B3A29/F6F3EC?text=Walnut+Workshop",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function goTo(i: number) {
    setIndex(i);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  return (
    <section
      className="relative h-[70vh] min-h-[460px] w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="relative z-10 flex h-full items-center">
            <div className="container-wrap">
              <div className="max-w-xl text-sand">
                <p className="text-xs uppercase tracking-[0.2em] text-sand/80">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-4 font-display text-4xl italic leading-tight sm:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 text-sand/85">{slide.copy}</p>
                <Link
                  href={slide.cta.href}
                  className="mt-8 inline-flex items-center gap-2 bg-sand px-6 py-3 text-sm uppercase tracking-wide text-ink hover:bg-white transition-colors"
                >
                  {slide.cta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-sand" : "w-1.5 bg-sand/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
