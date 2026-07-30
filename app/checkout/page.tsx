"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShieldCheck, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');
  const [loading, setLoading] = useState(true);

  const [shippingForm, setShippingForm] = useState({
    name: "",
    email: "",
    street: "",
    city: ""
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };
  useEffect(() => {
    const storedUserRaw = localStorage.getItem('currentUser');
    const headers = getAuthHeaders();

    if (!storedUserRaw || !headers) {
      router.push('/login?redirect=cart');
      return;
    }

    try {
      const parsed = JSON.parse(storedUserRaw);
      const id = parsed._id || parsed.id;
      setUserId(id);
      setShippingForm({
        name: parsed.name || "",
        email: parsed.email || "",
        street: "",
        city: ""
      });

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
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    try {
      const orderTotal = calculateTotal();
      const headers = getAuthHeaders();

      const { data } = await axios.post(`${API_BASE}/orders`, {
        shippingForm,
        items: cartItems,
        total: orderTotal,
        paymentMethod: paymentMethod === 'card' ? 'stripe' : 'cod',
      }, { headers });

      if (paymentMethod === 'card' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Order placed — pay on delivery!");
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
      console.log("ORDER ERROR:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#fafaf9]">
        <p className="text-xs sm:text-sm text-[#5c6b60]">Loading checkout...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#fafaf9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1c2a21]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 pb-4 border-b border-[#e2e8e2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="p-2 -ml-2 rounded-xl border border-transparent hover:border-[#e2e8e2] hover:bg-white text-[#5c6b60] hover:text-[#1c2a21] transition-all group"
              aria-label="Go back to cart"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Checkout</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#5c6b60] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2d4a36]" /> Delivery Logistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Recipient Full Name</label>
                  <input type="text" required value={shippingForm.name} onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-xs sm:text-sm bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Notification Email</label>
                  <input type="email" required value={shippingForm.email} onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-xs sm:text-sm bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Street Address</label>
                <input type="text" required value={shippingForm.street} onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })} placeholder="Suite, Appartment, Destination Building" className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-xs sm:text-sm bg-white transition-all" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">City, State, ZIP Region</label>
                <input type="text" required value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} placeholder="California, 90210" className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-xs sm:text-sm bg-white transition-all" />
              </div>
            </div>

            <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#5c6b60] flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#2d4a36]" /> Billing Authorization
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${paymentMethod === 'cod'
                      ? 'border-[#2d4a36]/30 bg-[#2d4a36]/5'
                      : 'border-[#e2e8e2] bg-white hover:bg-[#fafaf9]'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 accent-[#2d4a36]"
                  />
                  <div className="text-xs sm:text-sm flex-1">
                    <p className="font-semibold text-[#1c2a21] flex items-center gap-1.5">
                      Cash on Delivery
                    </p>
                    <p className="text-[#5c6b60] text-[11px] sm:text-xs mt-0.5">Pay with liquid currency upon physical package distribution arrival.</p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${paymentMethod === 'card'
                      ? 'border-[#2d4a36]/30 bg-[#2d4a36]/5'
                      : 'border-[#e2e8e2] bg-white hover:bg-[#fafaf9]'
                    }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-0.5 accent-[#2d4a36]"
                  />
                  <div className="text-xs sm:text-sm flex-1">
                    <p className="font-semibold text-[#1c2a21] flex items-center gap-1.5">
                      Pay by Card (Stripe)
                    </p>
                    <p className="text-[#5c6b60] text-[11px] sm:text-xs mt-0.5">Secure card payment processed at order confirmation.</p>
                  </div>
                </label>
              </div>

              <button type="submit" disabled={isSubmitting || cartItems.length === 0} className="w-full rounded-xl bg-[#2d4a36] py-3 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-50 active:scale-[0.99] transition-all">
                {isSubmitting
                  ? "Processing Order..."
                  : paymentMethod === 'cod'
                    ? "Confirm Cash on Delivery Order"
                    : "Authorize and Complete Order"
                }
              </button>
            </div>
          </form>

          <div className="bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5c6b60] flex items-center gap-2">
              <Package className="h-4 w-4 text-[#2d4a36]" /> Manifest Items
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-xs text-[#5c6b60]">No line items present in staging.</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs border-b border-[#fafaf9] pb-3 last:border-b-0 gap-3">
                    <div className="flex items-center space-x-3 max-w-[75%]">
                      <div className="h-10 w-10 rounded-lg bg-[#fafaf9] border border-[#e2e8e2] flex items-center justify-center text-[#2d4a36] flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold tracking-tight text-[#1c2a21] line-clamp-1">{item.name}</p>
                        <p className="text-[#5c6b60] text-[11px] mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-right flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 border-t border-[#e2e8e2] flex justify-between items-baseline">
              <span className="text-xs font-bold">Total Aggregate</span>
              <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}