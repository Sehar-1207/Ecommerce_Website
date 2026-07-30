"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckCircle2, XCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const token = localStorage.getItem('token');

    if (!sessionId || !token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await axios.get(`${API_BASE}/orders/verify-payment`, {
          params: { sessionId },
          headers: { Authorization: `Bearer ${token}` },
        });
        window.dispatchEvent(new Event("cartUpdated"));
        setStatus('success');
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="bg-white border border-[#e2e8e2] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
      {status === 'verifying' && <p className="text-sm text-[#5c6b60]">Confirming your payment...</p>}

      {status === 'success' && (
        <>
          <CheckCircle2 className="h-10 w-10 text-[#2d4a36] mx-auto mb-3" />
          <h1 className="text-xl font-semibold mb-1">Payment confirmed</h1>
          <p className="text-sm text-[#5c6b60] mb-5">Your order has been placed successfully.</p>
          <button
            onClick={() => router.push('/profile')}
            className="rounded-xl bg-[#2d4a36] px-5 py-2.5 text-xs font-semibold text-white hover:opacity-95"
          >
            View my orders
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
          <h1 className="text-xl font-semibold mb-1">Couldn&apos;t confirm payment</h1>
          <p className="text-sm text-[#5c6b60] mb-5">Contact support if you were charged.</p>
          <button
            onClick={() => router.push('/cart')}
            className="rounded-xl border border-[#e2e8e2] px-5 py-2.5 text-xs font-semibold hover:bg-[#fafaf9]"
          >
            Back to cart
          </button>
        </>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#fafaf9] px-4 text-[#1c2a21]">
      <Suspense fallback={<p className="text-sm text-[#5c6b60]">Loading...</p>}>
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}