"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from './AuthModel'; // Ensure the filename spelling matches 'AuthModel' or 'AuthModal'

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectParam = searchParams.get('redirect');
    const userExists = localStorage.getItem('currentUser');

    if (redirectParam && !userExists) {
      setIsAuthOpen(true);
    }
  }, [searchParams]);

  const handleAuthSuccess = (): void => {
    setIsAuthOpen(false);
    const redirectTo = searchParams.get('redirect');
    
    if (redirectTo) {
      router.push(`/${redirectTo}`);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      {!isAuthOpen && <Navbar onOpenAuth={() => setIsAuthOpen(true)} />}
      
      <main className="flex-grow">{children}</main>
      
      {!isAuthOpen && <Footer />}
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}