import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  checkSupabaseConfigured,
  getOAuthErrorMessage,
  handleCodeExchange,
  getRedirectPath,
} from "@features/auth/services/authCallbackService";
import { getAuthCallbackParams } from "@/shared/utils/authCallbackParams";

/**
 * Legacy OAuth callback route. Primary PKCE callback handling lives on `/`.
 */
export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!checkSupabaseConfigured(navigate)) return;

      const { error, code } = getAuthCallbackParams(searchParams);

      if (error) {
        void navigate("/", {
          replace: true,
          state: { authError: getOAuthErrorMessage(searchParams) },
        });
        return;
      }

      if (code) {
        await handleCodeExchange(code, navigate);
        return;
      }

      void navigate(getRedirectPath(), { replace: true });
    };

    void handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1">Signing in…</Typography>
    </Box>
  );
};
