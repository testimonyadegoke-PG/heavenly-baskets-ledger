import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInvitations, useAcceptFamilyInvitation, useDeclineFamilyInvitation } from '@/hooks/useFamilyInvitations';
import { Check, X } from 'lucide-react';

export const UserInvitations = () => {
  const { data: invitations = [], isLoading } = useUserInvitations();
  const acceptInvitation = useAcceptFamilyInvitation();
  const declineInvitation = useDeclineFamilyInvitation();

  if (isLoading) {
    return <div>Loading invitations...</div>;
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No pending family invitations.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations
        .filter((invitation) => invitation.families?.name)
        .map((invitation) => (
          <Card key={invitation.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{invitation.families.name}</CardTitle>
              <CardDescription>
                You've been invited to join as a {invitation.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => acceptInvitation.mutate(invitation.id)}
                  disabled={acceptInvitation.isPending}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => declineInvitation.mutate(invitation.id)}
                  disabled={declineInvitation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};