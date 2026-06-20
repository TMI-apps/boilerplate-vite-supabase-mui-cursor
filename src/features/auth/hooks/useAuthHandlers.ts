import { useRef, useCallback, useMemo } from "react";
import * as authService from "@/features/auth/services/authService";
import type { User, LoginCredentials, SignUpCredentials } from "@/features/auth/types/auth.types";
import {
  handleLogin as handleLoginUtil,
  handleSignUp as handleSignUpUtil,
  handleLogout as handleLogoutUtil,
  handleRequestPasswordReset as handleRequestPasswordResetUtil,
  handleUpdatePassword as handleUpdatePasswordUtil,
} from "@/features/auth/services/authHandlerUtils";

interface UseAuthHandlersOptions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthHandlers = ({ setUser, setLoading, setError }: UseAuthHandlersOptions) => {
  const signInInFlightRef = useRef(false);
  const stateRef = useRef({ setUser, setLoading, setError });
  stateRef.current = { setUser, setLoading, setError };

  const executeSignIn = useCallback(
    async (signInMethod: () => Promise<{ error: Error | null }>, errorMessage: string) => {
      if (signInInFlightRef.current) return;
      signInInFlightRef.current = true;
      const { setLoading: setLoadingState, setError: setErrorState } = stateRef.current;
      try {
        setLoadingState(true);
        setErrorState(null);
        const { error: signInError } = await signInMethod();
        if (signInError) setErrorState(signInError.message);
      } catch (err) {
        setErrorState(err instanceof Error ? err.message : errorMessage);
      } finally {
        setLoadingState(false);
        signInInFlightRef.current = false;
      }
    },
    []
  );

  const login = useCallback(
    (credentials: LoginCredentials) => handleLoginUtil(credentials, stateRef.current),
    []
  );
  const signUp = useCallback(
    (credentials: SignUpCredentials) => handleSignUpUtil(credentials, stateRef.current),
    []
  );
  const logout = useCallback(() => handleLogoutUtil(stateRef.current), []);
  const requestPasswordReset = useCallback(
    (email: string) => handleRequestPasswordResetUtil(email, stateRef.current),
    []
  );
  const updatePassword = useCallback(
    (password: string) => handleUpdatePasswordUtil(password, stateRef.current),
    []
  );
  const signInWithGoogle = useCallback(
    () => executeSignIn(authService.signInWithGoogle, "Failed to sign in with Google"),
    [executeSignIn]
  );

  const clearAuthError = useCallback(() => {
    stateRef.current.setError(null);
  }, []);

  return useMemo(
    () => ({
      login,
      signUp,
      logout,
      signInWithGoogle,
      requestPasswordReset,
      updatePassword,
      clearAuthError,
    }),
    [login, signUp, logout, signInWithGoogle, requestPasswordReset, updatePassword, clearAuthError]
  );
};
