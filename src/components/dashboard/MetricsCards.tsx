import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Gift, Wallet } from 'lucide-react';
import { MonthlyData } from '@/types/expenses';

interface MetricsCardsProps {
  data: MonthlyData;
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  const { heavensBlessings, totalSpent, twelveBaskets } = data;
  const spentPercentage = (totalSpent / heavensBlessings) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Heaven's Blessings */}
      <Card className="bg-gradient-accent shadow-gentle border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-accent-foreground">
            Heaven's Blessings
          </CardTitle>
          <Gift className="h-4 w-4 text-accent-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent-foreground">
            ₦{heavensBlessings.toLocaleString()}
          </div>
          <p className="text-xs text-accent-foreground/70 mt-1">
            Monthly income received
          </p>
        </CardContent>
      </Card>

      {/* Total Spent */}
      <Card className="shadow-gentle">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {spentPercentage.toFixed(1)}% of Heaven's Blessings
          </p>
        </CardContent>
      </Card>

      {/* 12 Baskets */}
      <Card className={`shadow-gentle ${twelveBaskets > 0 ? 'bg-gradient-success' : 'bg-destructive-light'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${twelveBaskets > 0 ? 'text-success-foreground' : 'text-destructive-foreground'}`}>
            12 Baskets
          </CardTitle>
          <Wallet className={`h-4 w-4 ${twelveBaskets > 0 ? 'text-success-foreground' : 'text-destructive-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${twelveBaskets > 0 ? 'text-success-foreground' : 'text-destructive-foreground'}`}>
            ₦{Math.abs(twelveBaskets).toLocaleString()}
          </div>
          <p className={`text-xs mt-1 ${twelveBaskets > 0 ? 'text-success-foreground/70' : 'text-destructive-foreground/70'}`}>
            {twelveBaskets > 0 ? 'Remaining balance' : 'Over budget'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}