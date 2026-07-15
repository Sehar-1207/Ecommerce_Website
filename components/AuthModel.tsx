"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, X } from 'lucide-react';
import logo from "@/public/Images/HomeLogo.png";

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mockUserId = "user_" + btoa(formData.email).substring(0, 8);
    const joinedDate = `Member since ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`;

    let activeUser;

    if (mode === 'signup') {
      activeUser = {
        id: mockUserId,
        name: formData.name,
        email: formData.email,
        phone: "+1 (555) 000-0000",
        joined: joinedDate
      };
    } else {
      const existingUserRaw = localStorage.getItem('currentUser');
      const existingUser = existingUserRaw ? JSON.parse(existingUserRaw) : null;

      if (existingUser && existingUser.email === formData.email) {
        activeUser = existingUser;
      } else {
        activeUser = {
          id: mockUserId,
          name: formData.email.split('@')[0],
          email: formData.email,
          phone: "+1 (555) 000-0000",
          joined: "Member since today"
        };
      }
    }

    localStorage.setItem('currentUser', JSON.stringify(activeUser));
    
    const guestCart = localStorage.getItem('cart');
    if (guestCart) {
      localStorage.setItem(`cart_${activeUser.id}`, guestCart);
    }

    window.dispatchEvent(new Event('storage'));

    if (onSuccess) onSuccess();
    onClose();
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-[#e2e8e2] rounded-2xl p-6 sm:p-8 shadow-xl">
        
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-1.5 rounded-full text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#fafaf9] transition-all"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative h-10 w-36 mb-4">
            <Image 
              src={logo} 
              alt="NovaNest" 
              fill
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1c2a21]">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="mt-1 text-xs text-[#5c6b60]">
            {mode === 'login' 
              ? 'Enter your credentials to access your profile' 
              : 'Join us to track orders and save kitchen essentials'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#5c6b60]">
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

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#5c6b60]">
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

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#5c6b60]">
              Password
            </label>
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
                id="agreeToTermsModal"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-0.5 h-4 w-4 rounded border-[#e2e8e2] text-[#2d4a36] focus:ring-[#2d4a36] cursor-pointer"
              />
              <label htmlFor="agreeToTermsModal" className="text-[11px] text-[#5c6b60] leading-normal select-none cursor-pointer">
                I agree to the Terms of Service & Privacy Policy.
              </label>
            </div>
          )}

          <button 
            type="submit"
            className="w-full mt-2 rounded-xl bg-[#2d4a36] py-2.5 text-sm font-semibold text-white hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="h-4 w-4 stroke-[2]" />
          </button>
        </form>

        <div className="mt-6 text-center">
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
    </div>
  );
}