'use client';

import { useEffect, useState } from 'react';
import { useTransactions } from '@/hooks/use-redux';
import { useCategories } from '@/hooks/use-redux';
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '@/store/slices/transactionsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Example transactions management component showing Redux integration
 * Demonstrates:
 * - Fetching transactions with pagination
 * - Creating new transactions
 * - Updating transactions
 * - Deleting transactions
 * - Integration with categories
 * - Loading and error states
 */
export function TransactionsExample() {
  const { items, loading, error, dispatch, pagination } = useTransactions();
  const { items: categories, dispatch: categoriesDispatch } = useCategories();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch transactions and categories on mount
  useEffect(() => {
    dispatch(fetchTransactions({ page }));
    categoriesDispatch(fetchCategories({}));
  }, [dispatch, categoriesDispatch, page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      createTransaction({
        type,
        amount,
        description,
        transaction_date: transactionDate,
        is_recurring: isRecurring,
        category: categoryId || undefined,
      })
    );
    setDescription('');
    setAmount('');
    setCategoryId('');
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleUpdate = (id: string) => {
    dispatch(
      updateTransaction({
        id,
        data: {
          type: 'income',
          amount: '100.00',
          description: 'Updated transaction',
          transaction_date: transactionDate,
          is_recurring: false,
        },
      })
    );
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'No category';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Lunch at restaurant"
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <Label htmlFor="recurring" className="mb-0">
              Is Recurring
            </Label>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Transaction'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>

        {loading && <div>Loading transactions...</div>}

        <div className="space-y-3">
          {items.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <div className="font-semibold">{transaction.description}</div>
                <div className="text-sm text-gray-600">
                  {getCategoryName(transaction.category)} • {transaction.type} •{' '}
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">${transaction.amount}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(transaction.id)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(transaction.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 items-center">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.previous || loading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {Math.ceil(pagination.count / 10)}
          </span>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.next || loading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
