import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, family_id, analysis_type = 'comprehensive' } = await req.json();
    console.log('Generating financial insights for user:', user_id);

    // Get user's financial data for the last 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    // Fetch expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user_id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    // Fetch income
    const { data: income } = await supabase
      .from('heavens_blessings')
      .select('*')
      .eq('user_id', user_id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    // Fetch budgets
    const { data: budgets } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user_id);

    // Analyze the data with AI
    const analysisPrompt = `
    You are a financial advisor AI. Analyze the following financial data and provide insights:

    EXPENSES (last 6 months):
    ${JSON.stringify(expenses, null, 2)}

    INCOME (last 6 months):
    ${JSON.stringify(income, null, 2)}

    BUDGETS:
    ${JSON.stringify(budgets, null, 2)}

    Please provide:
    1. Overall financial health assessment
    2. Spending pattern analysis
    3. Budget adherence analysis
    4. Specific actionable recommendations for:
       - Budgeting improvements
       - Spending management
       - Savings optimization
       - Investment opportunities
    5. Risk areas to watch

    Respond with a JSON object containing:
    {
      "overallScore": number (1-10),
      "insights": [
        {
          "type": "budgeting|spending|savings|investment",
          "title": "string",
          "description": "string",
          "recommendations": ["string"],
          "priority": "high|medium|low",
          "confidence": number (0-1)
        }
      ],
      "alerts": [
        {
          "type": "warning|info|success",
          "title": "string",
          "message": "string"
        }
      ]
    }
    `;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a professional financial advisor. Provide detailed, actionable insights based on financial data. Always respond with valid JSON only.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      throw new Error('Failed to generate AI insights');
    }

    const aiData = await aiResponse.json();
    const analysisResult = JSON.parse(aiData.choices[0].message.content);

    // Store insights in the database
    const insightsToStore = analysisResult.insights.map((insight: any) => ({
      user_id,
      family_id,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      recommendations: insight.recommendations,
      confidence_score: insight.confidence,
      data_period_start: startDate.toISOString().split('T')[0],
      data_period_end: endDate.toISOString().split('T')[0],
    }));

    const { data: storedInsights, error: insightsError } = await supabase
      .from('insights')
      .insert(insightsToStore)
      .select();

    if (insightsError) {
      console.error('Error storing insights:', insightsError);
      throw insightsError;
    }

    // Create notifications for high-priority insights
    const notifications = analysisResult.insights
      .filter((insight: any) => insight.priority === 'high')
      .map((insight: any) => ({
        user_id,
        title: `Financial Insight: ${insight.title}`,
        message: insight.description,
        type: 'info',
        category: 'recommendation',
        metadata: { insight_type: insight.type }
      }));

    if (notifications.length > 0) {
      await supabase
        .from('notifications')
        .insert(notifications);
    }

    // Create alert notifications
    const alertNotifications = analysisResult.alerts
      .filter((alert: any) => alert.type === 'warning')
      .map((alert: any) => ({
        user_id,
        title: alert.title,
        message: alert.message,
        type: 'warning',
        category: 'budget_alert',
      }));

    if (alertNotifications.length > 0) {
      await supabase
        .from('notifications')
        .insert(alertNotifications);
    }

    console.log('Financial analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      overallScore: analysisResult.overallScore,
      insights: storedInsights,
      alerts: analysisResult.alerts,
      dataAnalyzed: {
        expenseCount: expenses?.length || 0,
        incomeCount: income?.length || 0,
        budgetCount: budgets?.length || 0,
        period: { start: startDate, end: endDate }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in financial-intelligence function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});