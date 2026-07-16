"use client";

import React, { useEffect, useState } from "react";
import ProductCards from "@/components/home/ProductCards";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = NonNullable<React.ComponentProps<typeof ProductCards>["products"]>[number];

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 15;

  useEffect(() => {
    let isMounted: boolean = true;

    async function fetchProducts() {
      try {
        setIsLoading(true);

        const res = await axios.get<ApiResponse>("https://dummyjson.com/products?limit=100",  {
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

  const totalPages: number = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentProducts: Product[] = products.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              {Array.from({ length: 5 }).map((_, index: number) => (
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
          <div className="mx-auto max-w-7xl pb-16">
            <ProductCards
              products={currentProducts}
              title="Trending Finds"
              subtitle="Handpicked essentials to upgrade your home."
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 px-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, i: number) => {
                  const pageNumber: number = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition ${
                        currentPage === pageNumber
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}