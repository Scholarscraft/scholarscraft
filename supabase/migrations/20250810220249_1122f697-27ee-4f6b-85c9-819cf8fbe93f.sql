-- Assign admin role to the current user for testing
INSERT INTO public.user_roles (user_id, role) 
VALUES ('fc6be82a-ad75-47a5-8685-b8fd345d5bd9', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;