import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateExpense, useUpdateExpense } from '@/hooks/useExpenses';
import { DatabaseExpense } from '@/types/database';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { Loader2 } from 'lucide-react';

const expenseSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  initialData?: DatabaseExpense;
  defaultCategoryId?: string;
  onSuccess?: () => void;
}

const ExpenseForm = ({ initialData, defaultCategoryId, onSuccess }: ExpenseFormProps) => {
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const { selectedFamilyId, contextType } = useFamilyContext();
  const isEditing = !!initialData;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category_id: initialData?.category_id || defaultCategoryId || '',
      amount: initialData?.amount || 0,
      description: initialData?.description || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
      } else {
        await createMutation.mutateAsync({
          category_id: data.category_id,
          amount: data.amount,
          description: data.description,
          date: data.date,
          notes: data.notes,
          family_id: contextType === 'family' ? selectedFamilyId : undefined,
          expense_type: contextType,
        });
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Expense' : 'Add Expense'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select a category"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grocery shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Add'} Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;