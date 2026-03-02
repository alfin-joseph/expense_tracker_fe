import { Transaction, Category, BudgetGoal } from './types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food & Dining',
    icon: 'utensils',
    color: '#FF6B6B',
    type: 'expense',
    budget: 600,
    spent: 425
  },
  {
    id: '2',
    name: 'Transportation',
    icon: 'car',
    color: '#4ECDC4',
    type: 'expense',
    budget: 400,
    spent: 320
  },
  {
    id: '3',
    name: 'Entertainment',
    icon: 'film',
    color: '#95E1D3',
    type: 'expense',
    budget: 300,
    spent: 180
  },
  {
    id: '4',
    name: 'Utilities',
    icon: 'zap',
    color: '#FECA57',
    type: 'expense',
    budget: 250,
    spent: 245
  },
  {
    id: '5',
    name: 'Shopping',
    icon: 'shopping-bag',
    color: '#FF9FF3',
    type: 'expense',
    budget: 500,
    spent: 620
  },
  {
    id: '6',
    name: 'Health & Fitness',
    icon: 'heart',
    color: '#54A0FF',
    type: 'expense',
    budget: 200,
    spent: 120
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(2024, 11, 15),
    description: 'Whole Foods Market',
    amount: 85.50,
    category: 'Food & Dining',
    type: 'expense',
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    date: new Date(2024, 11, 14),
    description: 'Uber Trip',
    amount: 24.30,
    category: 'Transportation',
    type: 'expense',
    paymentMethod: 'Debit Card'
  },
  {
    id: '3',
    date: new Date(2024, 11, 13),
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    type: 'expense',
    paymentMethod: 'Credit Card'
  },
  {
    id: '4',
    date: new Date(2024, 11, 12),
    description: 'Electric Bill',
    amount: 145.00,
    category: 'Utilities',
    type: 'expense',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: '5',
    date: new Date(2024, 11, 11),
    description: 'Monthly Salary',
    amount: 5000,
    category: 'Income',
    type: 'income',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: '6',
    date: new Date(2024, 11, 10),
    description: 'Nike Store',
    amount: 125.00,
    category: 'Shopping',
    type: 'expense',
    paymentMethod: 'Credit Card'
  },
  {
    id: '7',
    date: new Date(2024, 11, 9),
    description: 'Gym Membership',
    amount: 60,
    category: 'Health & Fitness',
    type: 'expense',
    paymentMethod: 'Credit Card'
  },
  {
    id: '8',
    date: new Date(2024, 11, 8),
    description: 'Restaurant - The Grill',
    amount: 92.45,
    category: 'Food & Dining',
    type: 'expense',
    paymentMethod: 'Credit Card'
  },
  {
    id: '9',
    date: new Date(2024, 11, 7),
    description: 'Gas Station',
    amount: 52.00,
    category: 'Transportation',
    type: 'expense',
    paymentMethod: 'Debit Card'
  },
  {
    id: '10',
    date: new Date(2024, 11, 6),
    description: 'Cinema Tickets',
    amount: 28.50,
    category: 'Entertainment',
    type: 'expense',
    paymentMethod: 'Credit Card'
  }
];

export const mockBudgetGoals: BudgetGoal[] = [
  {
    id: '1',
    category: 'Food & Dining',
    limit: 600,
    spent: 425,
    period: 'monthly'
  },
  {
    id: '2',
    category: 'Transportation',
    limit: 400,
    spent: 320,
    period: 'monthly'
  },
  {
    id: '3',
    category: 'Entertainment',
    limit: 300,
    spent: 180,
    period: 'monthly'
  },
  {
    id: '4',
    category: 'Shopping',
    limit: 500,
    spent: 620,
    period: 'monthly'
  }
];

export const mockChartData = [
  { name: 'Jan', income: 4500, expense: 2800 },
  { name: 'Feb', income: 5200, expense: 3100 },
  { name: 'Mar', income: 4800, expense: 2900 },
  { name: 'Apr', income: 5500, expense: 3300 },
  { name: 'May', income: 5000, expense: 3000 },
  { name: 'Jun', income: 5800, expense: 3200 },
  { name: 'Jul', income: 6000, expense: 3500 },
  { name: 'Aug', income: 5500, expense: 3100 },
  { name: 'Sep', income: 5300, expense: 2900 },
  { name: 'Oct', income: 5700, expense: 3400 },
  { name: 'Nov', income: 5900, expense: 3600 },
  { name: 'Dec', income: 6200, expense: 3800 }
];

export const mockCategoryDistribution = [
  { name: 'Food & Dining', value: 425, percentage: 28 },
  { name: 'Transportation', value: 320, percentage: 21 },
  { name: 'Shopping', value: 620, percentage: 40 },
  { name: 'Entertainment', value: 180, percentage: 12 }
];
