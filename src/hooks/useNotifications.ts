import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'general' | 'family_invitation' | 'budget_alert' | 'spending_alert' | 'recommendation';
  read: boolean;
  action_url?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useNotifications = (unreadOnly = false) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', user?.id, unreadOnly],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'get_notifications',
          user_id: user.id,
          unread_only: unreadOnly,
          limit: 50
        }
      });

      if (error) throw error;
      return data.notifications as Notification[];
    },
    enabled: !!user,
  });

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Invalidate and refetch notifications when changes occur
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
};

export const useMarkNotificationAsRead = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'mark_as_read',
          notification_id: notificationId,
          user_id: user.id
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark notification as read: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useCreateNotification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationData: {
      title: string;
      message: string;
      type?: 'info' | 'warning' | 'success' | 'error';
      category?: string;
      action_url?: string;
      metadata?: Record<string, any>;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'create_notification',
          user_id: user.id,
          ...notificationData
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create notification: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useCheckBudgetAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (familyId?: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'check_budget_alerts',
          user_id: user.id,
          family_id: familyId
        }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to check budget alerts: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useCheckSpendingAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (familyId?: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'check_spending_alerts',
          user_id: user.id,
          family_id: familyId
        }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to check spending alerts: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};