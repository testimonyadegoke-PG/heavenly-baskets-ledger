import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SampleBudgetTemplate {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface SampleBudgetTemplateItem {
  id: string;
  template_id: string;
  category_name: string;
  category_icon: string;
  percentage: number;
  created_at: string;
}

export const useSampleBudgetTemplates = () => {
  return useQuery({
    queryKey: ['sample-budget-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sample_budget_templates')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as SampleBudgetTemplate[];
    },
  });
};

export const useSampleBudgetTemplateItems = (templateId: string) => {
  return useQuery({
    queryKey: ['sample-budget-template-items', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sample_budget_template_items')
        .select('*')
        .eq('template_id', templateId)
        .order('percentage', { ascending: false });

      if (error) throw error;
      return data as SampleBudgetTemplateItem[];
    },
    enabled: !!templateId,
  });
};

export const useCopySampleTemplate = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      templateId, 
      familyId, 
      contextType 
    }: { 
      templateId: string; 
      familyId?: string | null; 
      contextType: 'individual' | 'family';
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Get the sample template
      const { data: sampleTemplate, error: templateError } = await supabase
        .from('sample_budget_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Get the sample template items
      const { data: sampleItems, error: itemsError } = await supabase
        .from('sample_budget_template_items')
        .select('*')
        .eq('template_id', templateId);

      if (itemsError) throw itemsError;

      // Create a new user/family template
      const { data: newTemplate, error: createError } = await supabase
        .from('budget_templates')
        .insert({
          name: sampleTemplate.name,
          template_type: contextType === 'family' && familyId ? 'family' : 'user',
          user_id: contextType === 'individual' || !familyId ? user.id : null,
          family_id: contextType === 'family' ? familyId : null,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Note: We won't copy the items directly since they reference category names
      // The user will need to map them to their own categories when applying

      return newTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-templates'] });
      toast({
        title: "Success",
        description: "Template copied successfully! You can now customize it.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to copy template: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};