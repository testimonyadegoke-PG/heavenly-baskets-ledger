import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Insight {
  id: string;
  user_id: string;
  family_id?: string;
  type: 'budgeting' | 'spending' | 'savings' | 'investment';
  title: string;
  description: string;
  recommendations: string[];
  confidence_score: number;
  data_period_start: string;
  data_period_end: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useInsights = (familyId?: string | null) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['insights', user?.id, familyId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (familyId) {
        query = query.or(`family_id.is.null,family_id.eq.${familyId}`);
      } else {
        query = query.is('family_id', null);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      return data as Insight[];
    },
    enabled: !!user,
  });
};

export const useGenerateInsights = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ familyId, analysisType = 'comprehensive' }: { familyId?: string; analysisType?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('financial-intelligence', {
        body: {
          user_id: user.id,
          family_id: familyId,
          analysis_type: analysisType
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      toast({
        title: "Insights Generated",
        description: `Generated ${data.insights?.length || 0} new financial insights with an overall score of ${data.overallScore}/10.`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate insights: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};