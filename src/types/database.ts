export interface HeavensBlessings {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  budgeted_amount: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseExpense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHeavensBlessings {
  amount: number;
  source: string;
  date: string;
  notes?: string;
}

export interface UpdateHeavensBlessings {
  amount?: number;
  source?: string;
  date?: string;
  notes?: string;
}

export interface CreateBudget {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  budgeted_amount: number;
  month: number;
  year: number;
}

export interface UpdateBudget {
  budgeted_amount?: number;
}

export interface CreateExpense {
  category_id: string;
  amount: number;
  description: string;
  date: string;
  notes?: string;
}

export interface UpdateExpense {
  category_id?: string;
  amount?: number;
  description?: string;
  date?: string;
  notes?: string;
}