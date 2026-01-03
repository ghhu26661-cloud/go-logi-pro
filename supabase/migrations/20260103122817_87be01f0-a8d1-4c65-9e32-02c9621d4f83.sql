-- Insert demo users (they need to be created via signup first, then this updates their roles)
-- This function will be called manually or can update existing users

-- Create a helper function to set user role (for admins to use)
CREATE OR REPLACE FUNCTION public.set_user_role(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete existing role
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  
  -- Insert new role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role);
  
  -- Also update the profiles table if needed
  UPDATE public.profiles 
  SET role = _role::text
  WHERE id = _user_id;
END;
$$;

-- Grant execute to authenticated users (admin will check permissions in app)
GRANT EXECUTE ON FUNCTION public.set_user_role TO authenticated;