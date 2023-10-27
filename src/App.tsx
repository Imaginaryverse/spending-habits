import { Outlet } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SpendingEditorProvider } from "./features/spending-editor/SpendingEditorProvider";
import { SpendingsProvider } from "./features/spendings/SpendingsProvider";
import { Layout } from "./components/layout/Layout";
import theme from "./theme/theme";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SpendingsProvider>
          <SpendingEditorProvider>
            <Layout>
              <Outlet />
            </Layout>
          </SpendingEditorProvider>
        </SpendingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
