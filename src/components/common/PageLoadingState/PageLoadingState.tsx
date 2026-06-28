import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface PageLoadingStateProps {
  message?: string;
}

/**
 * Fallback UI for React Suspense (e.g. lazy-loaded routes).
 * Shows a centered spinner while the lazy component loads.
 */
export const PageLoadingState = ({ message }: PageLoadingStateProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 200,
      py: 4,
      gap: 2,
    }}
  >
    <CircularProgress />
    {message && <Typography variant="body1">{message}</Typography>}
  </Box>
);
