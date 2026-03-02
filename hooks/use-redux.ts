import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// Use these hooks instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth hooks
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  return { ...auth, dispatch };
};

// Categories hooks
export const useCategories = () => {
  const categories = useAppSelector((state) => state.categories);
  const dispatch = useAppDispatch();
  return { ...categories, dispatch };
};

// Transactions hooks
export const useTransactions = () => {
  const transactions = useAppSelector((state) => state.transactions);
  const dispatch = useAppDispatch();
  return { ...transactions, dispatch };
};
