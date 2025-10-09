import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FamilyInvitation, CreateFamilyInvitation } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useFamilyInvitations = (familyId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['family-invitations', familyId],
    queryFn: async () => {
      if (!user || !familyId) return [];
      
      const { data, error } = await supabase
        .from('family_invitations')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FamilyInvitation[];
    },
    enabled: !!user && !!familyId,
  });
};

export const useUserInvitations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-invitations', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const { data, error } = await supabase
        .from('family_invitations')
        .select(`
          *,
          families:family_id (
            id,
            name,
            created_by
          )
        `)
        .eq('invited_email', user.email)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
  });
};

export const useCreateFamilyInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invitationData: CreateFamilyInvitation) => {
      const { data, error } = await supabase
        .from('family_invitations')
        .insert({
          family_id: invitationData.family_id,
          invited_by: (await supabase.auth.getUser()).data.user!.id,
          invited_email: invitationData.invited_email,
          role: invitationData.role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-invitations'] });
      toast({
        title: "Success",
        description: "Family invitation sent successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send invitation: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useAcceptFamilyInvitation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Get the invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from('family_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (invitationError) throw invitationError;

      // Add user to family
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: invitation.family_id,
          user_id: user.id,
          role: invitation.role,
        });

      if (memberError) throw memberError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from('family_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      return invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
      // Match the exact query key pattern with user ID
      queryClient.invalidateQueries({ queryKey: ['user-family-memberships', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast({
        title: "Success",
        description: "Family invitation accepted! Refresh to see your new family.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to accept invitation: ${error.message}`,
      });
    },
  });
};

export const useDeclineFamilyInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('family_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
      toast({
        title: "Success",
        description: "Family invitation declined.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to decline invitation: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};