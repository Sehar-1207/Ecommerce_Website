"use client";

import React, { useEffect, useState } from "react";
import ProductCards from "@/components/home/ProductCards";
import axios from 'axios';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setIsLoading(true);
      
        const res = await axios.get("https://dummyjson.com/products?limit=55", {
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        });

        if (isMounted) {
          setProducts(res.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#fcfcfb]">
      <div className="w-full">
        {isLoading ? (
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200/50 pb-8">
              <div className="space-y-3">
                <div className="h-10 w-64 bg-zinc-200/60 animate-pulse rounded-lg" />
                <div className="h-4 w-80 bg-zinc-200/60 animate-pulse rounded" />
              </div>
              <div className="h-5 w-32 bg-zinc-200/60 animate-pulse rounded self-start md:self-auto" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="aspect-[4/5] w-full bg-zinc-200/60 animate-pulse rounded-2xl" />
                  <div className="flex justify-between items-center gap-4">
                    <div className="h-4 w-2/3 bg-zinc-200/60 animate-pulse rounded" />
                    <div className="h-4 w-12 bg-zinc-200/60 animate-pulse rounded" />
                  </div>
                  <div className="h-3 w-1/3 bg-zinc-200/60 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ProductCards 
            products={products} 
            title="Trending Finds" 
            subtitle="Handpicked essentials to upgrade your home." 
          />
        )}
      </div>
    </main>
  );
}