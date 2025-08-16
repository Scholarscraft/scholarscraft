-- Enhanced security for quote_requests table
-- Add audit logging and additional constraints

-- Create an audit log table for quote request access
CREATE TABLE IF NOT EXISTS public.quote_request_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID NOT NULL,
  accessed_by UUID NOT NULL,
  access_type TEXT NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  ip_address INET
);

-- Enable RLS on audit table
ALTER TABLE public.quote_request_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.quote_request_audit 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a secure function to access quote requests with audit logging
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
SET search_path = public
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

-- Add additional security policies to quote_requests
-- Replace existing SELECT policy with more restrictive one
DROP POLICY IF EXISTS "Admins can view all quote requests with personal info" ON public.quote_requests;

-- Create a more restrictive policy that requires specific access patterns
CREATE POLICY "Restricted admin access to quote requests" 
ON public.quote_requests 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND auth.uid() IS NOT NULL
  AND current_setting('request.method', true) != 'GET' OR current_setting('request.method', true) IS NULL
);

-- Add data masking for sensitive fields in case of unauthorized access
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
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

-- Create a view with masked data for additional security layer
CREATE OR REPLACE VIEW public.quote_requests_masked AS
SELECT 
  id,
  mask_sensitive_data(name) as name,
  mask_sensitive_data(email) as email,
  mask_sensitive_data(phone) as phone,
  subject,
  service,
  academic_level,
  pages,
  deadline,
  left(message, 50) || CASE WHEN length(message) > 50 THEN '...' ELSE '' END as message,
  status,
  created_at,
  updated_at
FROM public.quote_requests;