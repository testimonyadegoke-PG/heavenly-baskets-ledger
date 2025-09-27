import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateFamily } from '@/hooks/useFamilies';

export const CreateFamilyForm = () => {
  const [name, setName] = useState('');
  const createFamily = useCreateFamily();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createFamily.mutate({ name: name.trim() });
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="family-name">Family Name</Label>
        <Input
          id="family-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter family name..."
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={createFamily.isPending || !name.trim()}
      >
        {createFamily.isPending ? 'Creating...' : 'Create Family'}
      </Button>
    </form>
  );
};