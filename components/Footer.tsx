"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6';
import { HiArrowRight } from 'react-icons/hi2';
import logo from "@/public/Images/HomeLogo.png";

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing, ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="w-full border-t border-[#e2e8e2] bg-[#f4f6f4] text-[#1c2a21] font-sans transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#e2e8e2]">
          
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block relative h-14 w-50">
              <Image 
                src={logo} 
                alt="Home & Kitchen Finds" 
                fill
                priority
                className="object-contain object-left"
              />
            </Link>
            <p className="text-sm leading-relaxed text-[#5c6b60] max-w-sm">
              Elevating daily living with meticulously curated kitchenware and organic interior design pieces. Discover beautiful functionality built to last.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" aria-label="Facebook" className="p-2.5 bg-[#e2e8e2]/40 rounded-full text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#e2e8e2]/80 transition-all duration-200">
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2.5 bg-[#e2e8e2]/40 rounded-full text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#e2e8e2]/80 transition-all duration-200">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2.5 bg-[#e2e8e2]/40 rounded-full text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#e2e8e2]/80 transition-all duration-200">
                <FaTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1c2a21] mb-5">Shop Collections</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-[#5c6b60] hover:text-[#2d4a36] transition-colors">Kitchen & Dining</Link></li>
              <li><Link href="/shop" className="text-sm text-[#5c6b60] hover:text-[#2d4a36] transition-colors">Storage & Organization</Link></li>
              <li><Link href="/shop" className="text-sm text-[#5c6b60] hover:text-[#2d4a36] transition-colors">Home Decor Elements</Link></li>
              <li><Link href="/sale" className="text-sm text-[#2d4a36] font-medium hover:opacity-80 transition-opacity">Sale Specials</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1c2a21] mb-5">Newsletter</h3>
            <p className="text-sm text-[#5c6b60] mb-4 leading-relaxed">
              Subscribe to unlock editorial design insights and 10% off your initial transaction.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-[#1c2a21] py-1">
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-[#1c2a21] placeholder-[#5c6b60]/60 outline-none pr-8 py-1 font-medium"
              />
              <button 
                type="submit" 
                aria-label="Subscribe"
                className="absolute right-0 text-[#1c2a21] hover:text-[#2d4a36] transition-colors p-1 cursor-pointer"
              >
                <HiArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-2 sm:space-y-0 text-xs text-[#5c6b60]">
            <span>&copy; {new Date().getFullYear()} Home&Kitchen Finds. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c6b60] mr-2">Secure Payments</span>
            <div className="h-5 w-8 bg-[#e2e8e2] rounded flex items-center justify-center font-bold text-[8px] text-[#5c6b60]">VISA</div>
            <div className="h-5 w-8 bg-[#e2e8e2] rounded flex items-center justify-center font-bold text-[8px] text-[#5c6b60]">MC</div>
            <div className="h-5 w-8 bg-[#e2e8e2] rounded flex items-center justify-center font-bold text-[8px] text-[#5c6b60]">AMEX</div>
            <div className="h-5 w-8 bg-[#e2e8e2] rounded flex items-center justify-center font-bold text-[8px] text-[#5c6b60]">PAYPAL</div>
          </div>
        </div>

      </div>
    </footer>
  );
}