import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useBudgetTemplateItems, 
  useUpdateBudgetTemplate, 
  useSyncBudgetTemplateItems,
  useDeleteBudgetTemplate 
} from '@/hooks/useBudgetTemplates';
import { useCategories } from '@/hooks/useCategories';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Edit, Save, X, Percent, Info, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface BudgetTemplateDetailProps {
  template: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BudgetTemplateDetail = ({ template, open, onOpenChange }: BudgetTemplateDetailProps) => {
  const { selectedFamilyId, contextType } = useFamilyContext();
  const { data: items = [] } = useBudgetTemplateItems(template.id);
  const { data: categories = [] } = useCategories(selectedFamilyId, contextType);
  const updateTemplate = useUpdateBudgetTemplate();
  const syncItems = useSyncBudgetTemplateItems();
  const deleteTemplate = useDeleteBudgetTemplate();

  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDescription, setTemplateDescription] = useState(template.description || '');
  const [templateItems, setTemplateItems] = useState<Array<{ id?: string; category_id: string; percentage: number }>>([]);
  const [newCategoryId, setNewCategoryId] = useState<string>('');

  const handleEdit = () => {
    setIsEditing(true);
    setTemplateName(template.name);
    setTemplateItems(items.map((item: any) => ({
      id: item.id,
      category_id: item.category_id,
      percentage: item.percentage
    })));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTemplateName(template.name);
    setTemplateDescription(template.description || '');
    setTemplateItems([]);
  };

  const updateTemplateItem = (index: number, percentage: number) => {
    const newItems = [...templateItems];
    newItems[index] = { ...newItems[index], percentage };
    setTemplateItems(newItems);
  };

  const removeTemplateItem = (index: number) => {
    const newItems = [...templateItems];
    newItems.splice(index, 1);
    setTemplateItems(newItems);
  };

  const availableCategories = useMemo(() => {
    const used = new Set(templateItems.map(i => i.category_id));
    return categories.filter(c => !used.has(c.id));
  }, [categories, templateItems]);

  const addTemplateItem = () => {
    const cid = newCategoryId || (availableCategories[0]?.id ?? '');
    if (!cid) return;
    setTemplateItems(prev => [...prev, { category_id: cid, percentage: 0 }]);
    setNewCategoryId('');
  };

  const getTotalPercentage = () => {
    return templateItems.reduce((sum, item) => sum + (item.percentage || 0), 0);
  };

  const handleSave = async () => {
    const total = getTotalPercentage();
    if (total !== 100) {
      return; // Validation already shown in UI
    }

    // Update template name
    await updateTemplate.mutateAsync({
      id: template.id,
      name: templateName,
      description: templateDescription
    });

    // Sync items (insert/update/delete)
    await syncItems.mutateAsync({
      templateId: template.id,
      items: templateItems.map(item => ({
        id: item.id || undefined,
        category_id: item.category_id,
        percentage: item.percentage,
      })),
    });

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate.mutateAsync(template.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isEditing ? (
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base">Template Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template Name"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Template description..."
                        className="mt-1.5"
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold">{template.name}</span>
                        <Badge variant="outline">{template.template_type}</Badge>
                      </div>
                      {template.description && (
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={getTotalPercentage() !== 100 || !templateName.trim() || updateTemplate.isPending || syncItems.isPending}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteTemplate.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {isEditing ? (
            <>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Edit the percentage allocation for each category. All percentages must add up to exactly 100%.
                </AlertDescription>
              </Alert>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Category Allocations</h3>
                <Badge variant={getTotalPercentage() === 100 ? "default" : "destructive"}>
                  Total: {getTotalPercentage()}%
                </Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                {templateItems.map((item, index) => {
                  const category = categories.find(cat => cat.id === item.category_id);
                  return (
                    <div 
                      key={`${item.id || 'new'}-${index}`} 
                      className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border bg-card hover:bg-accent/50 hover:shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20"
                    >
                      <div className="col-span-6 flex items-center gap-3">
                        {category && (
                          <>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                              <span className="text-2xl">{category.icon}</span>
                            </div>
                            <span className="text-sm font-medium">{category.name}</span>
                          </>
                        )}
                      </div>
                      <div className="col-span-5">
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={item.percentage || ''}
                            onChange={(e) => updateTemplateItem(index, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="pr-8 w-full"
                          />
                          <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeTemplateItem(index)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Progress value={getTotalPercentage()} className="w-full" />

              <div className="flex items-center gap-2">
                <div className="flex-1 max-w-xs">
                  <Label htmlFor="add-category">Add Category</Label>
                  <select
                    id="add-category"
                    className="w-full h-10 px-3 rounded-md border"
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {availableCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="button" variant="outline" onClick={addTemplateItem} disabled={availableCategories.length === 0}>
                  Add
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 pr-4 overflow-y-auto max-h-60">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.categories.icon}</span>
                      <span className="text-sm font-medium">{item.categories.name}</span>
                    </div>
                    <Badge variant="secondary">{item.percentage}%</Badge>
                  </div>
                ))}
              </div>

              {/* Pie chart visualization */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={items.map((i: any) => ({
                        name: i.categories.name,
                        value: i.percentage,
                        color: i.categories.color,
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {items.map((i: any, idx: number) => (
                        <Cell key={`cell-${idx}`} fill={i.categories.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
