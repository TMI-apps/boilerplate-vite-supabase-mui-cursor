import { useState, useEffect, useCallback, useMemo } from "react";
import { isSupabaseConfigured } from "@/shared/services/supabaseService";
import type { AuthContextValue, User } from "@/features/auth/types/auth.types";
import { initializeSession } from "./useAuthSession";
import { useAuthStateSubscription } from "./useAuthStateSubscription";
import { useAuthHandlers } from "./useAuthHandlers";

export const useAuth = (): AuthContextValue => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleUserChange = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const handleLoadingChange = useCallback((newLoading: boolean) => {
    setLoading(newLoading);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      const { user: initialUser, error: initError } = await initializeSession();
      if (initError) {
        setError(initError);
      } else {
        setUser(initialUser);
      }
      setLoading(false);
    };

    void initAuth();
  }, []);

  useAuthStateSubscription({
    onUserChange: handleUserChange,
    onLoadingChange: handleLoadingChange,
  });

  const handlers = useAuthHandlers({
    setUser,
    setLoading,
    setError,
  });

  const setAuthError = useCallback((message: string | null) => {
    setError(message);
  }, []);

  return useMemo(
    () => ({
      user,
      loading,
      error,
      ...handlers,
      setAuthError,
    }),
    [user, loading, error, handlers, setAuthError]
  );
};
