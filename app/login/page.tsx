"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import logo from "@/public/Images/HomeLogo.png";

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'signup') {
      alert(`Account created for ${formData.name || formData.email}!`);
    } else {
      alert(`Welcome back, ${formData.email}!`);
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
    setFormData({ name: '', email: '', password: '', agreeToTerms: false });
  };

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
            className="w-full mt-2 rounded-xl bg-[#2d4a36] py-3 text-sm font-semibold text-white hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="h-4 w-4 stroke-[2]" />
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e2e8e2]"></div>
          </div>
          <span className="relative bg-white px-3.5 text-xs text-[#5c6b60]">Or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e2e8e2] rounded-xl text-xs font-semibold hover:bg-[#fafaf9] transition-all">
            <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66-.61-1.18-1.37-1.67-2.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e2e8e2] rounded-xl text-xs font-semibold hover:bg-[#fafaf9] transition-all">
            <svg className="h-4 w-4 fill-current text-black" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.494 0-1.112.285-1.438.636-.325.352-.519.882-.416 1.385.558.042 1.137-.253 1.458-.62.321-.366.488-.894.396-1.401zm2.34 2.825c-.246-.145-.55-.164-.789-.015-.24.15-.366.425-.366.699 0 .42.348.749.773.749.141 0 .285-.042.399-.126.319-.236.331-.994-.017-1.307zM18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
            </svg>
            <span>Apple</span>
          </button>
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