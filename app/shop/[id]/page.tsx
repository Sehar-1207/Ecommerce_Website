"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { HiStar, HiOutlineTruck, HiOutlineShieldCheck, HiArrowLeft, HiShoppingBag } from "react-icons/hi2";
import axios from "axios";
import toast from "react-hot-toast";

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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    async function fetchProductAndRelated() {
      try {
        setLoading(true);

        const res = await axios.get<ProductDetail>(`${API_BASE_URL}/products/${productId}`);
        const data = res.data;

        if (!isMounted) return;

        setProduct(data);
        setActiveImage(data.thumbnail || (data.images && data.images[0]) || "");

        if (data.category) {
          const relatedRes = await axios.get(`${API_BASE_URL}/products/category/${data.category}?limit=5`);
          const rawRelated = Array.isArray(relatedRes.data)
            ? relatedRes.data
            : relatedRes.data?.products || [];

          const filtered = rawRelated.filter(
            (p: Product) => String(p.id) !== String(data.id)
          );

          setRelatedProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProductAndRelated();

    return () => {
      isMounted = false;
    };
  }, [productId, API_BASE_URL]);

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

const handleAddToCart = async () => {
  if (!product) return;

  const user = getCurrentUser();

  if (!user) {
    toast.error("Please log in first to add items to your bag!", {
      id: "login-required-toast",
      duration: 3000,
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const { data } = await axios.get(`${API_BASE_URL}/cart`, { headers });
    const currentCart = data.items || [];

    const existingItemIndex = currentCart.findIndex(
      (item: any) => String(item.id) === String(product.id)
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = currentCart.map((item: any, i: number) =>
        i === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...currentCart,
        {
          id: String(product.id),
          name: product.title,
          price: product.price,
          quantity: 1,
          image: product.thumbnail,
        },
      ];
    }

    await axios.put(`${API_BASE_URL}/cart`, { items: updatedCart }, { headers });

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(`${product.title} added to bag!`, {
      id: "add-to-cart-toast",
      duration: 4000,
    });

    setTimeout(() => {
      router.push(`/cart`);
    }, 1000);
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    toast.error("Failed to add item to bag. Please try again.");
  }
};

const handleQuickAddRelated = async (targetProduct: Product) => {
  const user = getCurrentUser();

  if (!user) {
    toast.error("Please log in first to add items to your bag!", {
      id: "login-required-toast",
      duration: 3000,
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const { data } = await axios.get(`${API_BASE_URL}/cart`, { headers });
    const currentCart = data.items || [];

    const existingItemIndex = currentCart.findIndex(
      (item: any) => String(item.id) === String(targetProduct.id)
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = currentCart.map((item: any, i: number) =>
        i === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...currentCart,
        {
          id: String(targetProduct.id),
          name: targetProduct.title,
          price: targetProduct.price,
          quantity: 1,
          image: targetProduct.thumbnail,
        },
      ];
    }

    await axios.put(`${API_BASE_URL}/cart`, { items: updatedCart }, { headers });

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(`${targetProduct.title} added to bag!`, {
      id: "add-to-cart-toast",
      duration: 4000,
    });

    setTimeout(() => {
      router.push(`/cart`);
    }, 1000);
  } catch (error) {
    console.error("Failed to quick-add related item:", error);
    toast.error("Failed to add item to bag. Please try again.");
  }
};

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e2e8e2] border-t-[#2d4a36]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6f4] px-4 text-center">
        <h2 className="font-serif text-2xl font-light tracking-tight text-[#1c2a21] sm:text-3xl">
          Product not found
        </h2>
        <p className="mt-3 text-sm text-[#5c6b60] max-w-xs">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2d4a36] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1c2a21] transition-colors"
        >
          <HiArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const discount = product.discountPercentage || 0;
  const originalPrice = discount > 0 ? product.price / (1 - discount / 100) : product.price;

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-[#1c2a21] selection:bg-[#e2e8e2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-medium tracking-wider text-[#5c6b60] uppercase">
          <Link href="/shop" className="hover:text-[#1c2a21] transition-colors">
            Shop
          </Link>
          <span className="text-[#e2e8e2]">/</span>
          <span className="hover:text-[#1c2a21] transition-colors">{product.category}</span>
          <span className="text-[#e2e8e2]">/</span>
          <span className="text-[#1c2a21] truncate max-w-[100px] sm:max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12 items-start">
          <div className="flex flex-col gap-4 lg:col-span-6 xl:col-span-5 max-w-lg mx-auto lg:mx-0 w-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#e2e8e2]/30 border border-[#e2e8e2]">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="h-full w-full object-cover object-center transition-all duration-500"
                  priority
                />
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-start">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                      activeImage === img
                        ? "border-[#2d4a36] ring-1 ring-[#2d4a36] scale-95"
                        : "border-[#e2e8e2] hover:border-[#5c6b60]"
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

          <div className="flex flex-col lg:col-span-6 xl:col-span-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#5c6b60]">
                  {product.brand || "Generics"}
                </span>
                <span className="text-[#e2e8e2] text-xs">•</span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#5c6b60]">
                  {product.category}
                </span>
              </div>

              <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-light tracking-tight text-[#1c2a21] leading-tight">
                {product.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-[#2d4a36]">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating || 0) ? "fill-current" : "text-[#e2e8e2]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#5c6b60]">
                    ({(product.rating || 0).toFixed(1)})
                  </span>
                </div>
                <span className="hidden sm:inline h-4 w-px bg-[#e2e8e2]" />
                <span
                  className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                    product.stock > 0 ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} Available` : "Out of Stock"}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-[#1c2a21]">
                  ${product.price.toFixed(2)}
                </span>
                {discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-[#5c6b60] line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                      {discount.toFixed(0)}% Off
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-[#e2e8e2] pt-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5c6b60]">
                  Details
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#5c6b60] font-normal">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#e2e8e2] pt-5">
                {product.warrantyInformation && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#e2e8e2]/40 text-[#5c6b60]">
                      <HiOutlineShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#5c6b60] uppercase tracking-wider block">
                        Warranty
                      </span>
                      <span className="mt-0.5 block text-xs sm:text-sm text-[#1c2a21] font-medium">
                        {product.warrantyInformation}
                      </span>
                    </div>
                  </div>
                )}
                {product.shippingInformation && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#e2e8e2]/40 text-[#5c6b60]">
                      <HiOutlineTruck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#5c6b60] uppercase tracking-wider block">
                        Shipping
                      </span>
                      <span className="mt-0.5 block text-xs sm:text-sm text-[#1c2a21] font-medium">
                        {product.shippingInformation}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex w-full items-center justify-center rounded-xl py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase text-center transition-all duration-300 ${
                  product.stock > 0
                    ? "bg-[#2d4a36] text-white hover:bg-[#1c2a21] shadow-md hover:shadow-xl active:scale-[0.99]"
                    : "bg-[#e2e8e2] text-[#5c6b60] cursor-not-allowed pointer-events-none"
                }`}
              >
                {product.stock > 0 ? "Add to Bag" : "Currently Unavailable"}
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-[#e2e8e2] pt-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-light tracking-tight text-[#1c2a21]">
                  You May Also Like
                </h2>
                <p className="text-[10px] sm:text-xs text-[#5c6b60] mt-1">
                  Explore other products in our {product.category} collection.
                </p>
              </div>
              <Link
                href="/shop"
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#1c2a21] hover:text-[#5c6b60] border-b border-[#1c2a21] hover:border-[#e2e8e2] pb-0.5 transition-all duration-300 hidden sm:inline-block"
              >
                View Collection
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <div key={p.id} className="group flex flex-col justify-between">
                  <div className="relative">
                    <Link
                      href={`/shop/${p.id}`}
                      className="block overflow-hidden rounded-xl bg-[#e2e8e2]/40 shadow-sm"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                          src={p.thumbnail}
                          alt={p.title}
                          fill
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </Link>

                    <button
                      onClick={() => handleQuickAddRelated(p)}
                      aria-label="Add to cart"
                      className="absolute bottom-3 right-3 z-10 p-2 sm:p-2.5 rounded-full bg-white text-[#1c2a21] shadow-lg translate-y-2 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 hover:bg-[#2d4a36] hover:text-white"
                    >
                      <HiShoppingBag className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-xs sm:text-sm font-medium text-[#1c2a21] truncate group-hover:text-[#5c6b60] transition-colors duration-200">
                        <Link href={`/shop/${p.id}`}>{p.title}</Link>
                      </h3>
                      <span className="text-xs sm:text-sm font-semibold text-[#1c2a21]">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-auto">
                      <div className="flex items-center text-[#2d4a36]">
                        {[...Array(5)].map((_, i) => (
                          <HiStar
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.round(p.rating || 0)
                                ? "fill-current"
                                : "text-[#e2e8e2]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#5c6b60] font-medium font-sans">
                        ({(p.rating || 0).toFixed(1)})
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