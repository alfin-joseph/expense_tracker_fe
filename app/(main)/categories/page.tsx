'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useCategories, useTransactions } from '@/hooks/use-redux';
import { fetchCategories, deleteCategory, createCategory } from '@/store/slices/categoriesSlice';
import { fetchTransactions } from '@/store/slices/transactionsSlice';
import { useAppDispatch } from '@/hooks/use-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { items: categories, loading, error } = useCategories();
  const { items: transactions } = useTransactions();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCategories({}));
    dispatch(fetchTransactions({}));
  }, [dispatch]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert('Please enter a category name');
      return;
    }

    const result = await dispatch(
      createCategory({
        name: formData.name,
        type: formData.type,
        color: undefined,
        icon: undefined,
      })
    );

    if (result.payload) {
      setShowAddDialog(false);
      setFormData({
        name: '',
        description: '',
        type: 'expense',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await dispatch(deleteCategory(id));
    }
  };

  // Calculate spending per category
  const calculateCategorySpending = (categoryId: string) => {
    return transactions
      .filter((t) => t.category === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);
  };

  const totalSpent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Budget Categories</h1>
            <p className="text-muted-foreground mt-2">Manage your spending categories</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus size={18} className="mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Overall Budget Summary */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Categories</p>
                  <h3 className="text-3xl font-bold text-foreground">{categories.length}</h3>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Spent</p>
                  <h3 className="text-2xl font-bold text-accent">
                    ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
            </div>
          </Card>

          {/* Categories Grid */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="inline-block w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin"></div>
              <p className="text-muted-foreground ml-3">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No categories yet. Create your first category to get started!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => {
                const spent = calculateCategorySpending(category.id);
                const transactionCount = transactions.filter(
                  (t) => t.category === category.id && t.type === 'expense'
                ).length;

                return (
                  <Card key={category.id} className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                            {category.description && (
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {/* Category Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Spent</span>
                          <span className="text-foreground font-semibold">
                            ${spent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Transactions</span>
                          <span className="text-foreground font-semibold">{transactionCount}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Groceries, Transportation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add a description for this category"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'income' | 'expense') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
