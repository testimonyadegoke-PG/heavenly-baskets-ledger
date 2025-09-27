import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Family, CreateFamily, UpdateFamily } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useFamilies = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['families', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Family[];
    },
    enabled: !!user,
  });
};

export const useCreateFamily = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (familyData: CreateFamily) => {
      if (!user) throw new Error('User not authenticated');

      // Create family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          name: familyData.name,
          created_by: user.id,
        })
        .select()
        .single();

      if (familyError) throw familyError;

      // Add creator as admin
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: family.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      return family;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
      toast({
        title: "Success",
        description: "Family created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create family: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFamily = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateFamily }) => {
      const { data, error } = await supabase
        .from('families')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast({
        title: "Success",
        description: "Family updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update family: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};