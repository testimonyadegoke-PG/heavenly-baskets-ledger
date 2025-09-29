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
    const { action, ...data } = await req.json();
    console.log('Notification service action:', action);

    switch (action) {
      case 'create_notification':
        return await createNotification(data);
      
      case 'check_budget_alerts':
        return await checkBudgetAlerts(data);
      
      case 'check_spending_alerts':
        return await checkSpendingAlerts(data);
      
      case 'mark_as_read':
        return await markAsRead(data);
      
      case 'get_notifications':
        return await getNotifications(data);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error: any) {
    console.error('Error in notification-service function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createNotification(data: any) {
  const { user_id, title, message, type = 'info', category = 'general', action_url, metadata = {} } = data;

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id,
      title,
      message,
      type,
      category,
      action_url,
      metadata
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    notification
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function checkBudgetAlerts(data: any) {
  const { user_id, family_id } = data;
  console.log('Checking budget alerts for user:', user_id);

  // Get current month's budgets and expenses
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Fetch current month's budgets
  let budgetQuery = supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user_id)
    .eq('month', currentMonth)
    .eq('year', currentYear);

  if (family_id) {
    budgetQuery = budgetQuery.eq('family_id', family_id);
  }

  const { data: budgets } = await budgetQuery;

  // Fetch current month's expenses
  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0);

  let expenseQuery = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user_id)
    .gte('date', firstDay.toISOString().split('T')[0])
    .lte('date', lastDay.toISOString().split('T')[0]);

  if (family_id) {
    expenseQuery = expenseQuery.eq('family_id', family_id);
  }

  const { data: expenses } = await expenseQuery;

  const notifications = [];

  // Check for overspending by category
  for (const budget of budgets || []) {
    const categoryExpenses = expenses?.filter(exp => exp.category_id === budget.category_id) || [];
    const totalSpent = categoryExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const budgetAmount = parseFloat(budget.budgeted_amount);
    const spentPercentage = (totalSpent / budgetAmount) * 100;

    if (totalSpent > budgetAmount) {
      notifications.push({
        user_id,
        title: `Budget Exceeded: ${budget.category_name}`,
        message: `You've spent $${totalSpent.toFixed(2)} of your $${budgetAmount.toFixed(2)} ${budget.category_name} budget (${spentPercentage.toFixed(1)}% over).`,
        type: 'error',
        category: 'spending_alert',
        metadata: {
          category_id: budget.category_id,
          category_name: budget.category_name,
          budgeted: budgetAmount,
          spent: totalSpent,
          percentage: spentPercentage
        }
      });
    } else if (spentPercentage >= 80) {
      notifications.push({
        user_id,
        title: `Budget Warning: ${budget.category_name}`,
        message: `You've used ${spentPercentage.toFixed(1)}% of your ${budget.category_name} budget ($${totalSpent.toFixed(2)} of $${budgetAmount.toFixed(2)}).`,
        type: 'warning',
        category: 'spending_alert',
        metadata: {
          category_id: budget.category_id,
          category_name: budget.category_name,
          budgeted: budgetAmount,
          spent: totalSpent,
          percentage: spentPercentage
        }
      });
    }
  }

  // Insert notifications
  if (notifications.length > 0) {
    await supabase
      .from('notifications')
      .insert(notifications);
  }

  return new Response(JSON.stringify({
    success: true,
    alertsCreated: notifications.length,
    alerts: notifications
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function checkSpendingAlerts(data: any) {
  const { user_id, family_id } = data;
  console.log('Checking spending alerts for user:', user_id);

  // Get total income for current month
  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  let incomeQuery = supabase
    .from('heavens_blessings')
    .select('*')
    .eq('user_id', user_id)
    .gte('date', firstDay.toISOString().split('T')[0])
    .lte('date', lastDay.toISOString().split('T')[0]);

  if (family_id) {
    incomeQuery = incomeQuery.eq('family_id', family_id);
  }

  const { data: income } = await incomeQuery;
  const totalIncome = income?.reduce((sum, inc) => sum + parseFloat(inc.amount), 0) || 0;

  // Get total expenses for current month
  let expenseQuery = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user_id)
    .gte('date', firstDay.toISOString().split('T')[0])
    .lte('date', lastDay.toISOString().split('T')[0]);

  if (family_id) {
    expenseQuery = expenseQuery.eq('family_id', family_id);
  }

  const { data: expenses } = await expenseQuery;
  const totalExpenses = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;

  const notifications = [];

  // Check if spending exceeds income
  if (totalExpenses > totalIncome) {
    const deficit = totalExpenses - totalIncome;
    notifications.push({
      user_id,
      title: 'Monthly Spending Alert',
      message: `Your expenses ($${totalExpenses.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}) by $${deficit.toFixed(2)} this month.`,
      type: 'error',
      category: 'spending_alert',
      metadata: {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        deficit: deficit
      }
    });
  } else if (totalIncome > 0 && (totalExpenses / totalIncome) > 0.9) {
    const spentPercentage = ((totalExpenses / totalIncome) * 100);
    notifications.push({
      user_id,
      title: 'High Spending Warning',
      message: `You've spent ${spentPercentage.toFixed(1)}% of your monthly income ($${totalExpenses.toFixed(2)} of $${totalIncome.toFixed(2)}).`,
      type: 'warning',
      category: 'spending_alert',
      metadata: {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        percentage: spentPercentage
      }
    });
  }

  // Insert notifications
  if (notifications.length > 0) {
    await supabase
      .from('notifications')
      .insert(notifications);
  }

  return new Response(JSON.stringify({
    success: true,
    alertsCreated: notifications.length,
    alerts: notifications
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function markAsRead(data: any) {
  const { notification_id, user_id } = data;

  const { data: notification, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notification_id)
    .eq('user_id', user_id)
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    notification
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getNotifications(data: any) {
  const { user_id, limit = 20, offset = 0, unread_only = false } = data;

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (unread_only) {
    query = query.eq('read', false);
  }

  const { data: notifications, error } = await query;

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    notifications,
    total: notifications?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}