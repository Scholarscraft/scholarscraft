import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = 'admin' | 'moderator' | 'user' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('role', { ascending: true }) // admin comes first in enum order
          .limit(1)
          .single();

        if (error) {
          console.log('No role found for user, defaulting to null');
          setRole(null);
        } else {
          setRole(data.role as UserRole);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!role || !requiredRole) return false;
    
    const roleHierarchy = { admin: 3, moderator: 2, user: 1 };
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = (): boolean => role === 'admin';
  const isModerator = (): boolean => role === 'moderator' || role === 'admin';

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isModerator,
  };
};