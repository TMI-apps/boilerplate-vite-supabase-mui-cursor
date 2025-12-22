import { Navigate } from "react-router-dom";
import { useAuthContext } from "@store/contexts/AuthContext";
import { isSupabaseConfigured } from "@shared/services/supabaseService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();
  const supabaseConfigured = isSupabaseConfigured();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If Supabase is not configured, allow access without authentication
  if (!supabaseConfigured) {
    return <>{children}</>;
  }

  // If Supabase is configured, require authentication
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
