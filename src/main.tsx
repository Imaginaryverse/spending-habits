import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router/AppRouter.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import App from "./App.tsx";
import "./index.css";
import { DemoProvider } from "./features/demo/DemoProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DemoProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppRouter>
          <App />
        </AppRouter>
      </LocalizationProvider>
    </DemoProvider>
  </React.StrictMode>
);
