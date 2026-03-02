'use client';

import { useEffect, useState } from 'react';
import { useCategories } from '@/hooks/use-redux';
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  fetchCategory,
} from '@/store/slices/categoriesSlice';
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
 * Example categories management component showing Redux integration
 * Demonstrates:
 * - Fetching categories with pagination
 * - Creating new categories
 * - Updating categories
 * - Deleting categories
 * - Loading and error states
 */
export function CategoriesExample() {
  const { items, loading, error, dispatch, pagination } = useCategories();
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('folder');
  const [page, setPage] = useState(1);

  // Fetch categories on mount and when page changes
  useEffect(() => {
    dispatch(fetchCategories({ page }));
  }, [dispatch, page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      createCategory({
        name,
        type,
        color,
        icon,
      })
    );
    setName('');
    setColor('#3B82F6');
    setIcon('folder');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      dispatch(deleteCategory(id));
    }
  };

  const handleUpdate = (id: string) => {
    dispatch(
      updateCategory({
        id,
        data: {
          name: `${name || 'Updated'} Category`,
          type: 'income',
        },
      })
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add Category</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Food & Dining"
              required
            />
          </div>

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
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <span className="text-sm text-gray-600">{color}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., utensils"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Category'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>

        {loading && <div>Loading categories...</div>}

        <div className="space-y-3">
          {items.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm text-gray-600">
                  Type: {category.type} | Color: {category.color}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdate(category.id)}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(category.id)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
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
