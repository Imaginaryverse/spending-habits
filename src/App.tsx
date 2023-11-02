import { Outlet } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SpendingEditorProvider } from "./features/spending-editor/SpendingEditorProvider";
import { Layout } from "./components/layout/Layout";
import theme from "./theme/theme";
import { RouterHistoryProvider } from "./features/router-history/RouterHistoryProvider";

function App() {
  return (
    <AuthProvider>
      <RouterHistoryProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SpendingEditorProvider>
            <Layout>
              <Outlet />
            </Layout>
          </SpendingEditorProvider>
        </ThemeProvider>
      </RouterHistoryProvider>
    </AuthProvider>
  );
}

export default App;
