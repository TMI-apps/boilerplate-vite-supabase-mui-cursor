import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { useAuthContext } from "@/shared/context/AuthContext";
import { SignInPanel } from "@features/auth/components/SignInPanel";
import { useAuthCallbackHandler } from "@features/auth/hooks/useAuthCallbackHandler";
import { PageLoadingState } from "@/components/common/PageLoadingState";
import { authContentSx } from "@features/auth/components/authViewLayout";

export const HomePage = () => {
  const { user, loading, clearAuthError } = useAuthContext();
  const { isProcessing, error: callbackError } = useAuthCallbackHandler();
  const location = useLocation();
  const [locationAuthError, setLocationAuthError] = useState<string | null>(null);

  useEffect(() => {
    const stateError = (location.state as { authError?: string } | null)?.authError;
    if (stateError) {
      setLocationAuthError(stateError);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  if (loading || isProcessing) {
    return <PageLoadingState message="Signing in…" />;
  }

  const showInlineLogin = !user;

  return (
    <Box sx={{ ...authContentSx, textAlign: "center" }}>
      {(callbackError || locationAuthError) && (
        <Alert
          severity="error"
          sx={{ maxWidth: 420, width: "100%", mb: { xs: 1, sm: 1.5 }, textAlign: "left" }}
          action={
            <Button
              size="small"
              onClick={() => {
                clearAuthError();
                setLocationAuthError(null);
              }}
            >
              Dismiss
            </Button>
          }
        >
          {callbackError || locationAuthError}
        </Alert>
      )}

      {user ? (
        <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Typography variant="body1" component="p">
            Welcome back, {user.email}!
          </Typography>
        </Box>
      ) : showInlineLogin ? (
        <SignInPanel />
      ) : null}
    </Box>
  );
};
