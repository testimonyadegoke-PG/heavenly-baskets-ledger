import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCategories, useCreateCategory } from '@/hooks/useCategories';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Plus, Palette } from 'lucide-react';

const CATEGORY_ICONS = ['💰', '🍽️', '🚗', '🏠', '⚡', '🏥', '🎬', '🛍️', '📚', '🧴', '🎮', '📱', '✈️', '🎸', '⚽'];
const CATEGORY_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280'];

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const CategorySelect = ({ value, onValueChange, placeholder = "Select a category" }: CategorySelectProps) => {
  const { selectedFamilyId, contextType } = useFamilyContext();
  const { data: categories = [] } = useCategories(selectedFamilyId, contextType);
  const createCategory = useCreateCategory();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    color: '#3B82F6',
  });

  const handleCreateCategory = () => {
    createCategory.mutate({
      ...formData,
      category_type: contextType === 'family' && selectedFamilyId ? 'family' : 'user',
      family_id: contextType === 'family' ? selectedFamilyId || undefined : undefined,
    }, {
      onSuccess: (newCategory) => {
        setIsCreateOpen(false);
        setFormData({ name: '', icon: '💰', color: '#3B82F6' });
        onValueChange(newCategory.id);
      }
    });
  };

  return (
    <>
      <Select value={value} onValueChange={(val) => {
        if (val === "__add_new__") {
          setIsCreateOpen(true);
        } else {
          onValueChange(val);
        }
      }}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <span className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </span>
            </SelectItem>
          ))}
          <SelectItem value="__add_new__">
            <span className="flex items-center gap-2 text-primary">
              <Plus className="h-4 w-4" />
              <span>Add New Category</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name..."
              />
            </div>

            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {CATEGORY_ICONS.map(icon => (
                  <Button
                    key={icon}
                    type="button"
                    variant={formData.icon === icon ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, icon })}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {CATEGORY_COLORS.map(color => (
                  <Button
                    key={color}
                    type="button"
                    variant={formData.color === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, color })}
                    className="w-10 h-10 p-0"
                    style={{ backgroundColor: color }}
                  >
                    {formData.color === color && <Palette className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              type="button"
              onClick={handleCreateCategory} 
              className="w-full"
              disabled={!formData.name.trim() || createCategory.isPending}
            >
              {createCategory.isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};