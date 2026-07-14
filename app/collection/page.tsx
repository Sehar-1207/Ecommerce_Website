"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiShoppingBag, HiStar, HiAdjustmentsHorizontal } from 'react-icons/hi2';
import axios from "axios"

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  category: string;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

function CategorySidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategorySidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-28 h-[calc(100vh-9rem)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-transparent [-ms-overflow-style:none] [scrollbar-width:none]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-4">
          Shop By Category
        </h2>
        <ul className="space-y-1 pb-12">
          <li>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-[#e8ece8] text-[var(--foreground)] font-semibold shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[#e8ece8]/40"
              }`}
            >
              All Items
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#e8ece8] text-[var(--foreground)] font-semibold shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[#e8ece8]/40"
              }`}
              >
                {cat.replace('-', ' ')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

useEffect(() => {
    async function initShop() {
      setIsLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://dummyjson.com/products/category-list"),
          axios.get("https://dummyjson.com/products?limit=100")
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data.products || []);
        
      } catch (error) {
        console.error("Error initialising shop data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initShop();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    async function fetchFilteredProducts() {
      setIsLoading(true);
      try {
        const url = selectedCategory === "all"
          ? "https://dummyjson.com/products?limit=40"
          : `https://dummyjson.com/products/category/${selectedCategory}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [selectedCategory, categories]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const existingCartRaw = localStorage.getItem('cart');
      let currentCart: CartItem[] = [];

      if (existingCartRaw) {
        currentCart = JSON.parse(existingCartRaw);
      }

      const exactMatchIdx = currentCart.findIndex((item) => item.id === product.id);

      if (exactMatchIdx > -1) {
        currentCart[exactMatchIdx].quantity += 1;
      } else {
        currentCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Failed to append item to localized storefront:", err);
    }
  };

  return (
    <div data-theme="sage" className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          <div className="flex lg:hidden items-center justify-between pb-4 border-b border-[var(--border)]/40 w-full relative">
            <span className="text-sm font-medium text-[var(--muted)]">
              Showing {products.length} Products
            </span>
            <div className="relative">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e8ece8] border border-[var(--border)] text-sm font-semibold hover:bg-zinc-200/50 transition"
              >
                <HiAdjustmentsHorizontal className="h-4 w-4" />
                Categories
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--background)] border border-[var(--border)] rounded-2xl p-2 max-h-64 overflow-y-auto flex flex-col gap-1 shadow-xl z-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent">
                  <button
                    onClick={() => { setSelectedCategory("all"); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedCategory === "all" ? "bg-[#e8ece8] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)] hover:bg-[#e8ece8]/40"
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        selectedCategory === cat ? "bg-[#e8ece8] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)] hover:bg-[#e8ece8]/40"
                      }`}
                    >
                      {cat.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <CategorySidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <main className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-sm text-[var(--muted)]">
                Showing <span className="font-semibold text-[var(--foreground)]">{products.length}</span> items in <span className="capitalize font-semibold text-[var(--foreground)]">{selectedCategory.replace('-', ' ')}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {isLoading ? (
                [...Array(8)].map((_, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-3 animate-pulse"
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
              ) : products.length === 0 ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-[var(--muted)] font-medium">No products found in this category.</p>
                </div>
              ) : (
                products.map((product) => (
                  <div 
                    key={product.id} 
                    className="group flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-3 transition-all duration-300 hover:shadow-sm"
                  >
                    <Link href={`/shop/${product.id}`} className="block cursor-pointer flex-1">
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--border)]/50 mb-3">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        />
                      </div>

                      <h3 className="text-sm font-semibold tracking-tight text-[var(--foreground)] truncate px-1">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-0.5 my-1.5 px-1">
                        {[...Array(5)].map((_, i) => (
                          <HiStar
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.round(product.rating) ? 'text-[#c2935c]' : 'text-[var(--border)]'
                            }`}
                          />
                        ))}
                      </div>
                    </Link>

                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-[var(--border)]/40 px-1">
                      <span className="text-sm font-bold text-[var(--foreground)]">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        aria-label="Add to cart"
                        className="p-2 rounded-full text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--border)]/60 transition-colors duration-200"
                      >
                        <HiShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}