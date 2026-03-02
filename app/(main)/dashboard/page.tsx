'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useTransactions, useAppDispatch } from '@/hooks/use-redux';
import { fetchTransactions } from '@/store/slices/transactionsSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { items: transactions, loading, error } = useTransactions();
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
  });

  // Fetch transactions on mount
  useEffect(() => {
    dispatch(fetchTransactions({}));
  }, [dispatch]);

  // Calculate stats from transactions
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let monthlyIncome = 0;
      let monthlyExpense = 0;
      let totalBalance = 0;

      transactions.forEach((t) => {
        const transDate = new Date(t.transaction_date);
        const amount = parseFloat(t.amount);

        if (t.type === 'income') {
          totalBalance += amount;
          if (transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear) {
            monthlyIncome += amount;
          }
        } else {
          totalBalance -= amount;
          if (transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear) {
            monthlyExpense += amount;
          }
        }
      });

      setStats({
        totalBalance,
        monthlyIncome,
        monthlyExpense,
      });
    }
  }, [transactions]);

  const savings = stats.monthlyIncome - stats.monthlyExpense;
  const savingsRate =
    stats.monthlyIncome > 0
      ? ((savings / stats.monthlyIncome) * 100).toFixed(1)
      : '0';

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-border">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your financial overview</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Balance"
              value={`$${stats.totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={Wallet}
              variant="primary"
            />
            <StatCard
              label="Monthly Income"
              value={`$${stats.monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={TrendingUp}
              variant="secondary"
            />
            <StatCard
              label="Monthly Expense"
              value={`$${stats.monthlyExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={TrendingDown}
              variant="accent"
            />
            <StatCard
              label="Savings Rate"
              value={`${savingsRate}%`}
              change={`$${savings.toLocaleString(undefined, { maximumFractionDigits: 2 })} saved`}
              icon={DollarSign}
              variant="primary"
            />
          </div>

          {/* Recent Transactions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin"></div>
                <p className="text-muted-foreground mt-3">Loading transactions...</p>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <RecentTransactions transactions={transactions.slice(0, 5)} />
            ) : (
              <div className="text-center py-8 border border-border rounded-lg">
                <p className="text-muted-foreground">No transactions yet. Create your first transaction to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
