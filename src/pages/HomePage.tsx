import { Alert, Box, Typography } from "@mui/material";
import { Button } from "@/components/common/Button";
import { useAuthContext } from "@/shared/context/AuthContext";
import { SignInPanel } from "@/features/auth/components/SignInPanel";
import { useAuthCallbackHandler } from "@/features/auth/hooks/useAuthCallbackHandler";
import { PageLoadingState } from "@/components/common/PageLoadingState";
import { authContentSx, authContentMaxWidth } from "@/features/auth/components/authViewLayout";

export const HomePage = () => {
  const { user, loading, error, clearAuthError } = useAuthContext();
  const { isProcessing } = useAuthCallbackHandler();

  if (loading || isProcessing) {
    return <PageLoadingState message="Signing in…" />;
  }

  const showInlineLogin = !user;

  return (
    <Box sx={{ ...authContentSx, textAlign: "center" }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            maxWidth: authContentMaxWidth,
            width: "100%",
            mb: { xs: 1, sm: 1.5 },
            textAlign: "left",
          }}
          action={
            <Button size="small" onClick={clearAuthError}>
              Dismiss
            </Button>
          }
        >
          {error}
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
