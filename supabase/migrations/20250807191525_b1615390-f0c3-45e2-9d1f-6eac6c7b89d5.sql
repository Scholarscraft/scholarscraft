-- Create sample_papers table
CREATE TABLE public.sample_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  academic_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  pages INTEGER,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  preview_available BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.sample_papers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Sample papers are viewable by everyone" 
ON public.sample_papers 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage sample papers" 
ON public.sample_papers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for sample papers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sample-papers', 'sample-papers', true);

-- Create storage policies
CREATE POLICY "Sample papers are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'sample-papers');

CREATE POLICY "Admins can upload sample papers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'sample-papers' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sample papers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'sample-papers' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sample papers" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'sample-papers' AND has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sample_papers_updated_at
BEFORE UPDATE ON public.sample_papers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_sample_papers_category ON public.sample_papers(category);
CREATE INDEX idx_sample_papers_academic_level ON public.sample_papers(academic_level);
CREATE INDEX idx_sample_papers_subject ON public.sample_papers(subject);
CREATE INDEX idx_sample_papers_featured ON public.sample_papers(is_featured);
CREATE INDEX idx_sample_papers_created_at ON public.sample_papers(created_at);