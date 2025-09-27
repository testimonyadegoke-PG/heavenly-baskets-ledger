-- Create families table
CREATE TABLE public.families (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family members table
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'parent', 'child', 'member'
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(family_id, user_id)
);

-- Create family invitations table
CREATE TABLE public.family_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL,
  invited_email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Add family_id and budget_type to existing tables
ALTER TABLE public.budgets 
ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
ADD COLUMN budget_type TEXT NOT NULL DEFAULT 'family'; -- 'family', 'individual'

ALTER TABLE public.expenses 
ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
ADD COLUMN expense_type TEXT NOT NULL DEFAULT 'family'; -- 'family', 'individual'

ALTER TABLE public.heavens_blessings 
ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
ADD COLUMN income_type TEXT NOT NULL DEFAULT 'family'; -- 'family', 'individual'

-- Enable RLS on new tables
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for families
CREATE POLICY "Users can view families they belong to" 
ON public.families 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = families.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create families" 
ON public.families 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Family admins can update families" 
ON public.families 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = families.id AND user_id = auth.uid() AND role IN ('admin', 'parent')
  )
);

-- Create RLS policies for family_members
CREATE POLICY "Users can view family members of their families" 
ON public.family_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members fm 
    WHERE fm.family_id = family_members.family_id AND fm.user_id = auth.uid()
  )
);

CREATE POLICY "Family admins can manage members" 
ON public.family_members 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members fm 
    WHERE fm.family_id = family_members.family_id AND fm.user_id = auth.uid() AND fm.role IN ('admin', 'parent')
  )
);

-- Create RLS policies for family_invitations
CREATE POLICY "Users can view invitations for their families" 
ON public.family_invitations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members fm 
    WHERE fm.family_id = family_invitations.family_id AND fm.user_id = auth.uid() AND fm.role IN ('admin', 'parent')
  )
  OR invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Family admins can create invitations" 
ON public.family_invitations 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members fm 
    WHERE fm.family_id = family_invitations.family_id AND fm.user_id = auth.uid() AND fm.role IN ('admin', 'parent')
  )
);

-- Update existing RLS policies to include family context
DROP POLICY "Users can view their own budgets" ON public.budgets;
CREATE POLICY "Users can view their budgets" 
ON public.budgets 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = budgets.family_id AND user_id = auth.uid()
  ))
);

DROP POLICY "Users can create their own budgets" ON public.budgets;
CREATE POLICY "Users can create budgets" 
ON public.budgets 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (family_id IS NULL OR EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = budgets.family_id AND user_id = auth.uid()
  ))
);

DROP POLICY "Users can update their own budgets" ON public.budgets;
CREATE POLICY "Users can update budgets" 
ON public.budgets 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = budgets.family_id AND user_id = auth.uid() AND role IN ('admin', 'parent')
  ))
);

DROP POLICY "Users can delete their own budgets" ON public.budgets;
CREATE POLICY "Users can delete budgets" 
ON public.budgets 
FOR DELETE 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = budgets.family_id AND user_id = auth.uid() AND role IN ('admin', 'parent')
  ))
);

-- Similar updates for expenses
DROP POLICY "Users can view their own expenses" ON public.expenses;
CREATE POLICY "Users can view their expenses" 
ON public.expenses 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = expenses.family_id AND user_id = auth.uid()
  ))
);

DROP POLICY "Users can create their own expenses" ON public.expenses;
CREATE POLICY "Users can create expenses" 
ON public.expenses 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (family_id IS NULL OR EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = expenses.family_id AND user_id = auth.uid()
  ))
);

DROP POLICY "Users can update their own expenses" ON public.expenses;
CREATE POLICY "Users can update expenses" 
ON public.expenses 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = expenses.family_id AND user_id = auth.uid() AND role IN ('admin', 'parent')
  ))
);

DROP POLICY "Users can delete their own expenses" ON public.expenses;
CREATE POLICY "Users can delete expenses" 
ON public.expenses 
FOR DELETE 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = expenses.family_id AND user_id = auth.uid() AND role IN ('admin', 'parent')
  ))
);

-- Similar updates for heavens_blessings
DROP POLICY "Users can view their own income" ON public.heavens_blessings;
CREATE POLICY "Users can view their income" 
ON public.heavens_blessings 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = heavens_blessings.family_id AND user_id = auth.uid()
  ))
);

DROP POLICY "Users can create their own income" ON public.heavens_blessings;
CREATE POLICY "Users can create income" 
ON public.heavens_blessings 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (family_id IS NULL OR EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = heavens_blessings.family_id AND user_id = auth.uid()
  ))
);

DROP POLICY "Users can update their own income" ON public.heavens_blessings;
CREATE POLICY "Users can update income" 
ON public.heavens_blessings 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = heavens_blessings.family_id AND user_id = auth.uid() AND role IN ('admin', 'parent')
  ))
);

DROP POLICY "Users can delete their own income" ON public.heavens_blessings;
CREATE POLICY "Users can delete income" 
ON public.heavens_blessings 
FOR DELETE 
USING (
  auth.uid() = user_id 
  OR (family_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = heavens_blessings.family_id AND user_id = auth.uid() AND role IN ('admin', 'parent')
  ))
);

-- Add triggers for updated_at
CREATE TRIGGER update_families_updated_at
BEFORE UPDATE ON public.families
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();