import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  checkSupabaseConfigured,
  getOAuthErrorMessage,
  handleCodeExchange,
  getRedirectPath,
} from "@/features/auth/services/authCallbackService";
import { getAuthCallbackParams } from "@/shared/utils/authCallbackParams";
import { useAuthContext } from "@/shared/context/AuthContext";
import { PageLoadingState } from "@/components/common/PageLoadingState";

/**
 * Legacy OAuth callback route. Primary PKCE callback handling lives on `/`.
 */
export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthError } = useAuthContext();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!checkSupabaseConfigured(navigate)) return;

      const { error, code } = getAuthCallbackParams(searchParams);

      if (error) {
        setAuthError(getOAuthErrorMessage(searchParams));
        void navigate("/", { replace: true });
        return;
      }

      if (code) {
        const exchangeError = await handleCodeExchange(code, navigate);
        if (exchangeError) {
          setAuthError(exchangeError);
        }
        return;
      }

      void navigate(getRedirectPath(), { replace: true });
    };

    void handleAuthCallback();
  }, [searchParams, navigate, setAuthError]);

  return <PageLoadingState message="Completing sign-in…" />;
};
