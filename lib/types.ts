export interface Transaction {
  id: string;
  date: Date;
  transaction_date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  paymentMethod: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  budget?: number;
  spent?: number;
}

export interface BudgetGoal {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savings: number;
  savingsRate: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
}
