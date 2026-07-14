import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiShoppingBag, HiStar } from 'react-icons/hi2';

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  discountPercentage?: number;
}

interface SaleCardProps {
  product: Product;
}

export default function SaleCard({ product }: SaleCardProps) {
  const discount = product?.discountPercentage || 0;
  const originalPrice = discount > 0 
    ? product.price / (1 - discount / 100) 
    : product.price;

  return (
    <div data-theme="sage" className="group relative flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-2.5 sm:p-3 transition-all duration-300 hover:shadow-sm w-full">
      <Link href={`/shop/${product.id}`} className="block cursor-pointer flex-1">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--border)]/50 mb-3">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {discount > 0 && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md uppercase tracking-wider shadow-sm z-10 animate-pulse">
              -{discount.toFixed(0)}%
            </div>
          )}
        </div>

        <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-[var(--foreground)] truncate px-1">
          {product.title}
        </h3>

        <div className="flex items-center gap-0.5 my-1 sm:my-1.5 px-1">
          {[...Array(5)].map((_, i) => (
            <HiStar
              key={i}
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                i < Math.round(product.rating) ? 'text-[#c2935c]' : 'text-[var(--border)]'
              }`}
            />
          ))}
        </div>
      </Link>

      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[var(--border)]/40 px-1">
        <div className="flex flex-col">
          {discount > 0 && (
            <span className="text-[10px] sm:text-xs text-zinc-400 line-through leading-none mb-0.5">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold text-rose-600 leading-none">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <Link
          href="/cart"
          aria-label="Add to cart"
          className="p-1.5 sm:p-2 rounded-full text-[var(--muted)] hover:text-rose-600 hover:bg-[var(--border)]/60 transition-colors duration-200"
        >
          <HiShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </div>
  );
}