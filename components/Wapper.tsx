"use client";

import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from './AuthModel';

interface LayoutWrapperProps {
  children: ReactNode;
}

function AuthRedirectTracker({ setIsAuthOpen }: { setIsAuthOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectParam = searchParams.get('redirect');
    const userExists = localStorage.getItem('currentUser');

    if (redirectParam && !userExists) {
      setIsAuthOpen(true);
    }
  }, [searchParams, setIsAuthOpen]);

  return null;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleAuthSuccess = (): void => {
    setIsAuthOpen(false);
    
 
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirect');
    
    if (redirectTo) {
      router.push(`/${redirectTo}`);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirectTracker setIsAuthOpen={setIsAuthOpen} />
      </Suspense>
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