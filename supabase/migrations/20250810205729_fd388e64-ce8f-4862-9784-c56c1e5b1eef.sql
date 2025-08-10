-- Enable real-time for deliverables table
ALTER TABLE public.deliverables REPLICA IDENTITY FULL;

-- Add deliverables table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliverables;