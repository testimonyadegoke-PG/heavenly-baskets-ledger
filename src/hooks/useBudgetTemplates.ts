import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface BudgetTemplate {
  id: string;
  name: string;
  user_id?: string;
  family_id?: string;
  template_type: 'user' | 'family';
  created_at: string;
  updated_at: string;
}

export interface BudgetTemplateItem {
  id: string;
  template_id: string;
  category_id: string;
  percentage: number;
  created_at: string;
}

export interface CreateBudgetTemplate {
  name: string;
  template_type: 'user' | 'family';
  family_id?: string;
  items: Array<{
    category_id: string;
    percentage: number;
  }>;
}

export const useBudgetTemplates = (familyId?: string | null, contextType?: 'individual' | 'family') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['budget-templates', familyId, contextType],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase.from('budget_templates').select('*');
      
      if (contextType === 'family' && familyId) {
        query = query.or(`and(template_type.eq.family,family_id.eq.${familyId}),and(template_type.eq.user,user_id.eq.${user.id})`);
      } else {
        query = query.eq('template_type', 'user').eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      return data as BudgetTemplate[];
    },
    enabled: !!user,
  });
};

export const useBudgetTemplateItems = (templateId: string) => {
  return useQuery({
    queryKey: ['budget-template-items', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_template_items')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('template_id', templateId)
        .order('percentage', { ascending: false });

      if (error) throw error;
      return data as (BudgetTemplateItem & { categories: any })[];
    },
    enabled: !!templateId,
  });
};

export const useCreateBudgetTemplate = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateData: CreateBudgetTemplate) => {
      if (!user) throw new Error('User not authenticated');

      // Create the template
      const { data: template, error: templateError } = await supabase
        .from('budget_templates')
        .insert({
          name: templateData.name,
          template_type: templateData.template_type,
          user_id: templateData.template_type === 'user' ? user.id : null,
          family_id: templateData.family_id || null,
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Create the template items
      if (templateData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('budget_template_items')
          .insert(
            templateData.items.map(item => ({
              template_id: template.id,
              category_id: item.category_id,
              percentage: item.percentage,
            }))
          );

        if (itemsError) throw itemsError;
      }

      return template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-templates'] });
      toast({
        title: "Success",
        description: "Budget template created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create budget template: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useApplyBudgetTemplate = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      templateId, 
      totalIncome, 
      month, 
      year, 
      familyId, 
      budgetType 
    }: { 
      templateId: string; 
      totalIncome: number; 
      month: number; 
      year: number; 
      familyId?: string; 
      budgetType: 'individual' | 'family';
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Get template items
      const { data: templateItems, error: itemsError } = await supabase
        .from('budget_template_items')
        .select(`
          *,
          categories (*)
        `)
        .eq('template_id', templateId);

      if (itemsError) throw itemsError;

      // Create budgets based on percentages
      const budgetsToCreate = templateItems.map(item => ({
        user_id: user.id,
        category_id: item.category_id,
        category_name: item.categories.name,
        category_icon: item.categories.icon,
        category_color: item.categories.color,
        budgeted_amount: (totalIncome * item.percentage) / 100,
        month,
        year,
        family_id: familyId || null,
        budget_type: budgetType,
      }));

      const { data, error } = await supabase
        .from('budgets')
        .upsert(budgetsToCreate, {
          onConflict: 'user_id,category_id,month,year,family_id'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget template applied successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to apply budget template: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};