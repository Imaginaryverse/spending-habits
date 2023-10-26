import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { HistoryPage } from "@src/pages/history/HistoryPage";
import { NotFoundPage } from "@src/pages/not-found/NotFoundPage";
import { OverviewPage } from "@src/pages/overview/OverviewPage";
import { ProfilePage } from "@src/pages/profile/ProfilePage";
import { RegisterPage } from "@src/pages/register/RegisterPage";
import { SignInPage } from "@src/pages/sign-in/SignInPage";
import { PropsWithChildren } from "react";

export function AppRouter({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={children}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
