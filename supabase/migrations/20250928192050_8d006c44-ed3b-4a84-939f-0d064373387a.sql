-- Fix family invitations RLS policy to be more inclusive with roles
DROP POLICY IF EXISTS "Family admins can create invitations" ON public.family_invitations;

CREATE POLICY "Family admins can create invitations" 
ON public.family_invitations
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = family_invitations.family_id 
    AND fm.user_id = auth.uid() 
    AND (fm.role = ANY (ARRAY['admin'::text, 'parent'::text]) OR fm.role ILIKE '%admin%' OR fm.role ILIKE '%parent%' OR fm.role ILIKE '%dad%' OR fm.role ILIKE '%mom%')
  )
);

-- Also update the view policy to be consistent
DROP POLICY IF EXISTS "Users can view invitations for their families or self" ON public.family_invitations;

CREATE POLICY "Users can view invitations for their families or self" 
ON public.family_invitations
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = family_invitations.family_id 
    AND fm.user_id = auth.uid() 
    AND (fm.role = ANY (ARRAY['admin'::text, 'parent'::text]) OR fm.role ILIKE '%admin%' OR fm.role ILIKE '%parent%' OR fm.role ILIKE '%dad%' OR fm.role ILIKE '%mom%')
  ) 
  OR invited_email = (auth.jwt() ->> 'email'::text)
);

-- Create categories table for user and family level categories
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '💰',
  color text NOT NULL DEFAULT '#3B82F6',
  category_type text NOT NULL DEFAULT 'user' CHECK (category_type IN ('user', 'family')),
  user_id uuid REFERENCES auth.users(id),
  family_id uuid,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(name, user_id, family_id)
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view their categories and family categories" 
ON public.categories 
FOR SELECT 
USING (
  (category_type = 'user' AND user_id = auth.uid()) OR
  (category_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = categories.family_id AND fm.user_id = auth.uid()
  ))
);

CREATE POLICY "Users can create their own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (
  (category_type = 'user' AND user_id = auth.uid()) OR
  (category_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = categories.family_id 
    AND fm.user_id = auth.uid() 
    AND (fm.role = ANY (ARRAY['admin'::text, 'parent'::text]) OR fm.role ILIKE '%admin%' OR fm.role ILIKE '%parent%' OR fm.role ILIKE '%dad%' OR fm.role ILIKE '%mom%')
  ))
);

CREATE POLICY "Users can update their categories" 
ON public.categories 
FOR UPDATE 
USING (
  (category_type = 'user' AND user_id = auth.uid()) OR
  (category_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = categories.family_id 
    AND fm.user_id = auth.uid() 
    AND (fm.role = ANY (ARRAY['admin'::text, 'parent'::text]) OR fm.role ILIKE '%admin%' OR fm.role ILIKE '%parent%' OR fm.role ILIKE '%dad%' OR fm.role ILIKE '%mom%')
  ))
);

CREATE POLICY "Users can delete their categories" 
ON public.categories 
FOR DELETE 
USING (
  (category_type = 'user' AND user_id = auth.uid()) OR
  (category_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = categories.family_id 
    AND fm.user_id = auth.uid() 
    AND (fm.role = ANY (ARRAY['admin'::text, 'parent'::text]) OR fm.role ILIKE '%admin%' OR fm.role ILIKE '%parent%' OR fm.role ILIKE '%dad%' OR fm.role ILIKE '%mom%')
  ))
);

-- Create budget templates table for percentage-based budgets
CREATE TABLE public.budget_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  family_id uuid,
  template_type text NOT NULL DEFAULT 'user' CHECK (template_type IN ('user', 'family')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Budget template items
CREATE TABLE public.budget_template_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES public.budget_templates(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id),
  percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on budget templates
ALTER TABLE public.budget_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_template_items ENABLE ROW LEVEL SECURITY;

-- Budget templates policies
CREATE POLICY "Users can view their budget templates" 
ON public.budget_templates 
FOR SELECT 
USING (
  (template_type = 'user' AND user_id = auth.uid()) OR
  (template_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = budget_templates.family_id AND fm.user_id = auth.uid()
  ))
);

CREATE POLICY "Users can create budget templates" 
ON public.budget_templates 
FOR INSERT 
WITH CHECK (
  (template_type = 'user' AND user_id = auth.uid()) OR
  (template_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = budget_templates.family_id AND fm.user_id = auth.uid()
  ))
);

CREATE POLICY "Users can update their budget templates" 
ON public.budget_templates 
FOR UPDATE 
USING (
  (template_type = 'user' AND user_id = auth.uid()) OR
  (template_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = budget_templates.family_id AND fm.user_id = auth.uid()
  ))
);

CREATE POLICY "Users can delete their budget templates" 
ON public.budget_templates 
FOR DELETE 
USING (
  (template_type = 'user' AND user_id = auth.uid()) OR
  (template_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = budget_templates.family_id AND fm.user_id = auth.uid()
  ))
);

-- Budget template items policies
CREATE POLICY "Users can view budget template items" 
ON public.budget_template_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM budget_templates bt 
    WHERE bt.id = budget_template_items.template_id 
    AND (
      (bt.template_type = 'user' AND bt.user_id = auth.uid()) OR
      (bt.template_type = 'family' AND bt.family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm 
        WHERE fm.family_id = bt.family_id AND fm.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Users can create budget template items" 
ON public.budget_template_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM budget_templates bt 
    WHERE bt.id = budget_template_items.template_id 
    AND (
      (bt.template_type = 'user' AND bt.user_id = auth.uid()) OR
      (bt.template_type = 'family' AND bt.family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm 
        WHERE fm.family_id = bt.family_id AND fm.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Users can update budget template items" 
ON public.budget_template_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM budget_templates bt 
    WHERE bt.id = budget_template_items.template_id 
    AND (
      (bt.template_type = 'user' AND bt.user_id = auth.uid()) OR
      (bt.template_type = 'family' AND bt.family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm 
        WHERE fm.family_id = bt.family_id AND fm.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Users can delete budget template items" 
ON public.budget_template_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM budget_templates bt 
    WHERE bt.id = budget_template_items.template_id 
    AND (
      (bt.template_type = 'user' AND bt.user_id = auth.uid()) OR
      (bt.template_type = 'family' AND bt.family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm 
        WHERE fm.family_id = bt.family_id AND fm.user_id = auth.uid()
      ))
    )
  )
);

-- Insert default categories
INSERT INTO public.categories (name, icon, color, category_type, is_default) VALUES
('Food & Groceries', '🍽️', '#10B981', 'user', true),
('Transportation', '🚗', '#3B82F6', 'user', true),
('Housing', '🏠', '#8B5CF6', 'user', true),
('Utilities', '⚡', '#F59E0B', 'user', true),
('Healthcare', '🏥', '#EF4444', 'user', true),
('Entertainment', '🎬', '#EC4899', 'user', true),
('Shopping', '🛍️', '#06B6D4', 'user', true),
('Education', '📚', '#84CC16', 'user', true),
('Personal Care', '🧴', '#F97316', 'user', true),
('Other', '💰', '#6B7280', 'user', true);

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_templates_updated_at
  BEFORE UPDATE ON public.budget_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();