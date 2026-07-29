"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiShoppingBag, HiStar, HiAdjustmentsHorizontal, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import axios from "axios";
import toast from "react-hot-toast";

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

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

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
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; 

  useEffect(() => {
    async function initShop() {
      setIsLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/category-list`),
          axios.get(`${API_BASE_URL}/products?limit=100`)
        ]);
        setCategories(catRes.data);
        const rawProducts = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.products || []);
        setProducts(rawProducts);
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
          ? `${API_BASE_URL}/products?limit=100`
          : `${API_BASE_URL}/products/category/${selectedCategory}?limit=100`;
        
        const res = await axios.get(url);
        const rawProducts = Array.isArray(res.data) ? res.data : (res.data.products || []);
        setProducts(rawProducts);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [selectedCategory, categories]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProducts(products.slice(startIndex, endIndex));
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    
    const element = document.getElementById("shop-main-view");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getCurrentUser = () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    const currentUserData = localStorage.getItem("currentUser");
    if (!token || !currentUserData) return null;
    try {
      const parsed = JSON.parse(currentUserData);
      const userId = parsed?._id || parsed?.id;
      return userId ? { ...parsed, id: userId } : null;
    } catch {
      return null;
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const user = getCurrentUser();

    if (!user) {
      toast.error("Please log in first to add items to your bag!", {
        id: "login-required-toast",
        duration: 3000,
      });
      return;
    }

    try {
      const userCartKey = `cart_${user.id}`;
      const existingCartRaw = localStorage.getItem(userCartKey);
      let currentCart: CartItem[] = existingCartRaw ? JSON.parse(existingCartRaw) : [];

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

      localStorage.setItem(userCartKey, JSON.stringify(currentCart));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success(`${product.title} added to bag!`, {
        id: "add-to-cart-toast",
        duration: 4000,
      });
    } catch (err) {
      console.error("Failed to append item to localized storefront:", err);
      toast.error("Failed to add item to bag. Please try again.");
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

          <main id="shop-main-view" className="flex-1 scroll-mt-10">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-sm text-[var(--muted)]">
                Showing <span className="font-semibold text-[var(--foreground)]">{products.length}</span> items in <span className="capitalize font-semibold text-[var(--foreground)]">{selectedCategory.replace('-', ' ')}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {isLoading ? (
                [...Array(itemsPerPage)].map((_, index) => (
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
              ) : displayedProducts.length === 0 ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-[var(--muted)] font-medium">No products found in this category.</p>
                </div>
              ) : (
                displayedProducts.map((product) => (
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

            {!isLoading && totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)]/30 pt-6">
                <span className="text-xs text-[var(--muted)] font-medium">
                  Showing <span className="font-semibold text-[var(--foreground)]">{Math.min((currentPage - 1) * itemsPerPage + 1, products.length)}</span> to <span className="font-semibold text-[var(--foreground)]">{Math.min(currentPage * itemsPerPage, products.length)}</span> of <span className="font-semibold text-[var(--foreground)]">{products.length}</span> items
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
                            ? "bg-[#e8ece8] border border-[var(--border)] text-[var(--foreground)] font-bold shadow-sm"
                            : "border border-[var(--border)] bg-white/50 text-[var(--muted)] hover:bg-[var(--border)]/30"
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
          </main>

        </div>
      </div>
    </div>
  );
}