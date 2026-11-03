import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginAccount, logoutAccount, registerAccount } from '@/services/api/authApi';
import { clearCachedResponses } from '@/services/http/responseCache';
import { toApiError } from '@/services/http/apiError';
import { deleteToken, getStoredToken, saveToken } from '@/services/auth/tokenStorage';
import type { UserDto } from '@/types/api';

interface AuthContextValue {
  user: UserDto | null;
  isRestoring: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const token = await getStoredToken();
        if (!token) return;
        const currentUser = await fetchCurrentUser();
        if (active) setUser(currentUser);
      } catch (error) {
        if (toApiError(error).status === 401) await deleteToken();
      } finally {
        if (active) setIsRestoring(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAccount({ email, password });
    await saveToken(result.token);
    setUser(result.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerAccount({ name, email, password });
    await saveToken(result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    // The local session is cleared even when the logout request cannot reach the server.
    await logoutAccount().catch(() => undefined);
    await deleteToken();
    await clearCachedResponses();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isRestoring, login, register, logout }),
    [user, isRestoring, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  return context;
}
