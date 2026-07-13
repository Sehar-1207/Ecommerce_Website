"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import logo from "@/public/Images/HomeLogo.png"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e2e8e2] bg-[#f4f6f4]/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative h-10 w-40 transition-transform duration-200 group-hover:scale-[1.01]">
                <Image 
                  src={logo} 
                  alt="Home & Kitchen Finds" 
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="(max-w-7xl) 160px"
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-[#1c2a21] transition-colors border-b-2 border-[#2d4a36] pb-1">
              Home
            </Link>
            <Link href="/shop/accessories" className="text-sm font-medium text-[#5c6b60] hover:text-[#1c2a21] transition-colors border-b-2 border-transparent hover:border-[#2d4a36] pb-1">
              Shop
            </Link>
            <Link href="/collection/all" className="text-sm font-medium text-[#5c6b60] hover:text-[#1c2a21] transition-colors border-b-2 border-transparent hover:border-[#2d4a36] pb-1">
              Collections
            </Link>
            <Link href="/sale/summer" className="text-sm font-medium text-[#2d4a36] hover:opacity-80 transition-all border-b-2 border-transparent hover:border-[#2d4a36] pb-1 tracking-wide font-semibold">
              Sale
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#5c6b60] hover:text-[#1c2a21] transition-colors border-b-2 border-transparent hover:border-[#2d4a36] pb-1">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button aria-label="Search" className="text-[#1c2a21] hover:text-[#2d4a36] transition-colors duration-200 p-1 cursor-pointer">
              <Search className="h-5 w-5 stroke-[1.75]" />
            </button>
            
            <Link href="/profile" aria-label="Account Profile" className="text-[#1c2a21] hover:text-[#2d4a36] transition-colors duration-200 p-1">
              <User className="h-5 w-5 stroke-[1.75]" />
            </Link>

            <Link href="/cart" aria-label="Shopping Cart" className="text-[#1c2a21] hover:text-[#2d4a36] transition-colors duration-200 relative p-1 cursor-pointer">
              <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
            </Link>
            
            <Link 
              href="/shop" 
              className="rounded-full bg-[#2d4a36] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.98]"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex items-center space-x-4 md:hidden">
            <Link href="/cart" aria-label="Shopping Cart" className="text-[#1c2a21] relative p-1">
              <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#1c2a21] p-1 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6 stroke-[1.75]" /> : <Menu className="h-6 w-6 stroke-[1.75]" />}
            </button>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#f4f6f4] border-b border-[#e2e8e2] px-4 pt-2 pb-6 space-y-2 shadow-sm transition-all duration-200 ease-in-out">
          <Link 
            href="/" 
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#1c2a21] bg-[#e2e8e2]/50"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#e2e8e2]/30"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link 
            href="/collection" 
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#e2e8e2]/30"
            onClick={() => setIsOpen(false)}
          >
            Collections
          </Link>
          <Link 
            href="/sale" 
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#2d4a36] hover:bg-[#e2e8e2]/30 font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Sale
          </Link>
          <Link 
            href="/contact" 
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#e2e8e2]/30"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <div className="pt-4 flex items-center justify-around border-t border-[#e2e8e2]">
            <button className="flex items-center space-x-2 text-[#5c6b60] p-2 cursor-pointer">
              <Search className="h-5 w-5 stroke-[1.75]" />
              <span className="text-sm font-medium">Search</span>
            </button>
            <Link 
              href="/profile" 
              className="flex items-center space-x-2 text-[#5c6b60] p-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-5 w-5 stroke-[1.75]" />
              <span className="text-sm font-medium">Account</span>
            </Link>
          </div>
          <div className="pt-4">
            <Link 
              href="/shop"
              className="block text-center w-full rounded-full bg-[#2d4a36] py-3 text-sm font-medium text-white shadow-sm active:scale-[0.99] transition-transform"
              onClick={() => setIsOpen(false)}
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}