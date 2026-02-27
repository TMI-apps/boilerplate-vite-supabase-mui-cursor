import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { ProfileMenu } from "@/components/common/ProfileMenu";
import { usePrefetch } from "@shared/hooks/usePrefetch";

/**
 * Topbar component that is always visible.
 * This component is designed to be reusable across all apps.
 */
export const Topbar = () => {
  const location = useLocation();
  const { prefetchSetup } = usePrefetch();

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
          <Button component={Link} to="/setup" onMouseEnter={prefetchSetup}>
            Setup
          </Button>
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
