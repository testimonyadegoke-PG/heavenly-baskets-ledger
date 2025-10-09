import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Plus, Edit2, Trash2, Palette, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = ['💰', '🍽️', '🚗', '🏠', '⚡', '🏥', '🎬', '🛍️', '📚', '🧴', '🎮', '📱', '✈️', '🎸', '⚽'];
const CATEGORY_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280'];

export const CategoryManager = () => {
  const navigate = useNavigate();
  const { selectedFamilyId, contextType } = useFamilyContext();
  const { data: categories = [], isLoading } = useCategories(selectedFamilyId, contextType);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    color: '#3B82F6',
    category_type: 'user' as 'user' | 'family',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '💰',
      color: '#3B82F6',
      category_type: 'user',
    });
    setEditingCategory(null);
  };

  const handleCreateCategory = () => {
    createCategory.mutate({
      ...formData,
      family_id: formData.category_type === 'family' ? selectedFamilyId || undefined : undefined,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        resetForm();
      }
    });
  };

  const handleEditCategory = () => {
    if (!editingCategory) return;
    
    updateCategory.mutate({
      id: editingCategory.id,
      updates: {
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
      }
    }, {
      onSuccess: () => {
        resetForm();
      }
    });
  };

  const startEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      category_type: category.category_type,
    });
  };

  const userCategories = categories.filter(cat => cat.category_type === 'user');
  const familyCategories = categories.filter(cat => cat.category_type === 'family');

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/app')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          
          <h2 className="text-2xl font-bold">Category Management</h2>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
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

              <div>
                <Label>Type</Label>
                <Select 
                  value={formData.category_type} 
                  onValueChange={(value: 'user' | 'family') => setFormData({ ...formData, category_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Personal</SelectItem>
                    {selectedFamilyId && <SelectItem value="family">Family Shared</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreateCategory} 
                className="w-full"
                disabled={!formData.name.trim() || createCategory.isPending}
              >
                {createCategory.isPending ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Categories</TabsTrigger>
          <TabsTrigger value="family">Family Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCategories.map(category => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        {category.is_default && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(category)}
                        disabled={category.is_default}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory.mutate(category.id)}
                        disabled={category.is_default || deleteCategory.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyCategories.map(category => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant="outline" className="text-xs">Family</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory.mutate(category.id)}
                        disabled={deleteCategory.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
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
              onClick={handleEditCategory} 
              className="w-full"
              disabled={!formData.name.trim() || updateCategory.isPending}
            >
              {updateCategory.isPending ? 'Updating...' : 'Update Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};