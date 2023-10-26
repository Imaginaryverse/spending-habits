import { Outlet } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { SpendingEditorProvider } from "./features/spending-editor/SpendingEditorProvider";

function App() {
  return (
    <SpendingEditorProvider>
      <Layout>
        <Outlet />
      </Layout>
    </SpendingEditorProvider>
  );
}

export default App;
