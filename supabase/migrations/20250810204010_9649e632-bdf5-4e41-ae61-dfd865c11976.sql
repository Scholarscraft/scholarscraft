-- Create deliverables table for completed papers
CREATE TABLE public.deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(order_id),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID NOT NULL,
  delivery_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- Create policies for deliverables
CREATE POLICY "Users can view their own deliverables" 
ON public.deliverables 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all deliverables" 
ON public.deliverables 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_deliverables_updated_at
BEFORE UPDATE ON public.deliverables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for deliverables
INSERT INTO storage.buckets (id, name, public) VALUES ('deliverables', 'deliverables', false);

-- Create storage policies for deliverables bucket
CREATE POLICY "Users can view their own deliverables" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'deliverables' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can upload deliverables" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'deliverables' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update deliverables" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'deliverables' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete deliverables" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'deliverables' AND has_role(auth.uid(), 'admin'::app_role));