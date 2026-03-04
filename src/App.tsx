import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootLayout } from "./layouts/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { GitHubCallbackPage } from "./pages/GitHubCallbackPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RootLayout>
                  <Dashboard />
                </RootLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <RootLayout>
                  <SettingsPage />
                </RootLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/github/callback"
            element={
              <ProtectedRoute>
                <GitHubCallbackPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
