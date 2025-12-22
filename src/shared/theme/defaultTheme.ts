import { createTheme, ThemeOptions } from "@mui/material/styles";

export const defaultThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#CF13B3",
    },
    secondary: {
      main: "#E6196B",
    },
    background: {
      default: "#070614",
      paper: "#1C1B29",
    },
    text: {
      primary: "#ffffff",
      secondary: "#F5F5F7",
    },
  },
  typography: {
    fontFamily: "Montserrat",
    h6: {
      fontWeight: 1000,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          height: 48,
          padding: "8px 24px",
        },
        contained: {
          background:
            "linear-gradient(45deg, #8D0BD1 0%, #CF13B3 30%, #8D0BD1 60%, #CF13B3 90%, #8D0BD1 100%)",
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 50%",
          border: 0,
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.4)",
          color: "white",
          transition: "background-position 0.6s ease",
          "&:hover": {
            backgroundPosition: "100% 50%",
          },
          "&:active": {
            boxShadow: "0 2px 4px 1px rgba(0, 0, 0, 0.5)",
          },
        },
        text: {
          color: "#ffffff",
          "&.MuiButton-colorPrimary": {
            color: "#CF13B3",
            "&:hover": {
              backgroundColor: "rgba(207, 19, 179, 0.1)",
            },
          },
          "&.MuiButton-colorSecondary": {
            color: "#E6196B",
            "&:hover": {
              backgroundColor: "rgba(230, 25, 107, 0.1)",
            },
          },
        },
        outlined: {
          borderColor: "#ffffff",
          color: "#ffffff",
          "&.MuiButton-colorPrimary": {
            borderColor: "#CF13B3",
            color: "#CF13B3",
            "&:hover": {
              borderColor: "#CF13B3",
              backgroundColor: "rgba(207, 19, 179, 0.1)",
            },
          },
          "&.MuiButton-colorSecondary": {
            borderColor: "#E6196B",
            color: "#E6196B",
            "&:hover": {
              borderColor: "#E6196B",
              backgroundColor: "rgba(230, 25, 107, 0.1)",
            },
          },
        },
      },
    },
  },
};

export const defaultTheme = createTheme(defaultThemeOptions);
