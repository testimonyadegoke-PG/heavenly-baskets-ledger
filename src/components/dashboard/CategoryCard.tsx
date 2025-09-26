import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BudgetCategory } from '@/types/expenses';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  category: BudgetCategory & { budgetId?: string };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const { name, icon, budgetAmount, spent, budgetId } = category;
  const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
  const remaining = budgetAmount - spent;
  const isOverBudget = spent > budgetAmount;

  const handleClick = () => {
    if (budgetId) {
      navigate(`/budgets/${budgetId}`);
    }
  };

  return (
    <Card 
      className="shadow-gentle hover:shadow-elevated transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Budget</span>
          <span className="text-sm font-medium">₦{budgetAmount.toLocaleString()}</span>
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
}