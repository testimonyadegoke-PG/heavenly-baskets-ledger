import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBudgetTemplates, useBudgetTemplateItems, useCreateBudgetTemplate, useApplyBudgetTemplate } from '@/hooks/useBudgetTemplates';
import { useSampleBudgetTemplates, useSampleBudgetTemplateItems, useCopySampleTemplate } from '@/hooks/useSampleBudgetTemplates';
import { useCategories } from '@/hooks/useCategories';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Plus, Percent, Target, Trash2, Home, Info, Copy, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BudgetTemplateDetail } from './BudgetTemplateDetail';

export const ImprovedBudgetTemplateManager = () => {
  const navigate = useNavigate();
  const { selectedFamilyId, contextType } = useFamilyContext();
  const { data: templates = [], isLoading } = useBudgetTemplates(selectedFamilyId, contextType);
  const { data: sampleTemplates = [] } = useSampleBudgetTemplates();
  const { data: categories = [] } = useCategories(selectedFamilyId, contextType);
  const createTemplate = useCreateBudgetTemplate();
  const applyTemplate = useApplyBudgetTemplate();
  const copySampleTemplate = useCopySampleTemplate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateItems, setTemplateItems] = useState<Array<{ category_id: string; percentage: number }>>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [totalIncome, setTotalIncome] = useState<number>(0);

  // Pre-fill all categories when dialog opens
  useEffect(() => {
    if (isCreateOpen && categories.length > 0 && templateItems.length === 0) {
      const preFilledItems = categories.map(category => ({
        category_id: category.id,
        percentage: 0
      }));
      setTemplateItems(preFilledItems);
    }
  }, [isCreateOpen, categories, templateItems.length]);

  const resetForm = () => {
    setTemplateName('');
    setTemplateItems([]);
  };

  const updateTemplateItem = (index: number, field: 'category_id' | 'percentage', value: string | number) => {
    const newItems = [...templateItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTemplateItems(newItems);
  };

  const getTotalPercentage = () => {
    return templateItems.reduce((sum, item) => sum + (item.percentage || 0), 0);
  };

  const handleCreateTemplate = () => {
    if (templateName.trim() && templateItems.length > 0) {
      createTemplate.mutate({
        name: templateName,
        template_type: contextType === 'family' && selectedFamilyId ? 'family' : 'user',
        family_id: contextType === 'family' ? selectedFamilyId || undefined : undefined,
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

  const handleCopySampleTemplate = (templateId: string) => {
    copySampleTemplate.mutate({
      templateId,
      familyId: selectedFamilyId,
      contextType,
    });
  };

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Budget Templates</h2>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Budget Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., My Custom Budget"
                />
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

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Set the percentage allocation for each category. All percentages must add up to exactly 100%.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                  {templateItems.map((item, index) => {
                    const category = categories.find(cat => cat.id === item.category_id);
                    return (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 rounded border">
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
                              onChange={(e) => updateTemplateItem(index, 'percentage', parseFloat(e.target.value) || 0)}
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

      <Tabs defaultValue="my-templates">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="sample-templates">Sample Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-templates" className="space-y-6">
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
                  <select 
                    className="w-full h-10 px-3 rounded-md border"
                    value={selectedTemplate} 
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">Choose a template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
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

          {/* My Templates List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
            {templates.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No custom templates yet. Create one or copy a sample template!
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sample-templates" className="space-y-6">
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              These are popular budgeting templates used worldwide. Click "Copy Template" to create your own customizable version.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleTemplates.map(template => (
              <SampleTemplateCard 
                key={template.id} 
                template={template}
                onCopy={() => handleCopySampleTemplate(template.id)}
                isCopying={copySampleTemplate.isPending}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TemplateCard = ({ template }: { template: any }) => {
  const { data: items = [] } = useBudgetTemplateItems(template.id);
  const [detailOpen, setDetailOpen] = useState(false);
  
  return (
    <>
      <Card className="cursor-pointer hover-scale" onClick={() => setDetailOpen(true)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{template.name}</span>
            <Badge variant="outline">{template.template_type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.slice(0, 3).map((item: any) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{item.categories.icon}</span>
                <span className="text-sm">{item.categories.name}</span>
              </div>
              <Badge variant="secondary">{item.percentage}%</Badge>
            </div>
          ))}
          {items.length > 3 && (
            <div className="text-sm text-muted-foreground text-center pt-2 border-t">
              +{items.length - 3} more categories
            </div>
          )}
        </CardContent>
      </Card>
      <BudgetTemplateDetail 
        template={template} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
    </>
  );
};

const SampleTemplateCard = ({ 
  template, 
  onCopy,
  isCopying 
}: { 
  template: any; 
  onCopy: () => void;
  isCopying: boolean;
}) => {
  const { data: items = [] } = useSampleBudgetTemplateItems(template.id);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{item.category_icon}</span>
                <span className="text-sm">{item.category_name}</span>
              </div>
              <Badge variant="secondary">{item.percentage}%</Badge>
            </div>
          ))}
        </div>
        <Button 
          onClick={onCopy} 
          className="w-full" 
          variant="outline"
          disabled={isCopying}
        >
          <Copy className="h-4 w-4 mr-2" />
          {isCopying ? 'Copying...' : 'Copy Template'}
        </Button>
      </CardContent>
    </Card>
  );
};