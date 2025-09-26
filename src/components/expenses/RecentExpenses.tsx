import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense, PREDEFINED_CATEGORIES } from '@/types/expenses';
import { Calendar, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const navigate = useNavigate();
  const sortedExpenses = [...expenses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10); // Show only the 10 most recent

  const getCategoryInfo = (categoryId: string) => {
    return PREDEFINED_CATEGORIES.find(cat => cat.id === categoryId) || {
      name: categoryId,
      icon: '💰',
      color: 'hsl(var(--muted))'
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <Card className="shadow-gentle">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No expenses recorded yet.</p>
            <p className="text-sm">Add your first expense to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-gentle">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedExpenses.map((expense) => {
            const category = getCategoryInfo(expense.category);
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/expenses/${expense.id}`)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-xl flex-shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{expense.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(expense.date)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-lg">₦{expense.amount.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}