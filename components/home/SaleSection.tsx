"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from "axios";

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

function SaleCard({ product }: SaleCardProps) {
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

export default function SaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSaleProducts() {
      setIsLoading(true);
      try {
        const res = await axios.get("https://dummyjson.com/products?limit=30");

        const filtered = (res.data.products || [])
          .filter((p: Product) => p.discountPercentage && p.discountPercentage > 12)
          .sort((a: Product, b: Product) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
          .slice(0, 3);

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching sale products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSaleProducts();
  }, []);

  return (
    <section data-theme="sage" className="w-full bg-[var(--background)] py-12 px-4 sm:py-16 sm:px-6 lg:px-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Home Inspiration
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Tips, ideas & inspiration for a better living.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3 bg-[#e8ece8] border border-[var(--border)] rounded-2xl p-3 animate-pulse">
                <div className="aspect-[16/10] w-full rounded-xl bg-zinc-300/40" />
                <div className="h-3 w-1/3 rounded bg-zinc-300/40" />
                <div className="h-5 w-5/6 rounded bg-zinc-300/40" />
              </div>
            ))
          ) : (
            products.map((product) => (
              <SaleCard key={product.id} product={product} />
            ))
          )}
        </div>

      </div>
    </section>
  );
}