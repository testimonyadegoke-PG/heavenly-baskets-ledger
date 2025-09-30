-- Create sample budget templates table for global templates
CREATE TABLE IF NOT EXISTS public.sample_budget_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sample budget template items
CREATE TABLE IF NOT EXISTS public.sample_budget_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.sample_budget_templates(id) ON DELETE CASCADE NOT NULL,
  category_name TEXT NOT NULL,
  category_icon TEXT NOT NULL DEFAULT '💰',
  percentage NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sample_budget_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_budget_template_items ENABLE ROW LEVEL SECURITY;

-- Everyone can read sample templates
CREATE POLICY "Everyone can view sample templates"
ON public.sample_budget_templates FOR SELECT
USING (true);

CREATE POLICY "Everyone can view sample template items"
ON public.sample_budget_template_items FOR SELECT
USING (true);

-- Insert popular budgeting templates

-- 50/30/20 Rule Template
INSERT INTO public.sample_budget_templates (name, description) VALUES
('50/30/20 Rule', 'The 50/30/20 rule is a simple budgeting method where 50% of income goes to needs (housing, utilities, groceries), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. This balanced approach ensures financial stability while allowing for lifestyle enjoyment.');

INSERT INTO public.sample_budget_template_items (template_id, category_name, category_icon, percentage) VALUES
((SELECT id FROM public.sample_budget_templates WHERE name = '50/30/20 Rule'), 'Needs (Housing, Utilities, Groceries)', '🏠', 50),
((SELECT id FROM public.sample_budget_templates WHERE name = '50/30/20 Rule'), 'Wants (Entertainment, Dining)', '🎬', 30),
((SELECT id FROM public.sample_budget_templates WHERE name = '50/30/20 Rule'), 'Savings & Debt Repayment', '💰', 20);

-- Zero-Based Budget Template
INSERT INTO public.sample_budget_templates (name, description) VALUES
('Zero-Based Budget', 'Zero-based budgeting allocates every naira of income to specific categories, leaving zero unassigned. This method ensures complete control over spending by intentionally directing all funds. Essential categories like housing (35%), food (15%), transportation (10%), savings (10%), utilities (5%), healthcare (5%), personal (10%), and entertainment (10%) are pre-allocated.');

INSERT INTO public.sample_budget_template_items (template_id, category_name, category_icon, percentage) VALUES
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Housing & Rent', '🏠', 35),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Food & Groceries', '🍽️', 15),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Transportation', '🚗', 10),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Savings', '💰', 10),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Utilities', '⚡', 5),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Healthcare', '🏥', 5),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Personal Care', '🧴', 10),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Zero-Based Budget'), 'Entertainment', '🎬', 10);

-- 70/20/10 Budget Template
INSERT INTO public.sample_budget_templates (name, description) VALUES
('70/20/10 Budget', 'The 70/20/10 budget allocates 70% to living expenses (rent, food, utilities, transportation), 20% to savings and investments for future goals, and 10% to debt repayment or giving. This approach prioritizes current stability while building wealth and managing obligations.');

INSERT INTO public.sample_budget_template_items (template_id, category_name, category_icon, percentage) VALUES
((SELECT id FROM public.sample_budget_templates WHERE name = '70/20/10 Budget'), 'Living Expenses', '🏠', 70),
((SELECT id FROM public.sample_budget_templates WHERE name = '70/20/10 Budget'), 'Savings & Investments', '💰', 20),
((SELECT id FROM public.sample_budget_templates WHERE name = '70/20/10 Budget'), 'Debt/Giving', '🎁', 10);

-- Dave Ramsey's Budget Template
INSERT INTO public.sample_budget_templates (name, description) VALUES
('Dave Ramsey''s Budget', 'Dave Ramsey''s budget focuses on aggressive debt elimination while maintaining basic needs. Allocations include housing (25%), food (10-15%), transportation (10%), giving (10%), savings (10-15%), utilities (5-10%), insurance (10-15%), personal (5-10%), and lifestyle (5-10%). This debt-focused approach accelerates financial freedom.');

INSERT INTO public.sample_budget_template_items (template_id, category_name, category_icon, percentage) VALUES
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Housing', '🏠', 25),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Food', '🍽️', 12),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Transportation', '🚗', 10),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Giving/Charity', '🎁', 10),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Savings', '💰', 13),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Utilities', '⚡', 8),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Insurance & Healthcare', '🏥', 12),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Personal Care', '🧴', 5),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Dave Ramsey''s Budget'), 'Entertainment', '🎬', 5);

-- Aggressive Savings Template
INSERT INTO public.sample_budget_templates (name, description) VALUES
('Aggressive Savings', 'The aggressive savings budget prioritizes wealth building by allocating 40% to savings and investments. Essential expenses like housing (30%), food (15%), transportation (5%), and utilities (5%) are minimized, with only 5% for entertainment. This approach is ideal for those pursuing early retirement or major financial goals.');

INSERT INTO public.sample_budget_template_items (template_id, category_name, category_icon, percentage) VALUES
((SELECT id FROM public.sample_budget_templates WHERE name = 'Aggressive Savings'), 'Savings & Investments', '💰', 40),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Aggressive Savings'), 'Housing', '🏠', 30),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Aggressive Savings'), 'Food', '🍽️', 15),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Aggressive Savings'), 'Transportation', '🚗', 5),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Aggressive Savings'), 'Utilities', '⚡', 5),
((SELECT id FROM public.sample_budget_templates WHERE name = 'Aggressive Savings'), 'Entertainment', '🎬', 5);