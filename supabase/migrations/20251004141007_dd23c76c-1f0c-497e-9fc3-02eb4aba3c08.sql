-- Fix critical security issues with quote_requests and rate limiting tables

-- 1. Fix quote_requests SELECT policy to explicitly deny unauthenticated access
DROP POLICY IF EXISTS "Admin only access to quote requests" ON public.quote_requests;

-- Create new policy that explicitly checks authentication first
CREATE POLICY "Only authenticated admins can view quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add explicit deny policy for anonymous users
CREATE POLICY "Deny anonymous SELECT on quote requests"
ON public.quote_requests
FOR SELECT
TO anon
USING (false);

-- 2. Fix quote_submission_rate_limit table - it should NOT be publicly readable
DROP POLICY IF EXISTS "Service role only" ON public.quote_submission_rate_limit;

-- This table should only be accessible by service role (edge functions)
-- No policies needed - RLS enabled but no policies means only service role can access
-- This is the most secure approach for internal-only tables

-- 3. Add additional security: Prevent information disclosure through table existence
-- Add a policy that explicitly denies all public access to rate limit table
CREATE POLICY "No public access to rate limits"
ON public.quote_submission_rate_limit
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 4. Verify quote_requests INSERT policy is properly scoped
-- The existing INSERT policy allows anonymous submissions which is correct for the quote form
-- But let's ensure it's properly named and documented
DROP POLICY IF EXISTS "Anyone can create quote requests anonymously" ON public.quote_requests;

CREATE POLICY "Allow anonymous quote request submissions"
ON public.quote_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Add comment documentation for security clarity
COMMENT ON TABLE public.quote_requests IS 'Contains customer PII - only admins can view, anyone can submit';
COMMENT ON TABLE public.quote_submission_rate_limit IS 'Internal rate limiting - service role only, no user access';
COMMENT ON POLICY "Only authenticated admins can view quote requests" ON public.quote_requests IS 'Ensures only authenticated admin users can SELECT from this table';
COMMENT ON POLICY "Deny anonymous SELECT on quote requests" ON public.quote_requests IS 'Explicitly blocks anonymous users from viewing sensitive customer data';
COMMENT ON POLICY "Allow anonymous quote request submissions" ON public.quote_requests IS 'Permits quote form submissions without authentication while protecting existing data from reads';