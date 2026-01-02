import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuthContext } from "@store/contexts/AuthContext";
import { ProfileMenu } from "@components/ProfileMenu";

/**
 * Topbar component that is always visible.
 * This component is designed to be reusable across all apps.
 */
export const Topbar = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              color: location.pathname === "/" ? "primary.main" : "inherit",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            Vite MUI Supabase Starter
          </Box>
        </Typography>

        {/* Navigation buttons */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {user && (
            <Button
              color={location.pathname === "/todos" ? "primary" : "inherit"}
              component={Link}
              to="/todos"
            >
              Todos
            </Button>
          )}
          <Button
            color={location.pathname === "/setup" ? "primary" : "inherit"}
            component={Link}
            to="/setup"
          >
            Setup
          </Button>
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
