import { Card } from '@/components/ui/card';
import { Transaction } from '@/lib/types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground mt-1">Your latest activity</p>
      </div>
      <div className="space-y-4">
        {transactions.slice(0, 6).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  transaction.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                )}
              >
                {transaction.type === 'income' ? (
                  <ArrowDownLeft className={cn(
                    'size-5',
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  )} />
                ) : (
                  <ArrowUpRight className={cn(
                    'size-5',
                    transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  )} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                'text-sm font-semibold',
                transaction.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}>
                {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount as any).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.date || transaction.transaction_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
