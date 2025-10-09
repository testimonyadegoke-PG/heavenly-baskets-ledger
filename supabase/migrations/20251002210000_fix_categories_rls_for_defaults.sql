-- Fix categories RLS policy to allow users to see default categories
-- The current policy only allows users to see their own categories or family categories
-- but NOT default categories (is_default = true)

DROP POLICY IF EXISTS "Users can view their categories and family categories" ON public.categories;

CREATE POLICY "Users can view their categories, family categories, and defaults" 
ON public.categories 
FOR SELECT 
USING (
  -- Allow viewing default categories (system-wide)
  is_default = true OR
  -- Allow viewing user's own categories
  (category_type = 'user' AND user_id = auth.uid()) OR
  -- Allow viewing family categories if user is a member
  (category_type = 'family' AND family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.family_id = categories.family_id AND fm.user_id = auth.uid()
  ))
);

-- Add comment explaining the policy
COMMENT ON POLICY "Users can view their categories, family categories, and defaults" ON public.categories 
IS 'Allows users to view: 1) default/system categories (is_default=true), 2) their own user categories, 3) family categories they are members of';
