import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { QueryProvider } from "@shared/context/QueryProvider";
import { AuthProvider } from "@shared/context/AuthContext";
import { Topbar } from "@/components/common/Topbar";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { PageLoadingState } from "@/components/common/PageLoadingState";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import { AuthCallbackPage } from "@pages/AuthCallbackPage";

const HomePage = lazy(() => import("@pages/HomePage").then((m) => ({ default: m.HomePage })));
const SetupPage = lazy(() => import("@pages/SetupPage").then((m) => ({ default: m.SetupPage })));

function AppContent() {
  const theme = useTheme();

  return (
    <>
      <Topbar />
      <Box
        sx={{
          pt: `${theme.mixins.toolbar.minHeight}px`,
        }}
      >
        <QueryErrorBoundary>
          <Suspense fallback={<PageLoadingState />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
              </Route>
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </QueryErrorBoundary>
      </Box>
    </>
  );
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
