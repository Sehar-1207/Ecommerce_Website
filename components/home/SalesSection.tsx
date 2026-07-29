"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import SaleCard from './SaleCards';

interface Product {
  _id?: string;
  id?: number | string;
  title: string;
  category: string;
  thumbnail?: string;
  image?: string;
  images?: string[];
  price: number;
  discountPercentage?: number;
  discount?: number;
  salePrice?: number;
  createdAt?: string;
}

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export default function SaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSaleProducts() {
      try {
        setIsLoading(true);

        const res = await axios.get(`${API_BASE_URL}/products`);

        const rawProducts: Product[] = Array.isArray(res.data) 
          ? res.data 
          : (res.data.products || []);

        const filtered = rawProducts
          .filter((p: Product) => {
            const discount = p.discountPercentage ?? p.discount ?? 0;
            const hasSalePrice = typeof p.salePrice === 'number' && p.salePrice < p.price;
            return discount > 0 || hasSalePrice;
          })
          .sort((a: Product, b: Product) => {
            const discA = a.discountPercentage ?? a.discount ?? 0;
            const discB = b.discountPercentage ?? b.discount ?? 0;
            return discB - discA;
          })
          .slice(0, 3);

        if (isMounted) {
          setProducts(filtered.length > 0 ? filtered : rawProducts.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching sale products from backend:", error);
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
    <section 
      data-theme="sage" 
      className="w-full bg-[var(--background)] py-12 px-4 sm:py-16 sm:px-6 lg:px-8 text-[var(--foreground)]"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Home Inspiration & Deals
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Handpicked savings and ideas for a better living space.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="flex flex-col space-y-3 bg-[#e8ece8] border border-[var(--border)] rounded-2xl p-3 animate-pulse"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-zinc-300/40" />
                <div className="h-3 w-1/3 rounded bg-zinc-300/40" />
                <div className="h-5 w-5/6 rounded bg-zinc-300/40" />
              </div>
            ))
          ) : (
            products.map((product) => {
              const productId = product._id || product.id;
              if (!productId) return null;

              return (
                <SaleCard 
                  key={productId} 
                  product={product} 
                />
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}