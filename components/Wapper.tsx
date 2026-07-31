"use client";

import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
    const authParam = searchParams.get('auth');
    const userExists = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;

    if ((redirectParam || authParam === 'true') && !userExists) {
      setIsAuthOpen(true);
    } else {
      setIsAuthOpen(false);
    }
  }, [searchParams, setIsAuthOpen]);

  return null;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/auth';

  const shouldHideLayout = isAuthOpen || isAuthPage;

  const handleClose = () => {
    setIsAuthOpen(false);
    if (!isAuthPage) {
      router.replace(pathname);
    }
  };

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

      {!shouldHideLayout && <Navbar />}
      
      <main className="flex-grow">{children}</main>
      
      {!shouldHideLayout && <Footer />}
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={handleClose} 
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}