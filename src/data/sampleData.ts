import { MonthlyData, PREDEFINED_CATEGORIES } from '@/types/expenses';

export const sampleMonthlyData: MonthlyData = {
  month: 'December',
  year: 2024,
  heavensBlessings: 8500, // Total monthly income
  totalSpent: 6750,
  twelveBaskets: 1750, // Remaining balance
  categories: [
    { 
      ...PREDEFINED_CATEGORIES[0], 
      budgetAmount: 850, 
      spent: 850 
    }, // Tithe - 10%
    { 
      ...PREDEFINED_CATEGORIES[1], 
      budgetAmount: 2000, 
      spent: 1800 
    }, // School Fees
    { 
      ...PREDEFINED_CATEGORIES[2], 
      budgetAmount: 1500, 
      spent: 1200 
    }, // Savings
    { 
      ...PREDEFINED_CATEGORIES[3], 
      budgetAmount: 2500, 
      spent: 2300 
    }, // Feeding
    { 
      ...PREDEFINED_CATEGORIES[4], 
      budgetAmount: 500, 
      spent: 200 
    }, // Gifts
    { 
      ...PREDEFINED_CATEGORIES[5], 
      budgetAmount: 400, 
      spent: 300 
    }, // Date Night
    { 
      ...PREDEFINED_CATEGORIES[6], 
      budgetAmount: 800, 
      spent: 100 
    }, // Investment
  ],
  expenses: [
    {
      id: '1',
      amount: 850,
      category: 'tithe',
      description: 'Monthly tithe offering',
      date: '2024-12-01',
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      amount: 900,
      category: 'school-fees',
      description: 'School fees for Sarah - Term 1',
      date: '2024-12-02',
      createdAt: '2024-12-02T14:30:00Z'
    },
    {
      id: '3',
      amount: 450,
      category: 'feeding',
      description: 'Grocery shopping at Shoprite',
      date: '2024-12-03',
      createdAt: '2024-12-03T11:15:00Z'
    },
    {
      id: '4',
      amount: 900,
      category: 'school-fees',
      description: 'School fees for John - Term 1',
      date: '2024-12-04',
      createdAt: '2024-12-04T09:00:00Z'
    },
    {
      id: '5',
      amount: 1200,
      category: 'savings',
      description: 'Monthly savings transfer',
      date: '2024-12-05',
      createdAt: '2024-12-05T16:00:00Z'
    },
    {
      id: '6',
      amount: 650,
      category: 'feeding',
      description: 'Family outing - restaurant',
      date: '2024-12-08',
      createdAt: '2024-12-08T19:30:00Z'
    },
    {
      id: '7',
      amount: 200,
      category: 'gifts',
      description: 'Birthday gift for cousin',
      date: '2024-12-10',
      createdAt: '2024-12-10T13:20:00Z'
    },
    {
      id: '8',
      amount: 300,
      category: 'date-night',
      description: 'Movie night and dinner',
      date: '2024-12-12',
      createdAt: '2024-12-12T20:00:00Z'
    },
    {
      id: '9',
      amount: 800,
      category: 'feeding',
      description: 'Monthly groceries - bulk shopping',
      date: '2024-12-15',
      createdAt: '2024-12-15T10:45:00Z'
    },
    {
      id: '10',
      amount: 500,
      category: 'feeding',
      description: 'Fresh produce and meat',
      date: '2024-12-18',
      createdAt: '2024-12-18T08:30:00Z'
    },
    {
      id: '11',
      amount: 100,
      category: 'investment',
      description: 'Stock market investment',
      date: '2024-12-20',
      createdAt: '2024-12-20T12:00:00Z'
    }
  ]
};

export const previousMonthsData: MonthlyData[] = [
  {
    month: 'November',
    year: 2024,
    heavensBlessings: 8200,
    totalSpent: 7100,
    twelveBaskets: 1100,
    categories: [
      { ...PREDEFINED_CATEGORIES[0], budgetAmount: 820, spent: 820 },
      { ...PREDEFINED_CATEGORIES[1], budgetAmount: 2000, spent: 2000 },
      { ...PREDEFINED_CATEGORIES[2], budgetAmount: 1500, spent: 1000 },
      { ...PREDEFINED_CATEGORIES[3], budgetAmount: 2500, spent: 2700 },
      { ...PREDEFINED_CATEGORIES[4], budgetAmount: 500, spent: 350 },
      { ...PREDEFINED_CATEGORIES[5], budgetAmount: 400, spent: 180 },
      { ...PREDEFINED_CATEGORIES[6], budgetAmount: 800, spent: 50 },
    ],
    expenses: []
  },
  {
    month: 'October',
    year: 2024,
    heavensBlessings: 8000,
    totalSpent: 6800,
    twelveBaskets: 1200,
    categories: [
      { ...PREDEFINED_CATEGORIES[0], budgetAmount: 800, spent: 800 },
      { ...PREDEFINED_CATEGORIES[1], budgetAmount: 1800, spent: 1800 },
      { ...PREDEFINED_CATEGORIES[2], budgetAmount: 1500, spent: 1500 },
      { ...PREDEFINED_CATEGORIES[3], budgetAmount: 2400, spent: 2200 },
      { ...PREDEFINED_CATEGORIES[4], budgetAmount: 500, spent: 300 },
      { ...PREDEFINED_CATEGORIES[5], budgetAmount: 400, spent: 150 },
      { ...PREDEFINED_CATEGORIES[6], budgetAmount: 800, spent: 50 },
    ],
    expenses: []
  }
];