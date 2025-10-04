-- Phase 1: Fix RLS Policies for Profiles Table
-- Remove overly permissive policy that allows all authenticated users to view all profiles
DROP POLICY IF EXISTS "Users can view limited profile info when authenticated" ON public.profiles;

-- Add restrictive policy: users can only view their own profile
CREATE POLICY "Users can view their own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Consolidate duplicate deliverables policies
-- Remove duplicate SELECT policies
DROP POLICY IF EXISTS "Users can view their own deliverable files" ON public.deliverables;
DROP POLICY IF EXISTS "Users can view their own deliverables" ON public.deliverables;

-- Add single consolidated SELECT policy
CREATE POLICY "Users can view their own deliverables"
ON public.deliverables
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Phase 2: Add audit logging trigger for user_roles
-- Create audit log table for role changes
CREATE TABLE IF NOT EXISTS public.user_role_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  old_role app_role,
  new_role app_role,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT now(),
  action text NOT NULL
);

-- Enable RLS on audit table
ALTER TABLE public.user_role_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view role audit logs"
ON public.user_role_audit
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Create improved audit logging function
CREATE OR REPLACE FUNCTION public.log_role_changes_detailed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_role_audit (user_id, old_role, new_role, changed_by, action)
    VALUES (NEW.user_id, NULL, NEW.role, auth.uid(), 'INSERT');
    RAISE LOG 'Role assigned: user_id=%, new_role=%, changed_by=%', 
      NEW.user_id, NEW.role::text, auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.user_role_audit (user_id, old_role, new_role, changed_by, action)
    VALUES (NEW.user_id, OLD.role, NEW.role, auth.uid(), 'UPDATE');
    RAISE LOG 'Role changed: user_id=%, old_role=%, new_role=%, changed_by=%', 
      NEW.user_id, OLD.role::text, NEW.role::text, auth.uid();
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.user_role_audit (user_id, old_role, new_role, changed_by, action)
    VALUES (OLD.user_id, OLD.role, NULL, auth.uid(), 'DELETE');
    RAISE LOG 'Role removed: user_id=%, old_role=%, changed_by=%', 
      OLD.user_id, OLD.role::text, auth.uid();
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach trigger to user_roles table
DROP TRIGGER IF EXISTS audit_role_changes ON public.user_roles;
CREATE TRIGGER audit_role_changes
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.log_role_changes_detailed();

-- Phase 3: Create rate limiting table for submit-quote
CREATE TABLE IF NOT EXISTS public.quote_submission_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  email text NOT NULL,
  submission_count integer DEFAULT 1,
  first_submission_at timestamp with time zone DEFAULT now(),
  last_submission_at timestamp with time zone DEFAULT now(),
  UNIQUE(ip_address, email)
);

-- Enable RLS
ALTER TABLE public.quote_submission_rate_limit ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role only"
ON public.quote_submission_rate_limit
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create cleanup function for old rate limit records (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  DELETE FROM public.quote_submission_rate_limit
  WHERE last_submission_at < now() - interval '1 hour';
END;
$$;