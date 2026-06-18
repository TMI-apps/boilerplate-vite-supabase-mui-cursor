import { Outlet } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { authViewportSx } from "@features/auth/components/authViewLayout";

export const MainLayout = () => {
  return (
    <Box sx={authViewportSx}>
      <Container
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};
