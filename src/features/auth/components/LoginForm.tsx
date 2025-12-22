import { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { Button } from "@common/Button";
import { Input } from "@common/Input";
import { useAuthContext } from "@store/contexts/AuthContext";
import type { LoginCredentials } from "../types/auth.types";

export const LoginForm = () => {
  const { login, loading, error } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: LoginCredentials = { email, password };
    await login(credentials);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
        fullWidth
        margin="normal"
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
        fullWidth
        margin="normal"
        autoComplete="current-password"
      />
      <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Box>
  );
};
