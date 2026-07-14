"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import SaleCard from './SaleCard';

interface Product {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  discountPercentage?: number;
}

export default function SaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSaleProducts() {
      try {
        const res = await axios.get("https://dummyjson.com/products?limit=30");

        const filtered = (res.data.products || [])
          .filter((p: Product) => p.discountPercentage && p.discountPercentage > 12)
          .sort((a: Product, b: Product) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
          .slice(0, 3);

        if (isMounted) {
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching sale products:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchSaleProducts();

    return () => {
      isMounted = false;
    };
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