import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getOAuthErrorMessage,
  handleCodeExchange,
} from "@features/auth/services/authCallbackService";
import { isPasswordRecoveryRedirect } from "@shared/utils/oauthUtils";
import { isSupabaseConfigured } from "@shared/services/supabaseService";

interface AuthCallbackState {
  isProcessing: boolean;
  error: string | null;
}

/**
 * Handles OAuth PKCE callbacks and recovery redirects on the app root.
 */
export const useAuthCallbackHandler = (): AuthCallbackState => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    if (isPasswordRecoveryRedirect()) {
      const hash = window.location.hash;
      void navigate(`/reset-password${hash}`, { replace: true });
      return;
    }

    const oauthError = searchParams.get("error");
    const code = searchParams.get("code");

    if (!oauthError && !code) {
      return;
    }

    const processCallback = async () => {
      setIsProcessing(true);

      if (oauthError) {
        setError(getOAuthErrorMessage(searchParams));
        setIsProcessing(false);
        return;
      }

      if (code) {
        await handleCodeExchange(code, navigate);
        setIsProcessing(false);
      }
    };

    void processCallback();
  }, [navigate, searchParams]);

  return { isProcessing, error };
};
