import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FamilyMember, CreateFamilyMember } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useFamilyMembers = (familyId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['family-members', familyId],
    queryFn: async () => {
      if (!user || !familyId) return [];
      
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_id', familyId)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      return data as FamilyMember[];
    },
    enabled: !!user && !!familyId,
  });
};

export const useUserFamilyMemberships = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-family-memberships', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          *,
          families:family_id (
            id,
            name,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (memberData: CreateFamilyMember) => {
      const { data, error } = await supabase
        .from('family_members')
        .insert(memberData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
      toast({
        title: "Success",
        description: "Family member added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add family member: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveFamilyMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
      toast({
        title: "Success",
        description: "Family member removed successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove family member: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};