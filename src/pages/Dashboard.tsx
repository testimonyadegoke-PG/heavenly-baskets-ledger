import { useState, useEffect } from 'react';
import { useHeavensBlessings } from '@/hooks/useHeavensBlessings';
import { useBudgets } from '@/hooks/useBudgets';
import { useExpenses } from '@/hooks/useExpenses';
import { useFamilyContext } from '@/contexts/FamilyContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import DateFilter, { DateRange } from '@/components/navigation/DateFilter';
import MetricsCards from '@/components/dashboard/MetricsCards';
import CategoryCard from '@/components/dashboard/CategoryCard';
import ExpenseCharts from '@/components/dashboard/ExpenseCharts';
import HeavensBlessingsForm from '@/components/forms/HeavensBlessingsForm';
import BudgetForm from '@/components/forms/BudgetForm';
import ExpenseForm from '@/components/forms/ExpenseForm';
import RecentExpenses from '@/components/expenses/RecentExpenses';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import { useCheckBudgetAlerts, useCheckSpendingAlerts } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyData, BudgetCategory } from '@/types/expenses';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { selectedFamilyId, contextType } = useFamilyContext();
  const checkBudgetAlerts = useCheckBudgetAlerts();
  const checkSpendingAlerts = useCheckSpendingAlerts();
  
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: startOfMonth, endDate: endOfMonth };
  });

  // Check for budget and spending alerts on component mount
  useEffect(() => {
    const checkAlerts = async () => {
      try {
        await Promise.all([
          checkBudgetAlerts.mutateAsync(contextType === 'family' ? selectedFamilyId || undefined : undefined),
          checkSpendingAlerts.mutateAsync(contextType === 'family' ? selectedFamilyId || undefined : undefined)
        ]);
      } catch (error) {
        console.error('Error checking alerts:', error);
      }
    };

    checkAlerts();
  }, [selectedFamilyId, contextType]);
  
  const monthIndex = dateRange.startDate.getMonth() + 1;
  const currentYear = dateRange.startDate.getFullYear();
  
  const { data: heavensBlessings = [] } = useHeavensBlessings(monthIndex, currentYear, selectedFamilyId, contextType);
  const { data: budgets = [] } = useBudgets(monthIndex, currentYear, selectedFamilyId, contextType);
  const { data: expenses = [] } = useExpenses(monthIndex, currentYear, selectedFamilyId, contextType);

  const totalIncome = heavensBlessings.reduce((sum, blessing) => sum + blessing.amount, 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const twelveBaskets = totalIncome - totalSpent;

  const categories: (BudgetCategory & { budgetId?: string })[] = budgets.map(budget => {
    const categoryExpenses = expenses.filter(expense => expense.category_id === budget.category_id);
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      id: budget.category_id,
      name: budget.category_name,
      icon: budget.category_icon,
      color: budget.category_color,
      budgetAmount: budget.budgeted_amount,
      spent: spent,
      budgetId: budget.id,
    };
  });

  const currentData: MonthlyData = {
    month: new Date(currentYear, monthIndex - 1).toLocaleDateString('default', { month: 'long' }),
    year: currentYear,
    heavensBlessings: totalIncome,
    totalSpent,
    twelveBaskets,
    categories,
    expenses: expenses.map(expense => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.category_id,
      description: expense.description,
      date: expense.date,
      createdAt: expense.created_at,
    })),
  };


  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <DateFilter 
              currentRange={dateRange}
              onDateChange={setDateRange}
            />
          </div>

          <div className="mb-8">
            <MetricsCards data={currentData} />
          </div>

          <div className="mb-8">
            <ExpenseCharts currentData={currentData} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Budget Categories</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Budget
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Budget</DialogTitle>
                    </DialogHeader>
                    <BudgetForm 
                      defaultMonth={monthIndex}
                      defaultYear={currentYear}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    No budget categories yet. Create your first budget to get started!
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expense</TabsTrigger>
                </TabsList>
                
                <TabsContent value="income">
                  <HeavensBlessingsForm />
                </TabsContent>
                
                <TabsContent value="expense">
                  <ExpenseForm />
                </TabsContent>
              </Tabs>
              
              <RecentExpenses 
                expenses={currentData.expenses.slice(0, 5)} 
              />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground border-t pt-6 mt-8">
            <p className="italic">"For where your treasure is, there your heart will be also." - Matthew 6:21</p>
          </div>

          <div className="mt-8">
            <InsightsPanel />
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
};

export default Dashboard;