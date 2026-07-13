"use client";

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi2';
import { FaLeaf } from "react-icons/fa6";
import keys from "@/public/Images/keyOrgranizer.jpg"
import hooks from "@/public/Images/hooks.jpg"


export default function FeaturesSection() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section data-theme="sage" className="w-full bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={fadeInUp}
          className="relative flex flex-col sm:flex-row justify-between items-stretch overflow-hidden rounded-2xl border border-[var(--border)] bg-[#e8ece8] p-6 sm:p-8 min-h-[180px]"
        >
          <div className="flex-1 flex flex-col justify-center max-w-xs z-10 pr-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--background)]">
                <HiCheckCircle className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                Stylish & Functional
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Keep keys, mail & small items organized in one beautiful spot.
            </p>
          </div>
          <div className="relative mt-4 sm:mt-0 w-full sm:w-1/2 h-40 sm:h-auto rounded-xl overflow-hidden shadow-sm border border-[var(--border)]/60 shrink-0 bg-[var(--border)]/50">
            <Image
              src={keys}
              alt="Stylish key organizer with plant"
              fill
              className="object-cover object-center"
              sizes="(max-w-7xl) 50vw, 33vw"
            />
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="relative flex flex-col sm:flex-row justify-between items-stretch overflow-hidden rounded-2xl border border-[var(--border)] bg-[#e8ece8] p-6 sm:p-8 min-h-[180px]"
        >
          <div className="flex-1 flex flex-col justify-center max-w-xs z-10 pr-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--background)]">
                <FaLeaf className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                Premium Quality
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Durable wood, sturdy metal hooks & a sleek modern finish.
            </p>
          </div>
          <div className="relative mt-4 sm:mt-0 w-full sm:w-1/2 h-40 sm:h-auto rounded-xl overflow-hidden shadow-sm border border-[var(--border)]/60 shrink-0 bg-[var(--border)]/50">
            <Image
              src={hooks}
              alt="Premium close up metal hooks"
              fill
              className="object-cover object-center"
              sizes="(max-w-7xl) 50vw, 33vw"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}