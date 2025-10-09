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
          description: sampleTemplate.description,
          template_type: contextType === 'family' && familyId ? 'family' : 'user',
          user_id: contextType === 'individual' || !familyId ? user.id : null,
          family_id: contextType === 'family' ? familyId : null,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Copy the template items by matching category names
      if (sampleItems && sampleItems.length > 0) {
        // Get all user's categories to match by name
        const { data: userCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .or(`user_id.eq.${user.id},is_default.eq.true${familyId ? `,family_id.eq.${familyId}` : ''}`);

        if (categoriesError) throw categoriesError;

        // Map sample items to user's actual categories
        const itemsToInsert = sampleItems
          .map((sampleItem: any) => {
            // Find matching category by name
            const matchingCategory = userCategories?.find(
              (cat: any) => cat.name.toLowerCase() === sampleItem.category_name.toLowerCase()
            );

            if (!matchingCategory) return null;

            return {
              template_id: newTemplate.id,
              category_id: matchingCategory.id,
              percentage: sampleItem.percentage,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        // Insert the mapped items
        if (itemsToInsert.length > 0) {
          const { error: itemsInsertError } = await supabase
            .from('budget_template_items')
            .insert(itemsToInsert);

          if (itemsInsertError) throw itemsInsertError;
        }
      }

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