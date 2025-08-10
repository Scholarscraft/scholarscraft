-- Fix the security issues from the linter

-- Fix function search path issue
CREATE OR REPLACE FUNCTION public.get_deliverable_download_url(deliverable_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT file_url 
  FROM public.deliverables 
  WHERE id = deliverable_id 
  AND user_id = auth.uid();
$$;