'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { apiClient, AnalyticsOverview } from '@/lib/api';
import { mockChartData, mockCategoryDistribution } from '@/lib/mock-data';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        console.log('Fetching analytics from API...');
        const data = await apiClient.getAnalyticsOverview();
        console.log('Analytics data received:', data);
        setAnalytics(data);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch analytics';
        console.error('Analytics fetch error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          fullError: err,
        });
        setError(errorMessage);
        // Fallback to mock data with warning
        const mockAnalytics: AnalyticsOverview = {
          summary: {
            total_income: mockChartData.reduce((sum, item) => sum + item.income, 0),
            total_expense: mockChartData.reduce((sum, item) => sum + item.expense, 0),
            net_savings:
              mockChartData.reduce((sum, item) => sum + item.income, 0) -
              mockChartData.reduce((sum, item) => sum + item.expense, 0),
            avg_monthly_income:
              mockChartData.reduce((sum, item) => sum + item.income, 0) / mockChartData.length,
            avg_monthly_expense:
              mockChartData.reduce((sum, item) => sum + item.expense, 0) / mockChartData.length,
          },
          trend: mockChartData.flatMap((item) => [
            { month: 1, type: 'income' as const, total: item.income },
            { month: 1, type: 'expense' as const, total: item.expense },
          ]),
          category_distribution: mockCategoryDistribution.map((item) => ({
            category__name: item.name,
            total: item.value,
          })),
        };
        setAnalytics(mockAnalytics);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-6 md:p-8 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">Detailed insights into your spending patterns</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin"></div>
          <p className="text-muted-foreground ml-3">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-6 md:p-8 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">Detailed insights into your spending patterns</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-lg max-w-xl">
            <p className="font-semibold mb-2">❌ Error Loading Analytics</p>
            <p className="text-sm">
              {error || 'Failed to load analytics data. Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { summary, trend, category_distribution } = analytics;

  // Prepare chart data from trend
  const chartData = trend.reduce((acc: any[], item) => {
    const existing = acc.find((d) => d.month === item.month);
    if (existing) {
      existing[item.type] = item.total;
    } else {
      acc.push({
        month: item.month,
        name: `Month ${item.month}`,
        income: item.type === 'income' ? item.total : 0,
        expense: item.type === 'expense' ? item.total : 0,
      });
    }
    return acc;
  }, []);

  // Prepare pie chart data
  const pieData = category_distribution.map((item) => ({
    name: item.category__name,
    value: item.total,
    percentage: Math.round(
      (item.total / category_distribution.reduce((sum, i) => sum + i.total, 0)) * 100
    ),
  }));

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-border">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">Detailed insights into your spending patterns</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Error Warning Banner */}
          {error && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 dark:text-yellow-200 px-6 py-4 rounded-lg">
              <p className="font-semibold text-sm mb-2">⚠️ Using Demo/Cached Data</p>
              <p className="text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {(['monthly', 'quarterly', 'yearly'] as const).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? 'default' : 'outline'}
                onClick={() => setTimeframe(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Income</p>
              <h3 className="text-2xl font-bold text-foreground">
                ${summary.total_income.toLocaleString()}
              </h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">+15% from last period</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
              <h3 className="text-2xl font-bold text-foreground">
                ${summary.total_expense.toLocaleString()}
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">-8% from last period</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Average Monthly Income</p>
              <h3 className="text-2xl font-bold text-foreground">
                ${summary.avg_monthly_income.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">Per month</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Average Monthly Expense</p>
              <h3 className="text-2xl font-bold text-foreground">
                ${summary.avg_monthly_expense.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">Per month</p>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Income vs Expenses Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `$${value}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `$${value}`}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(var(--primary))" />
                  <Bar dataKey="expense" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Expense Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Summary Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Net Savings</p>
                <h4 className="text-2xl font-bold text-foreground">
                  ${summary.net_savings.toLocaleString()}
                </h4>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">Difference between income and expenses</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Savings Rate</p>
                <h4 className="text-2xl font-bold text-foreground">
                  {summary.total_income > 0
                    ? ((summary.net_savings / summary.total_income) * 100).toFixed(1)
                    : 0}
                  %
                </h4>
                <p className="text-xs text-muted-foreground mt-2">Percentage of income saved</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Total Categories</p>
                <h4 className="text-2xl font-bold text-foreground">{category_distribution.length}</h4>
                <p className="text-xs text-muted-foreground mt-2">Categories tracked</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
