import type { SxProps, Theme } from "@mui/material";

/** Fills the area below the fixed topbar without exceeding the viewport. */
export const authViewportSx: SxProps<Theme> = {
  minHeight: (theme) => `calc(100dvh - ${theme.mixins.toolbar.minHeight}px)`,
  maxHeight: (theme) => `calc(100dvh - ${theme.mixins.toolbar.minHeight}px)`,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
};

export const authContentSx: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  minHeight: 0,
  py: { xs: 0.5, sm: 1.5 },
  px: { xs: 2, sm: 3 },
  overflowY: "auto",
  overflowX: "hidden",
};

/** Responsive vertical rhythm inside SignInPanel / EmailAuthForm. */
export const authStackSpacing = {
  section: { xs: 1, sm: 1.5 },
  divider: { xs: 1, sm: 1.5 },
  footer: { xs: 1, sm: 1.5 },
} as const;
