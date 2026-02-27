import { Box, CircularProgress } from "@mui/material";

/**
 * Fallback UI for React Suspense (e.g. lazy-loaded routes).
 * Shows a centered spinner while the lazy component loads.
 */
export const PageLoadingState = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 200,
      py: 4,
    }}
  >
    <CircularProgress />
  </Box>
);
