import { Outlet } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { SpendingEditorProvider } from "./features/spending-editor/SpendingEditorProvider";

function App() {
  return (
    <Layout>
      <SpendingEditorProvider>
        <Outlet />
      </SpendingEditorProvider>
    </Layout>
  );
}

export default App;
