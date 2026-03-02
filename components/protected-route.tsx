'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useAppDispatch } from '@/hooks/use-redux';
import { getProfile } from '@/store/slices/authSlice';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const authState = useAuth();
  const { isAuthenticated, loading, user, initialized } = authState;

  useEffect(() => {
    // Fetch user profile if authenticated but no user data
    if (isAuthenticated && !user && !loading) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, loading, dispatch]);

  useEffect(() => {
    // Redirect to login if not authenticated (but only after initialization is complete)
    if (initialized && !loading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, loading, router, pathname, initialized]);

  // Show loading state while initializing auth
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
