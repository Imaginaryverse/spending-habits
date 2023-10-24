import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "hsl(200, 85%, 50%)",
    },
    secondary: {
      main: "hsl(40, 85%, 50%)",
    },
    background: {
      paper: "hsl(200, 85%, 6%)",
      default: "hsl(200, 85%, 2%)",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.875)",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
    },
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.17rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "0.83rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "0.67rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "3rem",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          marginBottom: "0.25rem",
          marginLeft: "0.25rem",
        },
      },
    },
  },
});

export default theme;
