-- Add email masking function for privacy
-- This function masks email addresses for non-admin family members
CREATE OR REPLACE FUNCTION public.mask_email(email text, user_id uuid, family_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  local_part text;
  domain_part text;
BEGIN
  -- Check if user is admin or parent in the family
  SELECT EXISTS (
    SELECT 1 FROM family_members fm
    WHERE fm.family_id = $3
      AND fm.user_id = $2
      AND (fm.role = ANY (ARRAY['admin'::text, 'parent'::text]))
  ) INTO is_admin;
  
  -- If user is admin/parent or the email belongs to them, show full email
  IF is_admin OR email = (SELECT auth.jwt() ->> 'email') THEN
    RETURN email;
  END IF;
  
  -- Otherwise, mask the email
  -- Split email into local and domain parts
  local_part := split_part(email, '@', 1);
  domain_part := split_part(email, '@', 2);
  
  -- Mask: show first 2 chars + *** + @domain
  IF length(local_part) <= 2 THEN
    RETURN substring(local_part from 1 for 1) || '***@' || domain_part;
  ELSE
    RETURN substring(local_part from 1 for 2) || '***@' || domain_part;
  END IF;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION public.mask_email IS 'Masks email addresses for privacy. Shows full email only to admins/parents and the email owner.';