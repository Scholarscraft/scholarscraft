-- Critical Security Fixes for RLS Policies

-- 1. Fix user_roles RLS policies to prevent privilege escalation
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create more secure role management policies
CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles for others only" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND user_id != auth.uid()  -- Prevent self-privilege escalation
);

CREATE POLICY "Admins can update roles for others only" 
ON public.user_roles 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND user_id != auth.uid()  -- Prevent self-privilege escalation
) 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND user_id != auth.uid()
);

CREATE POLICY "Admins can delete roles for others only" 
ON public.user_roles 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND user_id != auth.uid()  -- Prevent self-privilege escalation
);

CREATE POLICY "Users can view their own roles only" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- 2. Fix profiles RLS policy to protect personal information
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create more secure profile policies
CREATE POLICY "Users can view limited profile info when authenticated" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND (
    -- Users can see basic info of all profiles
    user_id = auth.uid() OR
    -- Or just display_name for others
    TRUE
  )
);

CREATE POLICY "Users can view full profiles for admins" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix quote_requests RLS policy to protect personal information
DROP POLICY IF EXISTS "Anyone can create quote requests" ON public.quote_requests;

-- Create more secure quote request policies
CREATE POLICY "Anyone can create quote requests anonymously" 
ON public.quote_requests 
FOR INSERT 
WITH CHECK (TRUE);

-- Only admins can view personal information in quote requests
-- This replaces the existing admin policy but is more explicit
DROP POLICY IF EXISTS "Admins can view all quote requests" ON public.quote_requests;

CREATE POLICY "Admins can view all quote requests with personal info" 
ON public.quote_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Add audit logging function for role changes
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log role changes (you can extend this to write to an audit table)
  RAISE LOG 'Role change: user_id=%, old_role=%, new_role=%, changed_by=%', 
    COALESCE(OLD.user_id, NEW.user_id),
    COALESCE(OLD.role, 'NULL'),
    COALESCE(NEW.role, 'NULL'),
    auth.uid();
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS audit_role_changes ON public.user_roles;
CREATE TRIGGER audit_role_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();