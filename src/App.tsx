import { Outlet } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import { SpendingEditorProvider } from "./features/spending-editor/SpendingEditorProvider";
import { Layout } from "./components/layout/Layout";
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
        <SpendingEditorProvider>
          <Layout>
            <Outlet />
          </Layout>
        </SpendingEditorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
