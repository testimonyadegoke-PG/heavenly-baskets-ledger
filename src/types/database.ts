export interface HeavensBlessings {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  date: string;
  notes?: string;
  family_id?: string;
  income_type: 'family' | 'individual';
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
  family_id?: string;
  budget_type: 'family' | 'individual';
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
  family_id?: string;
  expense_type: 'family' | 'individual';
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: 'admin' | 'parent' | 'child' | 'member';
  joined_at: string;
}

export interface FamilyInvitation {
  id: string;
  family_id: string;
  invited_by: string;
  invited_email: string;
  role: 'admin' | 'parent' | 'child' | 'member';
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  expires_at: string;
}

export interface CreateHeavensBlessings {
  amount: number;
  source: string;
  date: string;
  notes?: string;
  family_id?: string;
  income_type: 'family' | 'individual';
}

export interface UpdateHeavensBlessings {
  amount?: number;
  source?: string;
  date?: string;
  notes?: string;
  family_id?: string;
  income_type?: 'family' | 'individual';
}

export interface CreateBudget {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  budgeted_amount: number;
  month: number;
  year: number;
  family_id?: string;
  budget_type: 'family' | 'individual';
}

export interface UpdateBudget {
  budgeted_amount?: number;
  family_id?: string;
  budget_type?: 'family' | 'individual';
}

export interface CreateExpense {
  category_id: string;
  amount: number;
  description: string;
  date: string;
  notes?: string;
  family_id?: string;
  expense_type: 'family' | 'individual';
}

export interface UpdateExpense {
  category_id?: string;
  amount?: number;
  description?: string;
  date?: string;
  notes?: string;
  family_id?: string;
  expense_type?: 'family' | 'individual';
}

export interface CreateFamily {
  name: string;
}

export interface UpdateFamily {
  name?: string;
}

export interface CreateFamilyInvitation {
  family_id: string;
  invited_email: string;
  role: 'admin' | 'parent' | 'child' | 'member';
}

export interface CreateFamilyMember {
  family_id: string;
  user_id: string;
  role: 'admin' | 'parent' | 'child' | 'member';
}