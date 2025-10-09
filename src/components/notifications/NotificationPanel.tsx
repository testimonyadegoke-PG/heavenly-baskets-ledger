import { useNotifications, useMarkNotificationRead, useDeleteNotification } from '@/hooks/useNotifications';
import { useAcceptFamilyInvitation, useDeclineFamilyInvitation } from '@/hooks/useFamilyInvitations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Check, X, Trash2, Eye, Bell, AlertCircle, Gift, TrendingUp, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  onClose?: () => void;
}

const notificationIcons = {
  family_invitation: Gift,
  budget_alert: AlertCircle,
  expense_alert: TrendingUp,
  recommendation: Info,
  system: Bell,
};

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();
  const acceptInvitation = useAcceptFamilyInvitation();
  const declineInvitation = useDeclineFamilyInvitation();

  const handleAccept = async (notificationId: string, invitationId: string) => {
    try {
      await acceptInvitation.mutateAsync(invitationId);
      await deleteNotification.mutateAsync(notificationId);
      onClose?.();
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  const handleDecline = async (notificationId: string, invitationId: string) => {
    try {
      await declineInvitation.mutateAsync(invitationId);
      await deleteNotification.mutateAsync(notificationId);
    } catch (error) {
      console.error('Failed to decline invitation:', error);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No notifications</h3>
        <p className="text-sm text-muted-foreground">You're all caught up!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
      <div className="space-y-3 pr-4">
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type] || Bell;
          const actionData = notification.metadata as any;

          return (
            <Card 
              key={notification.id} 
              className={`p-4 ${!notification.read ? 'bg-accent/50 border-primary/20' : ''}`}
            >
              <div className="flex gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  !notification.read ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Badge variant="default" className="shrink-0 h-2 w-2 p-0 rounded-full" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    {notification.type === 'family_invitation' && notification.action_url && actionData?.invitation_id && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleAccept(notification.id, actionData.invitation_id)}
                          disabled={acceptInvitation.isPending}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(notification.id, actionData.invitation_id)}
                          disabled={declineInvitation.isPending}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}

                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={markAsRead.isPending}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Mark read
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(notification.id)}
                      disabled={deleteNotification.isPending}
                      className="ml-auto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
