import { useState } from 'react';
import { Heart, Shield, TrendingUp } from 'lucide-react';
import MetricsCards from '@/components/dashboard/MetricsCards';
import CategoryCard from '@/components/dashboard/CategoryCard';
import ExpenseCharts from '@/components/dashboard/ExpenseCharts';
import AddExpenseForm from '@/components/expenses/AddExpenseForm';
import RecentExpenses from '@/components/expenses/RecentExpenses';
import MonthSelector from '@/components/navigation/MonthSelector';
import { sampleMonthlyData, previousMonthsData } from '@/data/sampleData';
import { MonthlyData, Expense, PREDEFINED_CATEGORIES } from '@/types/expenses';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [currentData, setCurrentData] = useState<MonthlyData>(sampleMonthlyData);
  const { toast } = useToast();

  const handleMonthChange = (month: string, year: number) => {
    // In a real app, this would fetch data from the backend
    // For now, we'll use sample data or create empty data for other months
    const existingData = previousMonthsData.find(
      data => data.month === month && data.year === year
    );

    if (existingData) {
      setCurrentData(existingData);
    } else {
      // Create empty data structure for new months
      const newData: MonthlyData = {
        month,
        year,
        heavensBlessings: 0,
        totalSpent: 0,
        twelveBaskets: 0,
        categories: PREDEFINED_CATEGORIES.map(cat => ({
          ...cat,
          budgetAmount: 0,
          spent: 0,
        })),
        expenses: [],
      };
      setCurrentData(newData);
    }
  };

  const handleAddExpense = (newExpense: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => {
    const expense: Expense = {
      id: Date.now().toString(),
      ...newExpense,
      createdAt: new Date().toISOString(),
    };

    setCurrentData(prev => {
      const updatedCategories = prev.categories.map(cat => 
        cat.id === newExpense.category 
          ? { ...cat, spent: cat.spent + newExpense.amount }
          : cat
      );

      const newTotalSpent = prev.totalSpent + newExpense.amount;
      const newTwelveBaskets = prev.heavensBlessings - newTotalSpent;

      return {
        ...prev,
        totalSpent: newTotalSpent,
        twelveBaskets: newTwelveBaskets,
        categories: updatedCategories,
        expenses: [...prev.expenses, expense],
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-card shadow-gentle border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-3 rounded-xl">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Family Blessings</h1>
                <p className="text-muted-foreground">Track Heaven's Blessings & Manage Your 12 Baskets</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Faith-Based Budgeting</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Month Selector */}
        <div className="mb-8">
          <MonthSelector
            currentMonth={currentData.month}
            currentYear={currentData.year}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Key Metrics */}
        <MetricsCards data={currentData} />

        {/* Charts Section */}
        <ExpenseCharts 
          currentData={currentData} 
          historicalData={previousMonthsData}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Categories Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Budget Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentData.categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* Add Expense and Recent Expenses */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Manage Expenses</h2>
            <AddExpenseForm onAddExpense={handleAddExpense} />
            <RecentExpenses expenses={currentData.expenses} />
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center py-8">
          <div className="bg-gradient-accent p-6 rounded-xl inline-block">
            <p className="text-accent-foreground font-medium">
              "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap."
            </p>
            <p className="text-accent-foreground/70 text-sm mt-2">Luke 6:38</p>
          </div>
        </div>
      </main>
    </div>
  );
}