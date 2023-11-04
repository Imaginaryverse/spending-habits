import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router/AppRouter.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import App from "./App.tsx";
import { DemoProvider } from "./features/demo/DemoProvider.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import themeAlt from "./theme/themeAlt.ts";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={themeAlt}>
      <CssBaseline />
      <DemoProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppRouter>
            <App />
          </AppRouter>
        </LocalizationProvider>
      </DemoProvider>
    </ThemeProvider>
  </React.StrictMode>
);
