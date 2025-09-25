import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseExpense, CreateExpense, UpdateExpense } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useExpenses = (month?: number, year?: number) => {
  return useQuery({
    queryKey: ['expenses', month, year],
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (month && year) {
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DatabaseExpense[];
    },
  });
};

export const useExpenseById = (id: string) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as DatabaseExpense;
    },
    enabled: !!id,
  });
};

export const useExpensesByCategory = (categoryId: string, month?: number, year?: number) => {
  return useQuery({
    queryKey: ['expenses-by-category', categoryId, month, year],
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('category_id', categoryId)
        .order('date', { ascending: false });

      if (month && year) {
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DatabaseExpense[];
    },
    enabled: !!categoryId,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateExpense) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('expenses')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-by-category'] });
      toast({
        title: "Success",
        description: "Expense added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExpense }) => {
      const { data: result, error } = await supabase
        .from('expenses')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-by-category'] });
      toast({
        title: "Success",
        description: "Expense updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-by-category'] });
      toast({
        title: "Success",
        description: "Expense deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};