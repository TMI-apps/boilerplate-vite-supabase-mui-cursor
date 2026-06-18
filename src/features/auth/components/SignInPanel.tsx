import { Alert, Box, Divider, Link, Typography } from "@mui/material";
import { Button } from "@/components/common/Button";
import { useAuthContext } from "@/shared/context/AuthContext";
import { useSupabaseConfig } from "@shared/hooks/useSupabaseConfig";
import { PRIVACY_URL, TERMS_URL } from "@config/legal";
import { GoogleIcon } from "./GoogleIcon";
import { EmailAuthForm } from "./EmailAuthForm";
import { authStackSpacing } from "./authViewLayout";

const SUPABASE_CONFIG_MESSAGE =
  "Authentication requires Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) in your environment.";

export const SignInPanel = () => {
  const { signInWithGoogle, loading, error } = useAuthContext();
  const { isConfigured: supabaseConfigured } = useSupabaseConfig();
  const authDisabled = !supabaseConfigured;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        flexShrink: 0,
      }}
    >
      {authDisabled && (
        <Alert
          severity="info"
          sx={{
            mb: authStackSpacing.section,
            py: { xs: 0.5, sm: 1 },
            "& .MuiAlert-message": { fontSize: { xs: "0.8rem", sm: "0.875rem" } },
          }}
        >
          {SUPABASE_CONFIG_MESSAGE}
        </Alert>
      )}

      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={() => void signInWithGoogle()}
        disabled={loading || authDisabled}
        sx={{ mb: authStackSpacing.section }}
      >
        Sign in with Google
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: authStackSpacing.section, py: { xs: 0.5, sm: 1 } }}>
          {error}
        </Alert>
      )}

      <Divider sx={{ my: authStackSpacing.divider }}>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
      </Divider>

      <EmailAuthForm authDisabled={authDisabled} />

      <Box sx={{ mt: authStackSpacing.footer, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary" component="span">
          <Link href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
            Privacy
          </Link>
          {" · "}
          <Link href={TERMS_URL} target="_blank" rel="noopener noreferrer">
            Terms
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
