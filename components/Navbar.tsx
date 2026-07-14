"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingBag, Menu, X } from 'lucide-react';
import logo from "@/public/Images/HomeLogo.png";

interface NavbarProps {
  onOpenAuth: () => void;
}
interface Links {
  href: string,
  label: string
  isSale?: boolean
}
const navLinks: Links[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collection", label: "Collections" },
  { href: "/sale", label: "Sale", isSale: true },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string): boolean => pathname === path;


  const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setIsOpen(false);

    const userExists = localStorage.getItem('currentUser');
    if (userExists) {
      router.push('/profile');
    } else {
      onOpenAuth();
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e2e8e2] bg-[#f4f6f4]/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 md:h-24 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative h-8 w-32 sm:h-11 sm:w-44 md:h-14 md:w-56 transition-transform duration-200 group-hover:scale-[1.01]">
                <Image
                  src={logo}
                  alt="Home & Kitchen Finds"
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="(max-w-640px) 128px, (max-w-768px) 176px, 224px"
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-5 lg:space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.isSale) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold tracking-wide transition-all border-b-2 pb-1 ${active
                        ? "text-[#2d4a36] border-[#2d4a36]"
                        : "text-[#2d4a36] border-transparent hover:border-[#2d4a36] hover:opacity-80"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors border-b-2 pb-1 ${active
                      ? "text-[#1c2a21] border-[#2d4a36]"
                      : "text-[#5c6b60] border-transparent hover:text-[#1c2a21] hover:border-[#2d4a36]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3 lg:space-x-6">

            <button
              type="button"
              onClick={handleProfileClick}
              aria-label="Account Profile"
              className={`p-2 transition-colors duration-200 rounded-full hover:bg-[#e2e8e2]/30 ${isActive('/profile') ? 'text-[#2d4a36]' : 'text-[#1c2a21] hover:text-[#2d4a36]'
                }`}
            >
              <User className="h-5 w-5 stroke-[1.75]" />
            </button>

            <Link href="/cart" aria-label="Shopping Cart" className={`p-2 transition-colors duration-200 rounded-full hover:bg-[#e2e8e2]/30 ${isActive('/cart') ? 'text-[#2d4a36]' : 'text-[#1c2a21] hover:text-[#2d4a36]'}`}>
              <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
            </Link>

            <Link
              href="/shop"
              className="rounded-full bg-[#2d4a36] px-4 lg:px-6 py-2.5 text-xs lg:text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 md:hidden">
            <Link href="/cart" aria-label="Shopping Cart" className={`relative p-2 ${isActive('/cart') ? 'text-[#2d4a36]' : 'text-[#1c2a21]'}`}>
              <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#1c2a21] p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6 stroke-[1.75]" /> : <Menu className="h-6 w-6 stroke-[1.75]" />}
            </button>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#f4f6f4] border-b border-[#e2e8e2] px-4 pt-2 pb-6 space-y-2 shadow-sm transition-all duration-200 ease-in-out max-h-[calc(100vh-5rem)] overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${active
                    ? "text-[#1c2a21] bg-[#e2e8e2]/70 font-semibold"
                    : link.isSale
                      ? "text-[#2d4a36] hover:bg-[#e2e8e2]/30 font-semibold"
                      : "text-[#5c6b60] hover:text-[#1c2a21] hover:bg-[#e2e8e2]/30"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#e2e8e2] space-y-3">
            <button
              type="button"
              onClick={handleProfileClick}
              className={`flex w-full items-center space-x-2 p-2 rounded-lg ${isActive('/profile') ? 'text-[#1c2a21] bg-[#e2e8e2]/40 font-medium' : 'text-[#5c6b60] hover:bg-[#e2e8e2]/30'}`}
            >
              <User className="h-5 w-5 stroke-[1.75]" />
              <span className="text-sm font-medium">Account</span>
            </button>
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