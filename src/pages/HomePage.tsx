import { Box, Typography, Container } from "@mui/material";
import { useAuthContext } from "@/shared/context/AuthContext";
import { useSupabaseConfig } from "@shared/hooks/useSupabaseConfig";

export const HomePage = () => {
  const { user } = useAuthContext();
  const { isConfigured: supabaseConfigured } = useSupabaseConfig();

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Vite MUI Supabase Starter
        </Typography>
        <Typography variant="h6" color="text.secondary" component="p" sx={{ mb: 2 }}>
          A modern boilerplate with React, TypeScript, Vite, Material-UI, and Supabase
        </Typography>
        {user ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              Welcome back, {user.email}!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            {supabaseConfigured && (
              <Typography variant="body1" color="text.secondary">
                Use the profile icon in the topbar to sign in.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};
