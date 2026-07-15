"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const getUserCartKey = (currentUserId: string | undefined): string => {
    return currentUserId ? `cart_${currentUserId}` : "cart_guest";
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUserData = localStorage.getItem("currentUser");
    let activeUserId: string | undefined = undefined;

    if (currentUserData) {
      try {
        const parsed = JSON.parse(currentUserData);
        if (parsed?.id) {
          activeUserId = parsed.id;
          setUserId(parsed.id);
        }
      } catch (e) {
        console.error("Failed to decode user session", e);
      }
    }

    const targetKey = getUserCartKey(activeUserId);
    const savedCart = localStorage.getItem(targetKey);

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse checkout items:", e);
      }
    }

    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: userId || "guest",
        items: cartItems,
        shippingAddress: formData,
        paymentMethod: "COD",
        total: calculateTotal(),
      };

      console.log("Submitting order payload:", orderPayload);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const targetKey = getUserCartKey(userId);
      localStorage.removeItem(targetKey);
      
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Order placed successfully! Thank you for shopping.", {
        style: {
          background: "#2d4a36",
          color: "#ffffff",
          borderRadius: "12px",
        },
        iconTheme: {
          primary: "#ffffff",
          secondary: "#2d4a36",
        },
      });

      router.push("/");
    } catch (error) {
      console.error("Order process encountered an error:", error);
      
      toast.error("Failed to submit order. Please try again.", {
        style: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
          borderRadius: "12px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d4a36]" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f4] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-[#e2e8e2]">
          <h2 className="text-2xl font-serif font-light text-[#1c2a21] mb-4">Your cart is empty</h2>
          <p className="text-[#5c6b60] mb-8">You cannot checkout with an empty cart.</p>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center w-full py-3 bg-[#2d4a36] hover:bg-[#1c2a21] text-white font-semibold rounded-xl transition-colors uppercase tracking-wider text-sm"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#e2e8e2] text-[#1c2a21]">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#5c6b60] hover:text-[#2d4a36] transition-colors mb-6 sm:mb-8 font-medium text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
          <form onSubmit={handlePlaceOrder} className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e8e2] shadow-sm space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#1c2a21]">Delivery Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#5c6b60] mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#e2e8e2] bg-[#f4f6f4]/30 rounded-xl focus:ring-2 focus:ring-[#2d4a36]/20 focus:border-[#2d4a36] transition-all outline-none text-sm sm:text-base text-[#1c2a21]"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#5c6b60] mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#e2e8e2] bg-[#f4f6f4]/30 rounded-xl focus:ring-2 focus:ring-[#2d4a36]/20 focus:border-[#2d4a36] transition-all outline-none text-sm sm:text-base text-[#1c2a21]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#5c6b60] mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#e2e8e2] bg-[#f4f6f4]/30 rounded-xl focus:ring-2 focus:ring-[#2d4a36]/20 focus:border-[#2d4a36] transition-all outline-none text-sm sm:text-base text-[#1c2a21]"
                    placeholder="123 Street name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#5c6b60] mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#e2e8e2] bg-[#f4f6f4]/30 rounded-xl focus:ring-2 focus:ring-[#2d4a36]/20 focus:border-[#2d4a36] transition-all outline-none text-sm sm:text-base text-[#1c2a21]"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#5c6b60] mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#e2e8e2] bg-[#f4f6f4]/30 rounded-xl focus:ring-2 focus:ring-[#2d4a36]/20 focus:border-[#2d4a36] transition-all outline-none text-sm sm:text-base text-[#1c2a21]"
                      placeholder="Zip/Postal"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e8e2] shadow-sm space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#1c2a21]">Payment Method</h2>
              <div className="border-2 border-[#2d4a36] bg-[#f4f6f4]/40 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#2d4a36]" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-[#1c2a21]">Cash on Delivery (COD)</p>
                    <p className="text-xs text-[#5c6b60]">Pay when your product is delivered</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-4 border-[#2d4a36] bg-white" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#2d4a36] hover:bg-[#1c2a21] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#2d4a36]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing Order..." : `Place Order ($${calculateTotal().toFixed(2)})`}
            </button>
          </form>

          {/* Cart Summary Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e8e2] shadow-sm space-y-6 h-fit">
              <h2 className="text-base sm:text-lg font-bold text-[#1c2a21]">Order Items</h2>
              <div className="divide-y divide-[#e2e8e2] max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between text-sm items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 flex-shrink-0 bg-[#e2e8e2]/30 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-[#1c2a21] truncate">{item.name}</p>
                        <p className="text-xs text-[#5c6b60]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm text-[#1c2a21] flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e2e8e2] pt-4 space-y-2 text-sm sm:text-base">
                <div className="flex justify-between text-[#5c6b60]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1c2a21]">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5c6b60]">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold text-[#1c2a21] border-t border-[#e2e8e2] pt-4">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}