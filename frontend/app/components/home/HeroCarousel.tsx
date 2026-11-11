'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  href: string;
  imageUrl?: string;
  gradient: string;
}

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      className="relative h-[22rem] overflow-hidden rounded-3xl border border-white/40 shadow-xs ring-1 ring-black/[0.03] md:h-[25rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={`grid h-full w-full shrink-0 grid-cols-1 items-center gap-4 bg-gradient-to-br p-6 md:grid-cols-2 md:p-10 ${slide.gradient}`}
          >
            <div className="relative z-10 max-w-md">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{slide.eyebrow}</p>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-neutral-900 md:text-4xl">{slide.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">{slide.text}</p>
              <Link
                href={slide.href}
                tabIndex={i === index ? 0 : -1}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.03] hover:bg-neutral-800 active:scale-95"
              >
                {slide.ctaLabel}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative hidden h-full md:block">
              {slide.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.imageUrl}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-y-0 right-0 h-full w-full rounded-[28px] object-cover shadow-xl ring-4 ring-white/60"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md backdrop-blur-md transition-all hover:bg-white active:scale-90 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md backdrop-blur-md transition-all hover:bg-white active:scale-90 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 cursor-pointer rounded-full transition-all ${i === index ? 'w-6 bg-neutral-900' : 'w-2 bg-neutral-900/30 hover:bg-neutral-900/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
