"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiShoppingBag, HiStar } from 'react-icons/hi2';
import axios from "axios";

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
}

interface ProductCardsProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductCards({
  products: initialProducts,
  title = "Trending Finds",
  subtitle = "Handpicked essentials to upgrade your home."
}: ProductCardsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);

  useEffect(() => {
    let isMounted = true;

    // If initialProducts are passed from the parent, use them and skip fetching
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }

    async function fetchDefaultProducts() {
      try {
        const res = await axios.get("https://dummyjson.com/products?limit=5");
        if (isMounted) {
          setProducts(res.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching default products:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDefaultProducts();

    return () => {
      isMounted = false;
    };
  }, [initialProducts]); // Safely handles incoming data streams without looping literals

  return (
    <section data-theme="sage" className="w-full bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="h-[1px] w-12 bg-emerald-900/20" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
              {title}
            </h2>
            <span className="h-[1px] w-12 bg-emerald-900/20" />
          </div>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-md mx-auto font-medium opacity-85">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-3.5 animate-pulse"
              >
                <div>
                  <div className="aspect-square w-full rounded-xl bg-zinc-300/40 mb-4" />
                  <div className="h-4 w-3/4 rounded bg-zinc-300/40 mx-1 mb-2" />
                  <div className="h-3 w-1/2 rounded bg-zinc-300/40 mx-1 my-2" />
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]/30 px-1">
                  <div className="h-4 w-12 rounded bg-zinc-300/40" />
                  <div className="h-8 w-8 rounded-full bg-zinc-300/40" />
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)]/40 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 hover:border-[var(--border)]"
              >
                <Link href={`/shop/${product.id}`} className="block cursor-pointer flex-1">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/40 mb-4 shadow-inner">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--foreground)] truncate px-1 transition-colors duration-200 group-hover:text-[var(--accent)]">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-0.5 my-2 px-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`h-3.5 w-3.5 transition-colors duration-300 ${i < Math.round(product.rating) ? 'text-[#c2935c]' : 'text-zinc-300'
                          }`}
                      />
                    ))}
                  </div>
                </Link>

                <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--border)]/30 px-1">
                  <span className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link
                    href="/cart"
                    aria-label="Add to cart"
                    className="p-2.5 rounded-full text-[var(--muted)] hover:text-white hover:bg-[var(--accent)] active:scale-95 shadow-sm hover:shadow-md hover:shadow-[var(--accent)]/10 transition-all duration-300"
                  >
                    <HiShoppingBag className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}