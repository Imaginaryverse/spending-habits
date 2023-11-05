import { Outlet } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import { SpendingEditorProvider } from "./features/spending-editor/SpendingEditorProvider";
import { Layout } from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "./features/snackbars/SnackbarProvider";

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
        <SnackbarProvider>
          <SpendingEditorProvider>
            <Layout>
              <Outlet />
            </Layout>
          </SpendingEditorProvider>
        </SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
