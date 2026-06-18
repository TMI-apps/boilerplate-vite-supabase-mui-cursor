import { useEffect, useState } from "react";
import { Alert, Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PageLoadingState } from "@/components/common/PageLoadingState";
import { useAuthContext } from "@/shared/context/AuthContext";
import { getSupabase, isSupabaseConfigured } from "@shared/services/supabaseService";
import { validatePasswordConfirmation } from "@features/auth/services/authValidation";

export const ResetPasswordPage = () => {
  const { updatePassword, loading, error, clearAuthError } = useAuthContext();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setCheckingRecovery(false);
      return;
    }

    const supabase = getSupabase();
    const hashParams = new URLSearchParams(
      window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash
    );
    const isRecoveryHash = hashParams.get("type") === "recovery";

    if (isRecoveryHash) {
      setRecoveryReady(true);
      setCheckingRecovery(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryReady(true);
        setCheckingRecovery(false);
      }
    });

    const timeoutId = window.setTimeout(() => {
      setCheckingRecovery(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);
    clearAuthError();

    const passwordError = validatePasswordConfirmation(password, confirmPassword);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    const updated = await updatePassword(password);
    if (updated) {
      setSuccessMessage("Your password has been updated. You can now sign in.");
      window.setTimeout(() => {
        void navigate("/login", { replace: true });
      }, 2000);
    }
  };

  if (checkingRecovery) {
    return <PageLoadingState message="Loading…" />;
  }

  if (!isSupabaseConfigured()) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8 }}>
          <Alert severity="info">
            Authentication requires Supabase configuration before you can reset your password.
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!recoveryReady) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8 }}>
          <Alert severity="warning">
            This password reset link is invalid or has expired. Request a new link from the sign-in
            page.
          </Alert>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => void navigate("/login")}>
            Go to sign in
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, maxWidth: 420, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reset password
        </Typography>

        {(validationError || error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError || error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            required
            fullWidth
            margin="normal"
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(event.target.value)
            }
            required
            fullWidth
            margin="normal"
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Please wait…" : "Update password"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
