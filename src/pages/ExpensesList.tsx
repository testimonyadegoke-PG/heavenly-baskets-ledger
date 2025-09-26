import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ExpenseForm from '@/components/forms/ExpenseForm';
import MonthSelector from '@/components/navigation/MonthSelector';
import { Plus, ArrowLeft, CreditCard, Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PREDEFINED_CATEGORIES } from '@/types/expenses';

const ExpensesList = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const { data: expenses = [] } = useExpenses(selectedMonth, selectedYear);

  const handleMonthChange = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
    setSelectedMonth(monthIndex);
    setSelectedYear(year);
  };

  const getCategoryInfo = (categoryId: string) => {
    return PREDEFINED_CATEGORIES.find(cat => cat.id === categoryId) || {
      name: categoryId,
      icon: '💰',
      color: 'hsl(var(--muted))'
    };
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-destructive" />
                Expenses
              </h1>
              <p className="text-muted-foreground">Manage your spending records</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <ExpenseForm />
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
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">₦{totalExpenses.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Expense Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₦{expenses.length > 0 ? (totalExpenses / expenses.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenses.map((expense) => {
            const category = getCategoryInfo(expense.category_id);
            return (
              <Card 
                key={expense.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/expenses/${expense.id}`)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="truncate">{expense.description}</span>
                  </CardTitle>
                  <Badge variant="outline">
                    {category.name}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Amount</span>
                    <span className="text-lg font-bold text-destructive">₦{expense.amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(expense.date).toLocaleDateString('default', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>

                  {expense.notes && (
                    <div className="pt-2 border-t">
                      <div className="flex items-start gap-1">
                        <FileText className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs text-muted-foreground line-clamp-2">{expense.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {expenses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-destructive/50" />
              <p className="text-muted-foreground mb-4">No expenses recorded for this month yet.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                  </DialogHeader>
                  <ExpenseForm />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExpensesList;