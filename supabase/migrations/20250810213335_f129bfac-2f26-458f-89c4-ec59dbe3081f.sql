-- Update deliverables table to include 'completed' status properly
-- Add a constraint to ensure valid status values
ALTER TABLE public.deliverables 
DROP CONSTRAINT IF EXISTS deliverables_status_check;

ALTER TABLE public.deliverables 
ADD CONSTRAINT deliverables_status_check 
CHECK (status IN ('pending', 'downloaded', 'completed'));

-- Update the 'completed' stat in dashboard to show delivered and completed together
UPDATE public.deliverables 
SET status = 'completed' 
WHERE status = 'delivered';