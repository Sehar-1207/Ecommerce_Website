"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { HiStar, HiOutlineTruck, HiOutlineShieldCheck, HiArrowLeft, HiShoppingBag } from "react-icons/hi2";
import axios from "axios";
interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
}

interface ProductDetail extends Product {
  description: string;
  discountPercentage: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    if (!productId) return;

    async function fetchProductAndRelated() {
      try {
        setLoading(true);
        const res = await axios.get(`https://dummyjson.com/products/${productId}`);
        const data: ProductDetail = res.data;
        
        setProduct(data);
        setActiveImage(data.thumbnail);

        const relatedRes = await axios.get(
          `https://dummyjson.com/products/category/${data.category}?limit=5`
        );
        
        const filtered = (relatedRes.data.products || []).filter(
          (p: Product) => p.id !== data.id
        );
        
        setRelatedProducts(filtered.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProductAndRelated();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const savedCart = localStorage.getItem("cart");
      let currentCart = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
          discountPercentage: product.discountPercentage,
        });
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("storage"));
      router.push("/cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleQuickAddRelated = (targetProduct: Product) => {
    try {
      const savedCart = localStorage.getItem("cart");
      let currentCart = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = currentCart.findIndex((item: any) => item.id === targetProduct.id);

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({
          id: targetProduct.id,
          title: targetProduct.title,
          price: targetProduct.price,
          thumbnail: targetProduct.thumbnail,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("storage"));
      router.push("/cart");
    } catch (error) {
      console.error("Failed to quick-add related item:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf9] px-4 text-center">
        <h2 className="font-serif text-2xl font-light tracking-tight text-zinc-900 sm:text-3xl">Product not found</h2>
        <p className="mt-3 text-sm text-zinc-500 max-w-xs">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors">
          <HiArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-zinc-200/60">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16">
        
        <nav className="mb-10 flex items-center gap-2.5 text-xs font-medium tracking-wider text-zinc-400 uppercase">
          <Link href="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
          <span className="text-zinc-300">/</span>
          <span className="hover:text-zinc-900 transition-colors">{product.category}</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-900 truncate max-w-[120px] sm:max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 items-start">
          
          <div className="flex flex-col gap-4 lg:col-span-6 xl:col-span-5 max-w-lg mx-auto lg:mx-0 w-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100/50 border border-zinc-200/40">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-full w-full object-cover object-center transition-all duration-500"
                priority
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none justify-center lg:justify-start">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                      activeImage === img 
                        ? "border-zinc-950 ring-1 ring-zinc-950 scale-95" 
                        : "border-zinc-200/60 hover:border-zinc-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover object-center p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col lg:col-span-6 xl:col-span-7 lg:pl-4 xl:pl-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {product.brand || "Generics"}
                </span>
                <span className="text-zinc-300 text-xs">•</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {product.category}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-light tracking-tight text-zinc-900 leading-tight">
                {product.title}
              </h1>

              <div className="mt-5 flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-[#c2935c]">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating) ? "fill-current" : "text-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-zinc-600">({product.rating.toFixed(1)})</span>
                </div>
                <span className="h-4 w-px bg-zinc-200" />
                <span className={`text-xs font-semibold uppercase tracking-wider ${product.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                  {product.stock > 0 ? `${product.stock} Available` : "Out of Stock"}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-light tracking-tight text-zinc-900">${product.price.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-md">
                      {product.discountPercentage.toFixed(0)}% Off
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-zinc-200/50 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Details</h3>
                <p className="mt-3.5 text-sm leading-relaxed text-zinc-600 font-normal">
                  {product.description}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-zinc-200/50 pt-6">
                {product.warrantyInformation && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-zinc-100 text-zinc-600">
                      <HiOutlineShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Warranty</span>
                      <span className="mt-0.5 block text-xs sm:text-sm text-zinc-700 font-medium">{product.warrantyInformation}</span>
                    </div>
                  </div>
                )}
                {product.shippingInformation && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-zinc-100 text-zinc-600">
                      <HiOutlineTruck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Shipping</span>
                      <span className="mt-0.5 block text-xs sm:text-sm text-zinc-700 font-medium">{product.shippingInformation}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex w-full items-center justify-center rounded-xl py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase text-center transition-all duration-300 ${
                  product.stock > 0 
                    ? "bg-zinc-950 text-white hover:bg-zinc-800 shadow-md hover:shadow-xl hover:shadow-zinc-900/10 active:scale-[0.99]" 
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed pointer-events-none"
                }`}
              >
                {product.stock > 0 ? "Add to Bag" : "Currently Unavailable"}
              </button>
            </div>
          </div>

        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-zinc-200/50 pt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-zinc-900">
                  You May Also Like
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Explore other products in our {product.category} collection.
                </p>
              </div>
              <Link 
                href="/shop" 
                className="text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-500 border-b border-zinc-900 hover:border-zinc-300 pb-1 transition-all duration-300 hidden sm:inline-block"
              >
                View Collection
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id} className="group flex flex-col justify-between">
                  <div className="relative">
                    <Link href={`/shop/${p.id}`} className="block overflow-hidden rounded-xl bg-zinc-100 shadow-sm">
                      <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                          src={p.thumbnail}
                          alt={p.title}
                          fill
                          className="object-cover object-center transition-transform duration-750 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </Link>

                    <button
                      onClick={() => handleQuickAddRelated(p)}
                      aria-label="Add to cart"
                      className="absolute bottom-3 right-3 z-10 p-2.5 rounded-full bg-white text-zinc-900 shadow-lg translate-y-2 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 hover:bg-zinc-900 hover:text-white"
                    >
                      <HiShoppingBag className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-xs sm:text-sm font-medium text-zinc-800 truncate group-hover:text-zinc-500 transition-colors duration-200">
                        <Link href={`/shop/${p.id}`}>
                          {p.title}
                        </Link>
                      </h3>
                      <span className="text-xs sm:text-sm font-semibold text-zinc-900">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-auto">
                      <div className="flex items-center text-[#c2935c]">
                        {[...Array(5)].map((_, i) => (
                          <HiStar
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.round(p.rating) ? "fill-current" : "text-zinc-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        ({p.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}