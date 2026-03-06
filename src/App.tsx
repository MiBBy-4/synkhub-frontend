import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { NotificationsProvider } from "./components/NotificationsProvider";
import { ToastProvider } from "./components/ToastProvider";
import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootLayout } from "./layouts/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { GitHubCallbackPage } from "./pages/GitHubCallbackPage";
import { GoogleCalendarCallbackPage } from "./pages/GoogleCalendarCallbackPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <NotificationsProvider>
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
              <Route
                path="/google-calendar/callback"
                element={
                  <ProtectedRoute>
                    <GoogleCalendarCallbackPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </NotificationsProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
