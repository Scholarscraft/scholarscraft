-- Fix remaining security issues with quote_requests

-- Remove the problematic restrictive policy and replace with a cleaner one
DROP POLICY IF EXISTS "Restricted admin access to quote requests" ON public.quote_requests;

-- Create a simple, secure admin-only SELECT policy
CREATE POLICY "Admin only access to quote requests" 
ON public.quote_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS to the masked view
ALTER TABLE public.quote_requests_masked ENABLE ROW LEVEL SECURITY;

-- Create policy for masked view (also admin-only for now)
CREATE POLICY "Admin only access to masked quote requests" 
ON public.quote_requests_masked 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

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
  
  -- Log the access attempt
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

-- Update the mask_sensitive_data function to have proper search_path
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  IF input_text IS NULL OR length(input_text) < 3 THEN
    RETURN '***';
  END IF;
  
  -- Mask email
  IF input_text LIKE '%@%' THEN
    RETURN substring(input_text from 1 for 2) || '***@***' || substring(input_text from position('@' in input_text) + 3);
  END IF;
  
  -- Mask phone
  IF input_text ~ '^[+]?[0-9\s\-\(\)]+$' THEN
    RETURN '***-***-' || right(input_text, 4);
  END IF;
  
  -- Mask other text
  RETURN left(input_text, 2) || repeat('*', greatest(length(input_text) - 4, 1)) || right(input_text, 2);
END;
$$;