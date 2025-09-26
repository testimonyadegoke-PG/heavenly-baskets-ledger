import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useHeavensBlessings } from '@/hooks/useHeavensBlessings';
import { useBudgets } from '@/hooks/useBudgets';
import { useExpenses } from '@/hooks/useExpenses';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MonthSelector from '@/components/navigation/MonthSelector';
import MainNavigation from '@/components/navigation/MainNavigation';
import MetricsCards from '@/components/dashboard/MetricsCards';
import CategoryCard from '@/components/dashboard/CategoryCard';
import ExpenseCharts from '@/components/dashboard/ExpenseCharts';
import HeavensBlessingsForm from '@/components/forms/HeavensBlessingsForm';
import BudgetForm from '@/components/forms/BudgetForm';
import ExpenseForm from '@/components/forms/ExpenseForm';
import RecentExpenses from '@/components/expenses/RecentExpenses';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyData, BudgetCategory } from '@/types/expenses';
import { PREDEFINED_CATEGORIES } from '@/types/expenses';
import { LogOut, Plus } from 'lucide-react';

const Dashboard = () => {
  const { signOut } = useAuth();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const { data: heavensBlessings = [] } = useHeavensBlessings(selectedMonth, selectedYear);
  const { data: budgets = [] } = useBudgets(selectedMonth, selectedYear);
  const { data: expenses = [] } = useExpenses(selectedMonth, selectedYear);

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
    month: new Date(selectedYear, selectedMonth - 1).toLocaleDateString('default', { month: 'long' }),
    year: selectedYear,
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

  const handleMonthChange = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
    setSelectedMonth(monthIndex);
    setSelectedYear(year);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Family Finance Dashboard</h1>
                <p className="text-muted-foreground mt-1">Managing Heaven's Blessings with Wisdom</p>
              </div>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
            
            <MonthSelector 
              currentMonth={currentData.month} 
              currentYear={currentData.year}
              onMonthChange={handleMonthChange}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <MainNavigation />
        </div>

        <div className="container mx-auto px-4 py-6">
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
                      defaultMonth={selectedMonth}
                      defaultYear={selectedYear}
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

          <div className="text-center text-sm text-muted-foreground border-t pt-6">
            <p className="italic">"For where your treasure is, there your heart will be also." - Matthew 6:21</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;