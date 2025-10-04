-- Fix critical security issues - corrected version
-- Some policies already exist from previous migration, so we'll only add what's missing

-- 1. Add explicit deny policy for anonymous users on quote_requests
DROP POLICY IF EXISTS "Deny anonymous SELECT on quote requests" ON public.quote_requests;

CREATE POLICY "Deny anonymous SELECT on quote requests"
ON public.quote_requests
FOR SELECT
TO anon
USING (false);

-- 2. Fix the existing INSERT policy name for clarity
DROP POLICY IF EXISTS "Anyone can create quote requests anonymously" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow anonymous quote request submissions" ON public.quote_requests;

CREATE POLICY "Allow anonymous quote request submissions"
ON public.quote_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Fix quote_submission_rate_limit table - remove the insecure policy
DROP POLICY IF EXISTS "Service role only" ON public.quote_submission_rate_limit;
DROP POLICY IF EXISTS "No public access to rate limits" ON public.quote_submission_rate_limit;

-- Create explicit deny policy for all users (only service role can access)
CREATE POLICY "No public access to rate limits"
ON public.quote_submission_rate_limit
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 4. Add security documentation comments
COMMENT ON TABLE public.quote_requests IS 'Contains customer PII - only admins can view, anyone can submit';
COMMENT ON TABLE public.quote_submission_rate_limit IS 'Internal rate limiting - service role only, no user access';

-- 5. Verify the admin-only SELECT policy exists (it should from previous migration)
-- If it doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quote_requests' 
        AND policyname = 'Only authenticated admins can view quote requests'
    ) THEN
        CREATE POLICY "Only authenticated admins can view quote requests"
        ON public.quote_requests
        FOR SELECT
        TO authenticated
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;