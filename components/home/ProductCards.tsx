import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiShoppingBag, HiStar } from 'react-icons/hi2';
import keys from "@/public/Images/keyOrgranizer.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: any;
}

export default function ProductCards() {
  const products: Product[] = [
    { id: "modern-table-lamp", name: "Modern Table Lamp", price: 39.00, rating: 4, image: keys },
    { id: "minimalist-vase-set", name: "Minimalist Vase Set", price: 29.00, rating: 5, image: keys },
    { id: "ceramic-dinner-set", name: "Ceramic Dinner Set", price: 79.00, rating: 4, image: keys },
    { id: "wooden-storage-box", name: "Wooden Storage Box", price: 34.00, rating: 4, image: keys },
    { id: "glass-storage-jars", name: "Glass Storage Jars", price: 24.00, rating: 5, image: keys }
  ];

  return (
    <section data-theme="sage" className="w-full bg-[var(--background)] py-16 px-4 sm:px-6 lg:px-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="h-px w-8 bg-[var(--muted)]/40" />
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Trending Finds
            </h2>
            <span className="h-px w-8 bg-[var(--muted)]/40" />
          </div>
          <p className="text-sm text-[var(--muted)]">
            Handpicked essentials to upgrade your home.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col justify-between bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-3 transition-all duration-300 hover:shadow-sm"
            >
              <Link href={`/shop/${product.id}`} className="block cursor-pointer flex-1">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--border)]/50 mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-w-7xl) 20vw, 50vw"
                  />
                </div>

                <h3 className="text-sm font-semibold tracking-tight text-[var(--foreground)] truncate px-1">
                  {product.name}
                </h3>

                <div className="flex items-center gap-0.5 my-1.5 px-1">
                  {[...Array(5)].map((_, i) => (
                    <HiStar
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < product.rating ? 'text-[#c2935c]' : 'text-[var(--border)]'
                      }`}
                    />
                  ))}
                </div>
              </Link>

              <div className="flex items-center justify-between mt-1 pt-1 border-t border-[var(--border)]/40 px-1">
                <span className="text-sm font-bold text-[var(--foreground)]">
                  ${product.price.toFixed(2)}
                </span>
                <Link
                  href="/cart" 
                  aria-label="Add to cart"
                  className="p-2 rounded-full text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--border)]/60 transition-colors duration-200"
                >
                  <HiShoppingBag className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}