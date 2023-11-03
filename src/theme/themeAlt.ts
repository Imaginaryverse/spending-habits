import { createTheme } from "@mui/material";

function createHsl(
  hue: number,
  saturation: number,
  lightness: number,
  alpha?: number
) {
  if (alpha === undefined) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  } else {
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }
}

const primaryHue = 180;
const baseSaturation = 60;
const baseLightness = 52;

const scrollbarStyles = {
  "*::-webkit-scrollbar": {
    width: "0.25rem",
    backgroundColor: createHsl(primaryHue, 0, baseLightness, 0.1),
  },
  "*::-webkit-scrollbar-thumb": {
    backgroundColor: createHsl(primaryHue, baseSaturation, baseLightness, 0.25),
    borderRadius: "0.25rem",
  },
  "*::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgb(60, 60, 60)",
  },

  scrollbarWidth: "thin",
  scrollbarColor: `${createHsl(
    primaryHue,
    baseSaturation,
    baseLightness,
    0.25
  )} #f0f0f0`,

  "@media (min-width: 600px)": {
    "*::-webkit-scrollbar": {
      width: "0.5rem",
    },
  },
};

const themeAlt = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // main: "hsl(200, 85%, 50%)",
      main: createHsl(primaryHue, baseSaturation, baseLightness),
    },
    secondary: {
      // main: "hsl(40, 85%, 50%)",
      main: createHsl(primaryHue - 160, baseSaturation, baseLightness),
    },
    background: {
      // default: "hsl(200, 85%, 5%)",
      // paper: "hsl(200, 85%, 6%)",
      default: createHsl(primaryHue, baseSaturation, baseLightness - 45),
      paper: createHsl(primaryHue, baseSaturation, baseLightness - 40),
    },
    text: {
      // primary: "rgba(255, 255, 255, 0.85)",
      // secondary: "rgba(255, 255, 255, 0.7)",
      primary: createHsl(0, 0, 100, 0.85),
      secondary: createHsl(0, 0, 100, 0.7),
    },
    error: {
      // main: "hsl(0, 75%, 50%)",
      main: createHsl(0, 75, 50),
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

export default themeAlt;
