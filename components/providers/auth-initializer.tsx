'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/use-redux';
import { initializeAuth } from '@/store/slices/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth from localStorage on app mount
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}
