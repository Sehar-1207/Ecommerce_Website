"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import bannerImg from "@/public/Images/Hero.jpg";

export default function Banner() {
  return (
    <section data-theme="sage" className="w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative w-full overflow-hidden min-h-[400px] sm:min-h-[480px] md:min-h-[520px] flex items-center">
        
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImg}
            alt="Minimalist set up"
            fill
            priority
            placeholder="blur"
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-emerald-900/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-16 sm:px-12 lg:px-16 flex items-center">
          <div className="flex flex-col items-start max-w-md md:max-w-xl text-left">
            <span className="text-xs font-bold tracking-widest text-emerald-300 uppercase mb-3">
              Limited Time Offer
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-3">
              Up to <span className="text-emerald-400">40% Off</span>
            </h2>
            <p className="font-serif text-xl sm:text-2xl italic text-emerald-100/90 mb-8">
              on Bestsellers
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-8 py-4 text-base font-semibold text-[var(--background)] shadow-md transition-all duration-200 hover:opacity-95 active:scale-[0.98]"
            >
              Grab the Deal
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}