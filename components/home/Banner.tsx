"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import bannerImg from "@/public/Images/Hero.jpg";

export default function Banner() {
  return (
    <section data-theme="sage" className="w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="group relative w-full overflow-hidden min-h-[460px] sm:min-h-[540px] md:min-h-[600px] flex items-center justify-center">
        
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={bannerImg}
            alt="Minimalist set up"
            fill
            priority
            placeholder="blur"
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-950/70 to-emerald-950/80 mix-blend-multiply" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-20 sm:px-12 lg:px-16 flex items-center justify-center">
          <div className="flex flex-col items-center max-w-md sm:max-w-lg md:max-w-2xl text-center">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-emerald-400 uppercase mb-4 transition-colors duration-300 group-hover:text-emerald-300">
              Limited Time Offer
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-4 drop-shadow-sm">
              Up to <span className="text-emerald-400">40% Off</span>
            </h2>
            <p className="font-serif text-xl sm:text-2xl md:text-3xl italic text-emerald-100/90 mb-8 drop-shadow-sm">
              on Bestsellers
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-8 py-4 text-base font-semibold text-[var(--background)] shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[var(--accent)]/25 active:scale-[0.98]"
            >
              Grab the Deal
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}