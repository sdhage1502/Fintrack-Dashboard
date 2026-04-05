'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { initAuthListener } from '../lib/auth';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const publicRoutes = ['/login', '/signup', '/'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const loadTransactions = useTransactionStore((s) => s.loadTransactions);
  const clearTransactions = useTransactionStore((s) => s.clearTransactions);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  // Load transactions when user authenticates
  useEffect(() => {
    if (user) {
      const unsub = loadTransactions(user.uid, user.role);
      return () => unsub();
    } else {
      clearTransactions();
    }
  }, [user, loadTransactions, clearTransactions]);

  // Route protection
  useEffect(() => {
    if (!isLoading) {
      if (!user && !publicRoutes.includes(pathname)) {
        router.push('/login');
      } else if (user) {
        // Protect Admin routes
        if (pathname.startsWith('/admin') && user.role !== 'admin') {
          toast.error("Access denied. Admin only.");
          router.push('/dashboard');
        }
        // Redirect authenticated users from login/signup to dashboard
        if (['/login', '/signup'].includes(pathname)) {
          if (user.role === 'admin') {
             router.push('/dashboard');
          } else {
             router.push('/dashboard');
          }
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-on-surface-variant font-manrope font-medium text-sm tracking-tight">Loading FinTrack...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
