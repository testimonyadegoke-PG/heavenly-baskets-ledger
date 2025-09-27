import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateFamilyInvitation } from '@/hooks/useFamilyInvitations';

interface FamilyInvitationFormProps {
  familyId: string | null;
}

export const FamilyInvitationForm = ({ familyId }: FamilyInvitationFormProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'child' | 'parent'>('member');
  const createInvitation = useCreateFamilyInvitation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && familyId) {
      createInvitation.mutate({
        family_id: familyId,
        invited_email: email.trim(),
        role,
      });
      setEmail('');
      setRole('member');
    }
  };

  if (!familyId) {
    return (
      <div className="text-center text-muted-foreground">
        Please select a family first to send invitations.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="invite-email">Email Address</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="invite-role">Role</Label>
        <Select value={role} onValueChange={(value: 'member' | 'child' | 'parent') => setRole(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="child">Child</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={createInvitation.isPending || !email.trim()}
      >
        {createInvitation.isPending ? 'Sending...' : 'Send Invitation'}
      </Button>
    </form>
  );
};