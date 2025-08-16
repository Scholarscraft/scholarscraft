-- Fix remaining security issues with quote_requests

-- Drop existing policies and recreate them properly
DROP POLICY IF EXISTS "Admin only access to quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Restricted admin access to quote requests" ON public.quote_requests;

-- Create a simple, secure admin-only SELECT policy
CREATE POLICY "Admin only access to quote requests" 
ON public.quote_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop the view since we can't add RLS to it - we'll use the table directly with proper policies
DROP VIEW IF EXISTS public.quote_requests_masked;

-- Update function to have proper search_path (fix linter warning)
CREATE OR REPLACE FUNCTION public.get_quote_requests_with_audit()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  service TEXT,
  academic_level TEXT,
  pages INTEGER,
  deadline DATE,
  message TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check if user is admin
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Log the access attempt with proper error handling
  BEGIN
    INSERT INTO public.quote_request_audit (
      quote_request_id, 
      accessed_by, 
      access_type
    ) 
    VALUES (
      '00000000-0000-0000-0000-000000000000'::UUID, -- General access log
      auth.uid(), 
      'BULK_SELECT'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the function
    RAISE WARNING 'Failed to log audit entry: %', SQLERRM;
  END;
  
  -- Return the data
  RETURN QUERY
  SELECT 
    qr.id,
    qr.name,
    qr.email,
    qr.phone,
    qr.subject,
    qr.service,
    qr.academic_level,
    qr.pages,
    qr.deadline,
    qr.message,
    qr.status,
    qr.created_at,
    qr.updated_at
  FROM public.quote_requests qr
  ORDER BY qr.created_at DESC;
END;
$$;