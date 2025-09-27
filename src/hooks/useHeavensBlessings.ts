import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HeavensBlessings, CreateHeavensBlessings, UpdateHeavensBlessings } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useHeavensBlessings = (month?: number, year?: number, familyId?: string | null, contextType?: 'individual' | 'family') => {
  return useQuery({
    queryKey: ['heavens-blessings', month, year, familyId, contextType],
    queryFn: async () => {
      let query = supabase
        .from('heavens_blessings')
        .select('*')
        .order('date', { ascending: false });

      // Filter by context type and family
      if (contextType === 'family' && familyId) {
        query = query.eq('family_id', familyId).eq('income_type', 'family');
      } else if (contextType === 'individual') {
        query = query.eq('income_type', 'individual').is('family_id', null);
      }

      if (month && year) {
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HeavensBlessings[];
    },
  });
};

export const useHeavensBlessingsById = (id: string) => {
  return useQuery({
    queryKey: ['heavens-blessings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('heavens_blessings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as HeavensBlessings;
    },
    enabled: !!id,
  });
};

export const useCreateHeavensBlessings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateHeavensBlessings) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('heavens_blessings')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heavens-blessings'] });
      toast({
        title: "Success",
        description: "Heaven's Blessing added successfully!",
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

export const useUpdateHeavensBlessings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateHeavensBlessings }) => {
      const { data: result, error } = await supabase
        .from('heavens_blessings')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heavens-blessings'] });
      toast({
        title: "Success",
        description: "Heaven's Blessing updated successfully!",
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

export const useDeleteHeavensBlessings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('heavens_blessings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heavens-blessings'] });
      toast({
        title: "Success",
        description: "Heaven's Blessing deleted successfully!",
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