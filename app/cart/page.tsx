"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  useEffect(() => {
    toast.dismiss("add-to-cart-toast");

    const headers = getAuthHeaders();
    if (!headers) {
      setIsLoggedIn(false);
      setCartItems([]);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);

    const loadCart = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/cart`, { headers });
        setCartItems(data.items || []);
      } catch (e) {
        console.error(e);
        toast.error("Couldn't load your cart");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const saveCart = async (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await axios.put(`${API_BASE}/cart`, { items: updatedItems }, { headers });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error(e);
      toast.error("Couldn't save changes to your cart");
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);

    if (updated.length === 0) {
      toast.error("Your shopping cart is empty");
    } else if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.name} from cart`);
    }
  };

  const handleCheckoutProgress = () => {
    toast.success("Proceeding to checkout...", { id: "checkout-redirect" });
    setTimeout(() => {
      router.push('/checkout');
    }, 800);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#fafaf9]">
        <p className="text-xs sm:text-sm text-[#5c6b60]">Loading your cart...</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen w-full bg-[#fafaf9] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1c2a21]">
        <div className="mx-auto max-w-4xl bg-white border border-[#e2e8e2] rounded-2xl p-6 sm:p-12 text-center shadow-sm">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#2d4a36]/5 flex items-center justify-center text-[#2d4a36] mb-4 mx-auto">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
          </div>
          <h2 className="text-sm sm:text-base font-semibold">Log in to view your cart</h2>
          <p className="mt-1.5 text-[11px] sm:text-xs text-[#5c6b60] max-w-xs mx-auto">Your cart is tied to your account and saved securely on our servers.</p>
          <button onClick={() => router.push('/login')} className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2d4a36] px-5 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all">
            Log In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#fafaf9] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1c2a21]">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 sm:mb-8 pb-4 border-b border-[#e2e8e2] flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">Shopping Cart</h1>
            <p className="mt-1 text-[11px] sm:text-sm text-[#5c6b60]">Review items selected for your workspace.</p>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-[#2d4a36]">
            <ShoppingBag className="h-4 w-4 sm:h-6 sm:w-6" />
            <span className="text-[10px] sm:text-sm font-bold bg-[#2d4a36]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">{cartItems.length}</span>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-[#e2e8e2] rounded-2xl p-6 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#2d4a36]/5 flex items-center justify-center text-[#2d4a36] mb-4">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
            </div>
            <h2 className="text-sm sm:text-base font-semibold">Your shopping cart is empty</h2>
            <p className="mt-1.5 text-[11px] sm:text-xs text-[#5c6b60] max-w-xs mx-auto">Items you add to your container profile stack will appear here.</p>
            <button onClick={() => router.push('/')} className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2d4a36] px-5 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-[#e2e8e2] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl bg-[#fafaf9] border border-[#e2e8e2] flex items-center justify-center text-[#2d4a36] flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold tracking-tight truncate pr-2">{item.name}</h3>
                      <p className="text-[11px] sm:text-xs font-medium text-[#5c6b60] mt-0.5">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f1f5f1]">
                    <div className="flex items-center border border-[#e2e8e2] bg-[#fafaf9] rounded-lg p-0.5 sm:p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-[#5c6b60] hover:text-[#1c2a21] transition-all">
                        <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </button>
                      <span className="px-2 sm:px-3 text-[11px] sm:text-xs font-semibold min-w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-[#5c6b60] hover:text-[#1c2a21] transition-all">
                        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold sm:hidden">${(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-[11px] sm:text-sm font-bold uppercase tracking-wider text-[#5c6b60]">Summary</h2>
              <div className="space-y-2.5 pb-4 border-b border-[#e2e8e2]">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#5c6b60]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#5c6b60]">Shipping</span>
                  <span className="text-[#2d4a36]">Calculated next</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-semibold">Estimated Total</span>
                <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="space-y-2 pt-2">
                <button onClick={handleCheckoutProgress} className="w-full inline-flex items-center justify-center rounded-xl bg-[#2d4a36] py-3 text-xs font-semibold text-white hover:opacity-95 transition-all space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="w-full inline-flex items-center justify-center rounded-xl border border-[#e2e8e2] bg-white py-2.5 text-xs font-semibold text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#fafaf9] transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}