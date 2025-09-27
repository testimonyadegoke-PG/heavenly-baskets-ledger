import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateHeavensBlessings, useUpdateHeavensBlessings } from '@/hooks/useHeavensBlessings';
import { HeavensBlessings } from '@/types/database';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Loader2 } from 'lucide-react';

const heavensBlessingsSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  source: z.string().min(1, 'Source is required').max(100, 'Source must be less than 100 characters'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type HeavensBlessingsFormData = z.infer<typeof heavensBlessingsSchema>;

interface HeavensBlessingsFormProps {
  initialData?: HeavensBlessings;
  onSuccess?: () => void;
}

const HeavensBlessingsForm = ({ initialData, onSuccess }: HeavensBlessingsFormProps) => {
  const createMutation = useCreateHeavensBlessings();
  const updateMutation = useUpdateHeavensBlessings();
  const { selectedFamilyId, contextType } = useFamilyContext();
  const isEditing = !!initialData;

  const form = useForm<HeavensBlessingsFormData>({
    resolver: zodResolver(heavensBlessingsSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      source: initialData?.source || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
    },
  });

  const onSubmit = async (data: HeavensBlessingsFormData) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
      } else {
        await createMutation.mutateAsync({
          amount: data.amount,
          source: data.source,
          date: data.date,
          notes: data.notes,
          family_id: contextType === 'family' ? selectedFamilyId : undefined,
          income_type: contextType,
        });
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving Heaven\'s Blessing:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Heaven\'s Blessing' : 'Add Heaven\'s Blessing'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Salary, Business, Gift" {...field} />
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
              {isEditing ? 'Update' : 'Add'} Heaven's Blessing
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HeavensBlessingsForm;