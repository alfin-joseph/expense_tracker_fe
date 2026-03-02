import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, Transaction, TransactionCreate, PaginatedResponse } from '@/lib/api';

export interface TransactionsState {
  items: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

const initialState: TransactionsState = {
  items: [],
  currentTransaction: null,
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (
    { page, ordering }: { page?: number; ordering?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.getTransactions(page, ordering);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch transactions');
    }
  }
);

export const fetchTransaction = createAsyncThunk(
  'transactions/fetchTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      const transaction = await apiClient.getTransaction(id);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch transaction');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (data: TransactionCreate, { rejectWithValue }) => {
    try {
      const transaction = await apiClient.createTransaction(data);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (
    { id, data }: { id: string; data: TransactionCreate },
    { rejectWithValue }
  ) => {
    try {
      const transaction = await apiClient.updateTransaction(id, data);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update transaction');
    }
  }
);

export const patchTransaction = createAsyncThunk(
  'transactions/patchTransaction',
  async (
    { id, data }: { id: string; data: Partial<TransactionCreate> },
    { rejectWithValue }
  ) => {
    try {
      const transaction = await apiClient.patchTransaction(id, data);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to patch transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.deleteTransaction(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete transaction');
    }
  }
);

// Slice
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Transaction
      .addCase(fetchTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.pagination.count += 1;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentTransaction?.id === action.payload.id) {
          state.currentTransaction = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Patch Transaction
      .addCase(patchTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentTransaction?.id === action.payload.id) {
          state.currentTransaction = action.payload;
        }
      })
      .addCase(patchTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.pagination.count -= 1;
        if (state.currentTransaction?.id === action.payload) {
          state.currentTransaction = null;
        }
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
