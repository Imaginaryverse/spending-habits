import { createTheme } from "@mui/material";

const scrollbarStyles = {
  "*::-webkit-scrollbar": {
    width: "0.4rem",
  },
  "*::-webkit-scrollbar-thumb": {
    backgroundColor: "hsl(200, 85%, 50%, 0.25)",
    borderRadius: "0.4rem",
  },
  "*::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgb(60, 60, 60)",
  },

  scrollbarWidth: "thin",
  scrollbarColor: "hsl(200, 85%, 50%, 0.25) #f0f0f0",
};

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
      default: "hsl(200, 85%, 5%)",
      paper: "hsl(200, 85%, 6%)",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.85)",
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
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.17rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "0.83rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "0.67rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: scrollbarStyles,
        html: scrollbarStyles,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "2.5rem",
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
