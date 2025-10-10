-- Allow family members to view families they belong to
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'families' AND policyname = 'Members can view families they belong to'
  ) THEN
    CREATE POLICY "Members can view families they belong to"
    ON public.families
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.family_members fm
        WHERE fm.family_id = families.id
          AND fm.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Allow invited users to insert their own membership upon acceptance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'family_members' AND policyname = 'Invited users can insert their own membership'
  ) THEN
    CREATE POLICY "Invited users can insert their own membership"
    ON public.family_members
    FOR INSERT
    TO authenticated
    WITH CHECK (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.family_invitations fi
        WHERE fi.family_id = family_members.family_id
          AND fi.invited_email = (auth.jwt() ->> 'email')
          AND fi.status = 'pending'
      )
    );
  END IF;
END $$;

-- Allow invited users to update their invitation (accept/decline)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'family_invitations' AND policyname = 'Invited users can update their invitation'
  ) THEN
    CREATE POLICY "Invited users can update their invitation"
    ON public.family_invitations
    FOR UPDATE
    TO authenticated
    USING (
      invited_email = (auth.jwt() ->> 'email')
    )
    WITH CHECK (
      invited_email = (auth.jwt() ->> 'email')
    );
  END IF;
END $$;

-- Create trigger to notify when invitation is accepted
DROP TRIGGER IF EXISTS trg_notify_invitation_accepted ON public.family_invitations;
CREATE TRIGGER trg_notify_invitation_accepted
AFTER UPDATE ON public.family_invitations
FOR EACH ROW
EXECUTE FUNCTION public.notify_invitation_accepted();

-- Create trigger to notify invited user when invitation is created
DROP TRIGGER IF EXISTS trg_create_family_invitation_notification ON public.family_invitations;
CREATE TRIGGER trg_create_family_invitation_notification
AFTER INSERT ON public.family_invitations
FOR EACH ROW
EXECUTE FUNCTION public.create_family_invitation_notification();