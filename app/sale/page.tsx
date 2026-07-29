"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiShoppingBag, HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  discountPercentage: number;
}

interface SaleProps {
  title?: string;
  subtitle?: string;
  itemsPerPage?: number;
}

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export default function Sale({
  title = "Exclusive Offers",
  subtitle = "Unmissable deals on premium essentials. Limited time only.",
  itemsPerPage = 10
}: SaleProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSaleProducts() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/products?limit=100`);

        const rawProducts = Array.isArray(response.data)
          ? response.data
          : response.data?.products || [];

        const filtered = rawProducts
          .filter((p: Product) => p.discountPercentage && p.discountPercentage > 12)
          .sort((a: Product, b: Product) => (b.discountPercentage || 0) - (a.discountPercentage || 0));

        setAllProducts(filtered);
      } catch (error) {
        console.error("Error fetching sale products with axios:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSaleProducts();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProducts(allProducts.slice(startIndex, endIndex));
  }, [allProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    
    const element = document.getElementById("sale-section");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      id="sale-section"
      data-theme="sage" 
      className="w-full bg-[var(--background)] py-12 px-4 sm:py-16 sm:px-6 lg:px-8 text-[var(--foreground)] transition-all duration-300"
    >
      <div className="mx-auto max-w-7xl">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="h-px w-8 bg-rose-600/40" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              {title}
            </h2>
            <span className="h-px w-8 bg-rose-600/40" />
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] px-4">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {isLoading ? (
            [...Array(itemsPerPage)].map((_, index) => (
              <div 
                key={index} 
                className="flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-2.5 sm:p-3 animate-pulse"
              >
                <div>
                  <div className="aspect-square w-full rounded-xl bg-zinc-300/50 mb-3" />
                  <div className="h-4 w-3/4 rounded bg-zinc-300/50 mx-1 mb-2" />
                  <div className="h-3 w-1/2 rounded bg-zinc-300/50 mx-1 my-2" />
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]/40 px-1">
                  <div className="h-4 w-12 rounded bg-zinc-300/50" />
                  <div className="h-8 w-8 rounded-full bg-zinc-300/50" />
                </div>
              </div>
            ))
          ) : (
            displayedProducts.map((product) => {
              const originalPrice = product.price / (1 - product.discountPercentage / 100);
              
              return (
                <div 
                  key={product.id} 
                  className="group relative flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-2.5 sm:p-3 transition-all duration-300 hover:shadow-sm"
                >
                  <Link href={`/shop/${product.id}`} className="block cursor-pointer flex-1">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--border)]/50 mb-3">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md uppercase tracking-wider shadow-sm z-10 animate-pulse">
                        -{product.discountPercentage.toFixed(0)}%
                      </div>
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
                      <span className="text-[10px] sm:text-xs text-zinc-400 line-through leading-none mb-0.5">
                        ${originalPrice.toFixed(2)}
                      </span>
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
            })
          )}
        </div>
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)]/30 pt-6">
            <span className="text-xs text-[var(--muted)] font-medium">
              Showing <span className="font-semibold text-[var(--foreground)]">{Math.min((currentPage - 1) * itemsPerPage + 1, allProducts.length)}</span> to <span className="font-semibold text-[var(--foreground)]">{Math.min(currentPage * itemsPerPage, allProducts.length)}</span> of <span className="font-semibold text-[var(--foreground)]">{allProducts.length}</span> markdowns
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-[var(--border)] bg-white/50 text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--border)]/30 transition-all"
                aria-label="Previous Page"
              >
                <HiChevronLeft className="h-4 w-4" />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      currentPage === pageNum
                        ? "bg-rose-600 text-white shadow-sm"
                        : "border border-[var(--border)] bg-white/50 text-[var(--foreground)] hover:bg-[var(--border)]/30"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-[var(--border)] bg-white/50 text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--border)]/30 transition-all"
                aria-label="Next Page"
              >
                <HiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}