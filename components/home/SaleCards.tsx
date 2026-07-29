"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id?: string;
  id?: number | string;
  title: string;
  category?: string;
  thumbnail?: string;
  image?: string;
  images?: string[];
  price: number | string;
  discountPercentage?: number;
  discount?: number;
  createdAt?: string;
}

interface SaleCardProps {
  product: Product;
  dateLabel?: string;
}

export default function SaleCard({ product, dateLabel }: SaleCardProps) {
  if (!product) return null;
  const productId = product._id || product.id;
  if (!productId) return null;

  const productImage =
    product.thumbnail ||
    product.image ||
    (product.images && product.images[0]) ||
    '/placeholder.png';

  const discount = product.discountPercentage ?? product.discount;

  const numericPrice =
    typeof product.price === 'number'
      ? product.price
      : parseFloat(product.price || '0');

  const formattedPrice = numericPrice.toFixed(2);

  const originalPrice =
    discount && discount > 0
      ? (numericPrice / (1 - discount / 100)).toFixed(2)
      : null;

  const displayDate =
    dateLabel ||
    (product.createdAt
      ? new Date(product.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Limited Deal');

  return (
    <div className="group flex flex-col space-y-3 w-full bg-[#e8ece8] border border-[var(--border)] rounded-2xl p-3 transition-all duration-300 hover:shadow-md overflow-hidden">
      <Link
        href={`/shop/${productId}`}
        className="block overflow-hidden rounded-xl bg-white/40"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={productImage}
            alt={product.title}
            fill
            unoptimized
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {discount && discount > 0 && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm">
              -{Math.round(discount)}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-col px-0.5 pb-1 text-left">
        <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
          <span>{displayDate}</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-600 truncate max-w-[120px]">
            {product.category || 'General'}
          </span>
        </div>

        <h3 className="mt-2 text-sm sm:text-base font-bold text-[var(--foreground)] leading-snug tracking-tight group-hover:text-zinc-700 transition-colors">
          <Link href={`/shop/${productId}`} className="line-clamp-2">
            {product.title}
          </Link>
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-[var(--foreground)]">
            ${formattedPrice}
          </span>
          {originalPrice && (
            <span className="text-xs text-zinc-500 line-through">
              ${originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}