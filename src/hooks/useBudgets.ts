import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Budget, CreateBudget, UpdateBudget } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useBudgets = (month: number, year: number, familyId?: string | null, contextType?: 'individual' | 'family') => {
  return useQuery({
    queryKey: ['budgets', month, year, familyId, contextType],
    queryFn: async () => {
      let query = supabase
        .from('budgets')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .order('category_name');

      // Filter by context type and family
      if (contextType === 'family' && familyId) {
        query = query.eq('family_id', familyId).eq('budget_type', 'family');
      } else if (contextType === 'individual') {
        query = query.eq('budget_type', 'individual').is('family_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Budget[];
    },
  });
};

export const useBudgetById = (id: string) => {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Budget;
    },
    enabled: !!id,
  });
};

export const useBudgetHistory = (categoryId: string) => {
  return useQuery({
    queryKey: ['budget-history', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('category_id', categoryId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as Budget[];
    },
    enabled: !!categoryId,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBudget) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('budgets')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget created successfully!",
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

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBudget }) => {
      const { data: result, error } = await supabase
        .from('budgets')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget updated successfully!",
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

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget deleted successfully!",
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