'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, AlertCircle, Target, Lightbulb } from 'lucide-react';
import { mockCategories, mockTransactions } from '@/lib/mock-data';

export default function AIInsightsPage() {
  // Get over-budget categories
  const overBudgetCategories = mockCategories.filter(cat => (cat.spent || 0) > (cat.budget || 0));

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-border">
        <div className="flex items-center gap-3">
          <Zap size={32} className="text-accent" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">AI Insights</h1>
            <p className="text-muted-foreground mt-2">Smart recommendations based on your spending patterns</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Alerts & Warnings */}
          {overBudgetCategories.length > 0 && (
            <Card className="p-6 border-l-4 border-l-destructive bg-destructive/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-destructive flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Budget Alerts</h3>
                  <div className="space-y-2">
                    {overBudgetCategories.map((category) => (
                      <p key={category.id} className="text-sm text-muted-foreground">
                        <span className="font-medium text-destructive">{category.name}</span> is over budget by{' '}
                        <span className="font-semibold text-destructive">
                          ${((category.spent || 0) - (category.budget || 0)).toLocaleString()}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Spending Insights */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <TrendingUp className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-foreground">Spending Trends</h3>
              </div>
            </div>
            <div className="space-y-4 ml-10">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-foreground mb-1">Your spending has increased by 12% compared to last month.</p>
                <p className="text-xs text-muted-foreground">Focus on reducing discretionary expenses to get back on track.</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-foreground mb-1">Shopping category has the highest increase at 28%.</p>
                <p className="text-xs text-muted-foreground">Consider setting stricter budget limits on shopping purchases.</p>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Lightbulb className="text-accent flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-foreground">AI Recommendations</h3>
              </div>
            </div>
            <div className="space-y-4 ml-10">
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-sm font-medium text-foreground mb-2">Optimize Food & Dining Expenses</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your transaction history, you spend an average of $28.50 per restaurant visit. By reducing dining out to 2-3 times per week, you could save approximately $400/month.
                </p>
                <Badge variant="secondary">Potential Savings: $400/month</Badge>
              </div>

              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-sm font-medium text-foreground mb-2">Review Entertainment Subscriptions</p>
                <p className="text-sm text-muted-foreground mb-3">
                  You have multiple entertainment subscriptions costing $45/month total. Consider consolidating to save on redundant services.
                </p>
                <Badge variant="secondary">Potential Savings: $15-20/month</Badge>
              </div>

              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-sm font-medium text-foreground mb-2">Increase Emergency Fund</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Your current savings rate of 38.2% is healthy! Consider increasing it to 40% by reviewing discretionary spending in the Shopping category.
                </p>
                <Badge variant="secondary">Additional Potential Savings: $90/month</Badge>
              </div>
            </div>
          </Card>

          {/* Goals */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Target className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-foreground">Your Financial Goals</h3>
              </div>
            </div>
            <div className="space-y-4 ml-10">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">Save $5,000 for Emergency Fund</p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">On Track</Badge>
                </div>
                <div className="w-full bg-background rounded-full h-2 mt-3">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">$3,400 saved • $1,600 remaining</p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">Reduce Monthly Spending to $3,200</p>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Nearly There</Badge>
                </div>
                <div className="w-full bg-background rounded-full h-2 mt-3">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Current: $3,600 • Target: $3,200</p>
              </div>
            </div>
          </Card>

          {/* Weekly Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">This Week's Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground mt-2">Transactions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">$547</p>
                <p className="text-xs text-muted-foreground mt-2">Total Spent</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-xs text-muted-foreground mt-2">Categories</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">$78</p>
                <p className="text-xs text-muted-foreground mt-2">Average/Day</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
