import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBudgetTemplates, useBudgetTemplateItems, useCreateBudgetTemplate, useApplyBudgetTemplate } from '@/hooks/useBudgetTemplates';
import { useCategories } from '@/hooks/useCategories';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Plus, Percent, Target, Trash2 } from 'lucide-react';

export const BudgetTemplateManager = () => {
  const { selectedFamilyId, contextType } = useFamilyContext();
  const { data: templates = [], isLoading } = useBudgetTemplates(selectedFamilyId, contextType);
  const { data: categories = [] } = useCategories(selectedFamilyId, contextType);
  const createTemplate = useCreateBudgetTemplate();
  const applyTemplate = useApplyBudgetTemplate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState<'user' | 'family'>('user');
  const [templateItems, setTemplateItems] = useState<Array<{ category_id: string; percentage: number }>>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [totalIncome, setTotalIncome] = useState<number>(0);

  const resetForm = () => {
    setTemplateName('');
    setTemplateType('user');
    setTemplateItems([]);
  };

  const addTemplateItem = () => {
    setTemplateItems([...templateItems, { category_id: '', percentage: 0 }]);
  };

  const updateTemplateItem = (index: number, field: 'category_id' | 'percentage', value: string | number) => {
    const newItems = [...templateItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTemplateItems(newItems);
  };

  const removeTemplateItem = (index: number) => {
    setTemplateItems(templateItems.filter((_, i) => i !== index));
  };

  const getTotalPercentage = () => {
    return templateItems.reduce((sum, item) => sum + (item.percentage || 0), 0);
  };

  const handleCreateTemplate = () => {
    if (templateName.trim() && templateItems.length > 0) {
      createTemplate.mutate({
        name: templateName,
        template_type: templateType,
        family_id: templateType === 'family' ? selectedFamilyId || undefined : undefined,
        items: templateItems.filter(item => item.category_id && item.percentage > 0),
      }, {
        onSuccess: () => {
          setIsCreateOpen(false);
          resetForm();
        }
      });
    }
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate && totalIncome > 0) {
      const currentDate = new Date();
      applyTemplate.mutate({
        templateId: selectedTemplate,
        totalIncome,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        familyId: contextType === 'family' ? selectedFamilyId || undefined : undefined,
        budgetType: contextType,
      });
    }
  };

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Templates</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Budget Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., 50/30/20 Rule"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={templateType} onValueChange={(value: 'user' | 'family') => setTemplateType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Personal</SelectItem>
                      {selectedFamilyId && <SelectItem value="family">Family Shared</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Category Allocations</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <Badge variant={getTotalPercentage() === 100 ? "default" : "destructive"}>
                      {getTotalPercentage()}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {templateItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <Select 
                          value={item.category_id} 
                          onValueChange={(value) => updateTemplateItem(index, 'category_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                <span className="flex items-center gap-2">
                                  <span>{category.icon}</span>
                                  <span>{category.name}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.percentage || ''}
                            onChange={(e) => updateTemplateItem(index, 'percentage', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                          <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTemplateItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={addTemplateItem} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>

                <Progress value={getTotalPercentage()} className="w-full" />

                <Button 
                  onClick={handleCreateTemplate} 
                  className="w-full"
                  disabled={!templateName.trim() || templateItems.length === 0 || getTotalPercentage() !== 100 || createTemplate.isPending}
                >
                  {createTemplate.isPending ? 'Creating...' : 'Create Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Apply Template Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Apply Template to Current Month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Select Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {template.template_type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Total Monthly Income</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={totalIncome || ''}
                onChange={(e) => setTotalIncome(parseFloat(e.target.value) || 0)}
                placeholder="Enter total income"
              />
            </div>
          </div>
          <Button 
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate || !totalIncome || applyTemplate.isPending}
            className="w-full"
          >
            {applyTemplate.isPending ? 'Applying...' : 'Apply Template'}
          </Button>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

const TemplateCard = ({ template }: { template: any }) => {
  const { data: items = [] } = useBudgetTemplateItems(template.id);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{template.name}</span>
          <Badge variant="outline">{template.template_type}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{item.categories.icon}</span>
              <span className="text-sm">{item.categories.name}</span>
            </div>
            <Badge variant="secondary">{item.percentage}%</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};