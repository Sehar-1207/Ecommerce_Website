"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft, HiTruck } from "react-icons/hi2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed.length === 0) {
          router.push("/cart");
        } else {
          setCartItems(parsed);
        }
      } catch (e) {
        console.error(e);
        router.push("/cart");
      }
    } else {
      router.push("/cart");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));
      
      toast.success(`Order confirmed! Thank you, ${formData.firstName}. Your COD package is on its way!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      router.push("/");
    }, 2000);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15.00;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  return (
    <div data-theme="sage" className="min-h-screen bg-[#fcfdfc] text-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/cart" className="text-zinc-400 hover:text-zinc-900 transition-colors p-1">
              <HiArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-serif text-2xl font-bold tracking-tight">Delivery Details</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-[#e8ece8]/40 border border-zinc-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-white outline-none transition-all"
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-[#e8ece8]/40 border border-zinc-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-white outline-none transition-all"
                />
                <input
                  required
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-white outline-none transition-all"
                />
              </div>
              <input
                required
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-white outline-none transition-all"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-white outline-none transition-all"
                />
                <input
                  required
                  type="text"
                  name="postalCode"
                  placeholder="Postal / ZIP Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <HiTruck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-900">Cash on Delivery Only</h3>
                <p className="text-xs text-amber-700/90 mt-1 leading-relaxed">
                  No online card authorization required. You will hand over the exact order sum total directly to our delivery courier agent once your physical package safely reaches your doorstep.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-400 transition-colors duration-200 shadow-md"
            >
              {isProcessing ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-white" />
              ) : (
                `Confirm COD Order — $${total.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 bg-[#e8ece8] border border-zinc-200 rounded-2xl p-6 lg:sticky lg:top-8 h-fit">
          <h2 className="font-serif text-xl font-bold mb-4">Review Items</h2>
          <div className="divide-y divide-zinc-300/40 max-h-72 overflow-y-auto scrollbar-none mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="relative aspect-square h-14 w-14 overflow-hidden rounded-xl bg-white border border-zinc-200">
                  <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-zinc-800 truncate">{item.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Quantity: {item.quantity}</p>
                </div>
                <span className="text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-zinc-300/60 pt-4 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? <span className="text-emerald-700 font-bold">Free</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Estimated Tax</span>
              <span className="font-semibold text-zinc-900">${estimatedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end text-sm pt-3 font-bold text-zinc-900 border-t border-zinc-300/60">
              <span>Total Balance Due</span>
              <span className="text-xl text-emerald-800">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}