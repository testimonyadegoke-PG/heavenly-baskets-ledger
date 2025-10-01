-- Drop the overly permissive policy that exposes family member data
DROP POLICY IF EXISTS "Allow family member operations" ON public.family_members;

-- Ensure we have the correct restrictive policies in place
-- These policies properly restrict access to:
-- 1. Users can only view their own family memberships
-- 2. Family creators can manage members in families they created

-- The existing policies are sufficient:
-- - "Read memberships: self or creator" - allows viewing own memberships
-- - "Insert memberships: creator" - only creator can add members
-- - "Update memberships: creator" - only creator can update members  
-- - "Delete memberships: creator" - only creator can delete members
-- - "Family creators can manage members" - comprehensive creator policy

-- No additional policies needed, just removing the dangerous one