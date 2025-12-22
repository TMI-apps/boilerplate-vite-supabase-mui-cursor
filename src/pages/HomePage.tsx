import { Link } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { useAuthContext } from "@store/contexts/AuthContext";

export const HomePage = () => {
  const { user } = useAuthContext();

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Vite MUI Supabase Starter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A modern boilerplate with React, TypeScript, Vite, Material-UI, and Supabase
        </Typography>
        {user ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" paragraph>
              Welcome back, {user.email}!
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/todos" sx={{ mr: 2 }}>
              Go to Todos
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" size="large" component={Link} to="/login" sx={{ mr: 2 }}>
              Login
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/signup">
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};
