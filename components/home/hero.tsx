"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { HiSparkles } from 'react-icons/hi2';
import hero from "@/public/Images/cremicSet.jpg";

export default function Hero() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  return (
    <section className="relative w-full bg-[#f4f6f4] text-[#1c2a21] font-sans overflow-hidden transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-20 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            className="lg:col-span-5 space-y-6 md:space-y-8 text-left z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e2e8e2] bg-[#e2e8e2]/30 text-xs font-semibold tracking-wider text-[#2d4a36] uppercase"
            >
              <HiSparkles className="h-3.5 w-3.5 text-[#2d4a36]" />
              New Summer Collection Available
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c2a21] leading-[1.1]"
            >
              Organize your space, <br />
              <span className="italic text-[#2d4a36] font-normal">elevate your daily life.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#5c6b60] max-w-md leading-relaxed"
            >
              Meticulously crafted kitchenware, functional storage, and minimalist home design components engineered for modern intentional living.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link 
                href="/collection" 
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#2d4a36] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
              >
                Explore Collections
                <HiArrowLongRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              
              <Link 
                href="/sale" 
                className="inline-flex items-center justify-center rounded-full border border-[#e2e8e2] bg-transparent px-8 py-4 text-sm font-semibold text-[#1c2a21] transition-all duration-200 hover:bg-[#e2e8e2]/40 active:scale-[0.98]"
              >
                View Seasonal Offers
              </Link>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-[#e2e8e2] max-w-sm"
            >
              <div>
                <p className="font-serif text-xl font-bold text-[#1c2a21]">12k+</p>
                <p className="text-[11px] uppercase tracking-wider text-[#5c6b60]">Items Sold</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#1c2a21]">4.9★</p>
                <p className="text-[11px] uppercase tracking-wider text-[#5c6b60]">User Rating</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#1c2a21]">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-[#5c6b60]">Organic Materials</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="lg:col-span-7 relative w-full flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.610, 0.355, 1.000] }}
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[6/5] max-w-2xl rounded-2xl overflow-hidden bg-[#e2e8e2]/50 shadow-sm border border-[#e2e8e2]">
              <Image
                src={hero}
                alt="Minimalist Nordic kitchen and storage design interior lookbook"
                fill
                priority
                placeholder="blur"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                sizes="(max-w-7xl) 100vw, 50vw"
              />
            </div>
            
            <motion.div 
              className="absolute hidden sm:flex -bottom-6 -left-6 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-[#e2e8e2] shadow-sm items-center gap-3 max-w-xs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="h-10 w-10 bg-[#2d4a36] rounded-lg flex items-center justify-center text-white text-lg">
                <HiSparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1c2a21]">Premium Ceramic Set</p>
                <p className="text-[11px] text-[#5c6b60]">Restocked & ready to ship</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}