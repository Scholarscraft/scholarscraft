-- Ensure users can access their own deliverables
-- Update the deliverables policy to allow users to download their files

-- First, let's check if there's a way to download deliverables by creating a function
CREATE OR REPLACE FUNCTION public.get_deliverable_download_url(deliverable_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT file_url 
  FROM public.deliverables 
  WHERE id = deliverable_id 
  AND user_id = auth.uid();
$$;

-- Add policy for users to select their own deliverables (for downloading)
CREATE POLICY "Users can view their own deliverable files" 
ON public.deliverables 
FOR SELECT 
USING (auth.uid() = user_id);