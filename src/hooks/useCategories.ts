import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  category_type: 'user' | 'family';
  user_id?: string;
  family_id?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategory {
  name: string;
  icon: string;
  color: string;
  category_type: 'user' | 'family';
  family_id?: string;
}

export const useCategories = (familyId?: string | null, contextType?: 'individual' | 'family') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['categories', familyId, contextType],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase.from('categories').select('*');
      
      if (contextType === 'family' && familyId) {
        // Include: family categories, user categories, AND default categories
        query = query.or(`and(category_type.eq.family,family_id.eq.${familyId}),and(category_type.eq.user,user_id.eq.${user.id}),is_default.eq.true`);
      } else {
        // Include: user categories AND default categories
        query = query.or(`and(category_type.eq.user,user_id.eq.${user.id}),is_default.eq.true`);
      }
      
      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user,
  });
};

export const useCreateCategory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (categoryData: CreateCategory) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          icon: categoryData.icon,
          color: categoryData.color,
          category_type: categoryData.category_type,
          user_id: categoryData.category_type === 'user' ? user.id : null,
          family_id: categoryData.family_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create category: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateCategory> }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};