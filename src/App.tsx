import { Outlet } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SpendingEditorProvider } from "./features/spending-editor/SpendingEditorProvider";
import { Layout } from "./components/layout/Layout";
// import theme from "./theme/theme";
import themeAlt from "./theme/themeAlt";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={themeAlt}>
          <CssBaseline />
          <SpendingEditorProvider>
            <Layout>
              <Outlet />
            </Layout>
          </SpendingEditorProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
