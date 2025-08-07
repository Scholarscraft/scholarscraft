-- Add foreign key relationship between support_tickets and profiles
ALTER TABLE public.support_tickets 
ADD CONSTRAINT fk_support_tickets_user_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add index for better performance on joins
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);