import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  useBudgetTemplateItems, 
  useUpdateBudgetTemplate, 
  useUpdateBudgetTemplateItems,
  useDeleteBudgetTemplate 
} from '@/hooks/useBudgetTemplates';
import { useCategories } from '@/hooks/useCategories';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Edit, Save, X, Percent, Info, Trash2 } from 'lucide-react';

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
  const updateItems = useUpdateBudgetTemplateItems();
  const deleteTemplate = useDeleteBudgetTemplate();

  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [templateItems, setTemplateItems] = useState<Array<{ id: string; category_id: string; percentage: number }>>([]);

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
    setTemplateItems([]);
  };

  const updateTemplateItem = (index: number, percentage: number) => {
    const newItems = [...templateItems];
    newItems[index] = { ...newItems[index], percentage };
    setTemplateItems(newItems);
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
      name: templateName
    });

    // Update items
    await updateItems.mutateAsync({
      templateId: template.id,
      items: templateItems.map(item => ({
        id: item.id,
        category_id: item.category_id,
        percentage: item.percentage
      }))
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
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template Name"
                  className="max-w-md"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span>{template.name}</span>
                  <Badge variant="outline">{template.template_type}</Badge>
                </div>
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
                    disabled={getTotalPercentage() !== 100 || !templateName.trim() || updateTemplate.isPending || updateItems.isPending}
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
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded border">
                      <div className="col-span-7 flex items-center gap-2">
                        {category && (
                          <>
                            <span className="text-xl">{category.icon}</span>
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
                          />
                          <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Progress value={getTotalPercentage()} className="w-full" />
            </>
          ) : (
            <div className="space-y-3">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.categories.icon}</span>
                    <span className="font-medium">{item.categories.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {item.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
