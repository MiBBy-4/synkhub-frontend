import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as authApi from "../api/auth";
import type { User } from "../types/api";
import type { LoginCredentials, SignupCredentials } from "../types/auth";
import {
  getStoredToken,
  removeStoredToken,
  setStoredToken,
} from "../utils/storage";
import { AuthContext } from "../hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(() => getStoredToken() !== null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    authApi
      .getMe()
      .then((userData) => {
        if (!cancelled) {
          setUser(userData);
        }
      })
      .catch(() => {
        if (!cancelled) {
          removeStoredToken();
          setToken(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authenticatedUser = await authApi.login(credentials);
    setStoredToken(authenticatedUser.token);
    setToken(authenticatedUser.token);
    setUser({ id: authenticatedUser.id, email: authenticatedUser.email });
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    const authenticatedUser = await authApi.signup(credentials);
    setStoredToken(authenticatedUser.token);
    setToken(authenticatedUser.token);
    setUser({ id: authenticatedUser.id, email: authenticatedUser.email });
  }, []);

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext>
  );
}
