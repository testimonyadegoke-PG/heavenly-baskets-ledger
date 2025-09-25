export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetAmount: number;
  spent: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  heavensBlessings: number; // Income
  totalSpent: number;
  twelveBaskets: number; // Remaining balance
  categories: BudgetCategory[];
  expenses: Expense[];
}

export const PREDEFINED_CATEGORIES: Omit<BudgetCategory, 'budgetAmount' | 'spent'>[] = [
  { id: 'tithe', name: 'Tithe', icon: '🙏', color: 'hsl(43 89% 70%)' },
  { id: 'school-fees', name: 'School Fees', icon: '🎓', color: 'hsl(210 89% 70%)' },
  { id: 'savings', name: 'Savings', icon: '💰', color: 'hsl(142 71% 45%)' },
  { id: 'feeding', name: 'Feeding', icon: '🍽️', color: 'hsl(25 89% 70%)' },
  { id: 'gifts', name: 'Gifts', icon: '🎁', color: 'hsl(320 89% 70%)' },
  { id: 'date-night', name: 'Date Night / Other Enjoyment', icon: '💕', color: 'hsl(340 89% 70%)' },
  { id: 'investment', name: 'Investment', icon: '📈', color: 'hsl(158 64% 52%)' },
];