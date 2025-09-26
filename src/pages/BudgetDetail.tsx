import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBudgetById, useUpdateBudget, useDeleteBudget } from '@/hooks/useBudgets';
import { useExpensesByCategory } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import BudgetForm from '@/components/forms/BudgetForm';
import { ArrowLeft, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BudgetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const { data: budget, isLoading: budgetLoading } = useBudgetById(id!);
  const { data: expenses = [] } = useExpensesByCategory(budget?.category_id || '', budget?.month, budget?.year);
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  if (budgetLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!budget) {
    return <div className="flex justify-center items-center h-screen">Budget not found</div>;
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const percentage = budget.budgeted_amount > 0 ? (totalSpent / budget.budgeted_amount) * 100 : 0;
  const remaining = budget.budgeted_amount - totalSpent;
  const isOverBudget = totalSpent > budget.budgeted_amount;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(budget.id);
      navigate('/budgets');
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-2xl">{budget.category_icon}</span>
                {budget.category_name}
              </h1>
              <p className="text-muted-foreground">
                {new Date(budget.year, budget.month - 1).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this budget. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
                    Delete Budget
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Budget Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦{budget.budgeted_amount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Amount Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                ₦{totalSpent.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
                {isOverBudget ? '-' : ''}₦{Math.abs(remaining).toLocaleString()}
              </p>
              {isOverBudget && (
                <Badge variant="destructive" className="mt-2">Over Budget</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Budget Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress 
              value={Math.min(percentage, 100)} 
              className={`h-3 ${isOverBudget ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
            />
            <div className="flex justify-between text-sm">
              <span>{percentage.toFixed(1)}% used</span>
              <span className={isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                {isOverBudget ? 'Over budget!' : `${(100 - percentage).toFixed(1)}% remaining`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <div className="space-y-3">
                {expenses.slice(0, 10).map((expense) => (
                  <div 
                    key={expense.id} 
                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => navigate(`/expenses/${expense.id}`)}
                  >
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-medium">₦{expense.amount.toLocaleString()}</p>
                  </div>
                ))}
                {expenses.length > 10 && (
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/expenses?category=${budget.category_id}`)}>
                    View All {expenses.length} Expenses
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No expenses recorded for this category yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm 
              initialData={budget}
              onSuccess={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BudgetDetail;