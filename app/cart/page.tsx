"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiMinus, HiPlus, HiTrash, HiArrowRight, HiLockClosed } from 'react-icons/hi2';

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  discountPercentage?: number;
}

export default function CartPage() {
  const router = useRouter(); 
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart storage:", error);
      }
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCartItems();
    setIsLoading(false);

    window.addEventListener('storage', loadCartItems);
    return () => {
      window.removeEventListener('storage', loadCartItems);
    };
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15.00;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfdfc] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div data-theme="sage" className="min-h-screen bg-[#fcfdfc] text-[var(--foreground)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-[#e8ece8]/40 border border-[var(--border)] rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-sm text-[var(--muted)] mb-6">
              Looks like you haven&apos;t added anything to your cart yet. Let&apos;s find some upgrades!
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#e8ece8]/40 border border-[var(--border)] rounded-2xl p-4 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-200/60 border border-[var(--border)]">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm sm:text-base font-semibold text-[var(--foreground)] truncate">
                        {item.title}
                      </h2>
                      <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[var(--border)]/60">
                    <div className="flex items-center border border-[var(--border)] bg-[#e8ece8] rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-[var(--muted)] hover:text-rose-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <HiMinus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-xs sm:text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-[var(--muted)] hover:text-emerald-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <HiPlus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm sm:text-base font-bold min-w-[70px] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-zinc-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <HiTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#e8ece8] border border-[var(--border)] rounded-2xl p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 border-b border-[var(--border)] pb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Estimated Tax</span>
                  <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 mb-6">
                <span className="text-base font-medium">Total</span>
                <span className="text-xl font-bold text-emerald-800">${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <div className="bg-[#fcfdfc] border border-[var(--border)] rounded-xl p-3 mb-6 text-xs text-zinc-600">
                  💡 Add <span className="font-bold text-zinc-900">${(150 - subtotal).toFixed(2)}</span> more to qualify for <span className="font-bold text-emerald-600">Free Shipping</span>!
                </div>
              )}

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors duration-200"
              >
                <HiLockClosed className="h-4 w-4" />
                Proceed to Checkout
              </button>

              <div className="text-center mt-4">
                <Link 
                  href="/shop" 
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] font-medium transition-colors"
                >
                  Or continue shopping <HiArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}