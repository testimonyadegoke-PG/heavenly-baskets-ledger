import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudgets } from '@/hooks/useBudgets';
import { useExpenses } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BudgetForm from '@/components/forms/BudgetForm';
import MonthSelector from '@/components/navigation/MonthSelector';
import { Progress } from '@/components/ui/progress';
import { Plus, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BudgetsList = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const { data: budgets = [] } = useBudgets(selectedMonth, selectedYear);
  const { data: expenses = [] } = useExpenses(selectedMonth, selectedYear);

  const handleMonthChange = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
    setSelectedMonth(monthIndex);
    setSelectedYear(year);
  };

  const getBudgetData = (budget: any) => {
    const categoryExpenses = expenses.filter(expense => expense.category_id === budget.category_id);
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = budget.budgeted_amount > 0 ? (spent / budget.budgeted_amount) * 100 : 0;
    const remaining = budget.budgeted_amount - spent;
    const isOverBudget = spent > budget.budgeted_amount;

    return { spent, percentage, remaining, isOverBudget };
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted_amount, 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/app')}> 
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Budget Management</h1>
              <p className="text-muted-foreground">Manage your monthly budgets</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
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

        <div className="mb-6">
          <MonthSelector 
            currentMonth={new Date(selectedYear, selectedMonth - 1).toLocaleDateString('default', { month: 'long' })}
            currentYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦{totalBudgeted.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${totalSpent > totalBudgeted ? 'text-destructive' : 'text-success'}`}>
                ₦{Math.abs(totalBudgeted - totalSpent).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const { spent, percentage, remaining, isOverBudget } = getBudgetData(budget);
            
            return (
              <Card 
                key={budget.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/budgets/${budget.id}`)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">{budget.category_icon}</span>
                    {budget.category_name}
                  </CardTitle>
                  {isOverBudget && (
                    <Badge variant="destructive">Over Budget</Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Budget</span>
                    <span className="text-sm font-medium">₦{budget.budgeted_amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Spent</span>
                    <span className={`text-sm font-medium ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                      ₦{spent.toLocaleString()}
                    </span>
                  </div>

                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOverBudget ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
                  />

                  <div className="flex justify-between items-center text-xs">
                    <span className={`${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className={`font-medium ${isOverBudget ? 'text-destructive' : remaining > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                      {isOverBudget ? `₦${Math.abs(remaining).toLocaleString()} over` : `₦${remaining.toLocaleString()} left`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No budgets created for this month yet.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Budget
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BudgetsList;