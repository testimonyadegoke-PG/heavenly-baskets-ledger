import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets';
import { Budget } from '@/types/database';
import { PREDEFINED_CATEGORIES } from '@/types/expenses';
import { Loader2 } from 'lucide-react';

const budgetSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  budgeted_amount: z.number().positive('Budget amount must be positive'),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2030),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  initialData?: Budget;
  defaultMonth?: number;
  defaultYear?: number;
  onSuccess?: () => void;
}

const BudgetForm = ({ initialData, defaultMonth, defaultYear, onSuccess }: BudgetFormProps) => {
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const isEditing = !!initialData;

  const currentDate = new Date();
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category_id: initialData?.category_id || '',
      budgeted_amount: initialData?.budgeted_amount || 0,
      month: initialData?.month || defaultMonth || currentDate.getMonth() + 1,
      year: initialData?.year || defaultYear || currentDate.getFullYear(),
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ 
          id: initialData.id, 
          data: { budgeted_amount: data.budgeted_amount } 
        });
      } else {
        const selectedCategory = PREDEFINED_CATEGORIES.find(cat => cat.id === data.category_id);
        if (!selectedCategory) throw new Error('Category not found');

        await createMutation.mutateAsync({
          category_id: data.category_id,
          category_name: selectedCategory.name,
          category_icon: selectedCategory.icon,
          category_color: selectedCategory.color,
          budgeted_amount: data.budgeted_amount,
          month: data.month,
          year: data.year,
        });
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Budget' : 'Create Budget'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PREDEFINED_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="budgeted_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <>
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || currentDate.getFullYear())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} Budget
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;