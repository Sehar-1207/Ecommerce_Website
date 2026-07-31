"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import axios from 'axios';
import logo from "@/public/Images/HomeLogo.png";

type AuthMode = 'login' | 'signup';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (redirectTarget === 'cart') {
        router.replace('/cart');
      } else {
        router.replace('/profile');
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';

      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await api.post(endpoint, payload);
      const userData = response.data;

      localStorage.setItem("token", userData.token);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      const userId = userData._id || userData.id;
      const pendingItemData = localStorage.getItem("pending_cart_item");
      const userCartKey = `cart_${userId}`;

      if (pendingItemData) {
        const pendingItem = JSON.parse(pendingItemData);
        const userCartData = localStorage.getItem(userCartKey);
        let userCart = userCartData ? JSON.parse(userCartData) : [];

        const existingIndex = userCart.findIndex((item: any) => item.id === pendingItem.id);
        if (existingIndex > -1) {
          userCart[existingIndex].quantity += 1;
        } else {
          userCart.push(pendingItem);
        }

        localStorage.setItem(userCartKey, JSON.stringify(userCart));
        localStorage.setItem("cart", JSON.stringify(userCart));
        localStorage.removeItem("pending_cart_item");
      } else {
        const savedUserCart = localStorage.getItem(userCartKey);
        if (savedUserCart) {
          localStorage.setItem("cart", savedUserCart);
        }
      }

      window.dispatchEvent(new Event("storage"));

      if (redirectTarget === 'cart') {
        router.push('/cart');
      } else {
        router.push('/profile');
      }

    } catch (err: any) {
      const message = err.response?.data?.message || "An unexpected network error occurred.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setErrorMsg(null);
    setFormData({ name: '', email: '', password: '', agreeToTerms: false });
  };

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen w-full bg-[#fafaf9] flex items-center justify-center p-4 text-[#1c2a21]">
        <div className="w-full max-w-md bg-white border border-[#e2e8e2] rounded-2xl p-6 shadow-sm text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-40 bg-[#e2e8e2] rounded mx-auto"></div>
            <div className="h-6 w-32 bg-[#e2e8e2] rounded mx-auto"></div>
            <div className="h-4 w-48 bg-[#e2e8e2] rounded mx-auto"></div>
            <div className="h-12 w-full bg-[#e2e8e2] rounded-xl mt-6"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#fafaf9] flex items-center justify-center p-4 sm:p-6 lg:p-8 text-[#1c2a21]">
      <div className="w-full max-w-md bg-white border border-[#e2e8e2] rounded-2xl p-6 sm:p-8 shadow-sm transition-all">

        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="relative h-12 w-40 mb-6 transition-transform hover:scale-[1.01]">
            <Image
              src={logo}
              alt="Home & Kitchen Finds"
              fill
              priority
              className="object-contain"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5c6b60]">
            {mode === 'login'
              ? 'Enter your credentials to access your profile'
              : 'Join us to track orders and save kitchen essentials'
            }
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#5c6b60]">
                  <User className="h-4 w-4 stroke-[1.75]" />
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Sarah Jenkins"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8e2] bg-transparent text-sm focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none transition-all placeholder-[#5c6b60]/50"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#5c6b60]">
                <Mail className="h-4 w-4 stroke-[1.75]" />
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8e2] bg-transparent text-sm focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none transition-all placeholder-[#5c6b60]/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">
                Password
              </label>
              {mode === 'login' && (
                <Link href="/forgot-password" className="text-[10px] sm:text-xs font-semibold text-[#2d4a36] hover:underline">
                  Forgot?
                </Link>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#5c6b60]">
                <Lock className="h-4 w-4 stroke-[1.75]" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e2e8e2] bg-transparent text-sm focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none transition-all placeholder-[#5c6b60]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#5c6b60] hover:text-[#1c2a21]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-0.5 h-4 w-4 rounded border-[#e2e8e2] text-[#2d4a36] focus:ring-[#2d4a36] cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-xs text-[#5c6b60] leading-normal select-none cursor-pointer">
                I agree to the <Link href="/terms" className="text-[#2d4a36] font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#2d4a36] font-semibold hover:underline">Privacy Policy</Link>.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-[#2d4a36] py-3 text-sm font-semibold text-white hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            {!loading && <ArrowRight className="h-4 w-4 stroke-[2]" />}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e2e8e2]"></div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#5c6b60]">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#2d4a36] font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up for free' : 'Sign in'}
            </button>
          </p>
        </div>

      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full bg-[#fafaf9] flex items-center justify-center p-4 text-[#1c2a21]">
          <div className="w-full max-w-md bg-white border border-[#e2e8e2] rounded-2xl p-6 shadow-sm text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-40 bg-[#e2e8e2] rounded mx-auto"></div>
              <div className="h-6 w-32 bg-[#e2e8e2] rounded mx-auto"></div>
              <div className="h-4 w-48 bg-[#e2e8e2] rounded mx-auto"></div>
              <div className="h-12 w-full bg-[#e2e8e2] rounded-xl mt-6"></div>
            </div>
          </div>
        </main>
      }
    >
      <AuthForm />
    </Suspense>
  );
}