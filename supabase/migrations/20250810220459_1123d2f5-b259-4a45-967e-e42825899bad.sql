-- Fix the log_role_changes function to handle NULL values properly
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log role changes with proper NULL handling
  RAISE LOG 'Role change: user_id=%, old_role=%, new_role=%, changed_by=%', 
    COALESCE(OLD.user_id, NEW.user_id),
    COALESCE(OLD.role::text, 'none'),
    COALESCE(NEW.role::text, 'none'),
    auth.uid();
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Now assign admin role to the current user for testing
INSERT INTO public.user_roles (user_id, role) 
VALUES ('fc6be82a-ad75-47a5-8685-b8fd345d5bd9', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;