"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  discountPercentage?: number;
}

interface SaleCardProps {
  product: Product;
}

export default function SaleCard({ product }: SaleCardProps) {
  if (!product || !product.id) return null;

  return (
    <div className="group flex flex-col space-y-3 w-full bg-[#e8ece8] border border-[var(--border)] rounded-2xl p-3 transition-all duration-300 hover:shadow-md overflow-hidden">
      <Link
        href={`/shop/${product.id}`}
        className="block overflow-hidden rounded-xl bg-white/40"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-750 ease-out group-hover:scale-103"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {product.discountPercentage && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercentage.toFixed(0)}%
            </span>
          )}
        </div>
      </Link>
      
      <div className="flex flex-col px-0.5 pb-1 text-left">
        <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
          <span>July 14, 2026</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-600 truncate max-w-[120px]">
            {product.category}
          </span>
        </div>

        <h3 className="mt-2 text-sm sm:text-base font-bold text-[var(--foreground)] leading-snug tracking-tight group-hover:text-zinc-700 transition-colors">
          <Link href={`/shop/${product.id}`} className="line-clamp-2">
            {product.title} — Save now for just ${product.price.toFixed(2)}
          </Link>
        </h3>
      </div>
    </div>
  );
}