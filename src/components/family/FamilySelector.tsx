import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Plus, Users, User } from 'lucide-react';
import { CreateFamilyForm } from './CreateFamilyForm';
import { FamilyInvitationForm } from './FamilyInvitationForm';
import { UserInvitations } from './UserInvitations';

export const FamilySelector = () => {
  const { 
    selectedFamilyId, 
    setSelectedFamilyId,
    contextType, 
    setContextType, 
    availableFamilies 
  } = useFamilyContext();

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2">
        <Button
          variant={contextType === 'individual' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setContextType('individual')}
        >
          <User className="h-4 w-4 mr-2" />
          Individual
        </Button>
        <Button
          variant={contextType === 'family' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setContextType('family')}
        >
          <Users className="h-4 w-4 mr-2" />
          Family
        </Button>
      </div>

      {contextType === 'family' && (
        <div className="flex items-center gap-2 flex-1">
          <Select value={selectedFamilyId || ''} onValueChange={setSelectedFamilyId}>
            <SelectTrigger className="flex-1 max-w-xs">
              <SelectValue placeholder="Select a family" />
            </SelectTrigger>
            <SelectContent>
              {availableFamilies
                .filter((membership) => membership.families?.name)
                .map((membership) => (
                  <SelectItem key={membership.family_id} value={membership.family_id}>
                    {membership.families.name} ({membership.role})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Family Management</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create Family</TabsTrigger>
              <TabsTrigger value="invite">Invite Member</TabsTrigger>
              <TabsTrigger value="invitations">My Invitations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <CreateFamilyForm />
            </TabsContent>
            
            <TabsContent value="invite">
              <FamilyInvitationForm familyId={selectedFamilyId} />
            </TabsContent>
            
            <TabsContent value="invitations">
              <UserInvitations />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};