-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  service TEXT NOT NULL,
  academic_level TEXT NOT NULL,
  pages INTEGER NOT NULL,
  deadline DATE NOT NULL,
  price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending',
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique order IDs
CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  done BOOL;
BEGIN
  done := FALSE;
  WHILE NOT done LOOP
    new_id := 'SCH-' || LPAD(floor(random() * 999999)::TEXT, 6, '0');
    done := NOT EXISTS(SELECT 1 FROM public.orders WHERE order_id = new_id);
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order IDs
CREATE OR REPLACE FUNCTION public.set_order_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
    NEW.order_id := public.generate_order_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_id_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_order_id();