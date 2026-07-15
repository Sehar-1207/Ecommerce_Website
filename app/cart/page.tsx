"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Unified storage key logic (Keeps guest cart intact)
  const getUserCartKey = (): string => {
    if (typeof window === "undefined") return "cart_guest";
    const currentUserData = localStorage.getItem("currentUser");
    if (!currentUserData) return "cart_guest";
    try {
      const currentUser = JSON.parse(currentUserData);
      return currentUser?.id ? `cart_${currentUser.id}` : "cart_guest";
    } catch {
      return "cart_guest";
    }
  };

  useEffect(() => {
    const loadCartItems = () => {
      if (typeof window === "undefined") return;

      // Safely clean up any legacy 'cart' keys
      if (localStorage.getItem("cart")) {
        localStorage.removeItem("cart");
      }

      const userCartKey = getUserCartKey();
      const savedCart = localStorage.getItem(userCartKey);
      
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing cart storage:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
      setIsLoading(false);
    };

    loadCartItems();
  }, []);

  const saveCart = (items: CartItem[]) => {
    const userCartKey = getUserCartKey();
    localStorage.setItem(userCartKey, JSON.stringify(items));
    setCartItems(items);
    
    // Dispatch custom event to update navbar/header counts if needed
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    saveCart(updatedItems);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d4a36]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#e2e8e2] text-[#1c2a21]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#1c2a21] mb-6 sm:mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center border border-[#e2e8e2]">
            <div className="text-[#5c6b60] mb-4 text-5xl sm:text-6xl">🛒</div>
            <p className="text-[#5c6b60] mb-6 text-base sm:text-lg">Your cart is empty</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm sm:text-base font-semibold uppercase tracking-wider rounded-xl text-white bg-[#2d4a36] hover:bg-[#1c2a21] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-4 border border-[#e2e8e2] shadow-sm"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-[#e2e8e2]/30 rounded-xl overflow-hidden self-center sm:self-start">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-[#1c2a21] truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#2d4a36] font-bold mt-1 text-sm sm:text-base">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#e2e8e2] rounded-xl bg-[#f4f6f4]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 sm:p-2 hover:text-[#2d4a36] text-[#5c6b60] transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <span className="px-3 sm:px-4 text-sm sm:text-base font-semibold text-[#1c2a21] min-w-[20px] sm:min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 sm:p-2 hover:text-[#2d4a36] text-[#5c6b60] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[#5c6b60]/60 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e8e2] shadow-sm h-fit space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-[#1c2a21]">Order Summary</h2>

              <div className="space-y-4 text-sm sm:text-base">
                <div className="flex justify-between text-[#5c6b60]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1c2a21]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#5c6b60]">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-medium">Free</span>
                </div>
                <div className="border-t border-[#e2e8e2] pt-4 flex justify-between text-base sm:text-lg font-bold text-[#1c2a21]">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-3.5 sm:py-4 bg-[#2d4a36] hover:bg-[#1c2a21] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#2d4a36]/10"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}