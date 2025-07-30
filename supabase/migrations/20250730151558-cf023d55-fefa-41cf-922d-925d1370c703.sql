-- Create quote_requests table
CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  service TEXT NOT NULL,
  deadline DATE NOT NULL,
  pages INTEGER NOT NULL,
  academic_level TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quote requests (public form)
CREATE POLICY "Anyone can create quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view quote requests (admin access)
CREATE POLICY "Authenticated users can view quote requests" ON public.quote_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create storage bucket for uploaded files
INSERT INTO storage.buckets (id, name, public) VALUES ('quote-files', 'quote-files', false);

-- Allow anyone to upload files to quote-files bucket
CREATE POLICY "Anyone can upload quote files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'quote-files');

-- Allow authenticated users to view uploaded files
CREATE POLICY "Authenticated users can view quote files" ON storage.objects
  FOR SELECT USING (bucket_id = 'quote-files' AND auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();