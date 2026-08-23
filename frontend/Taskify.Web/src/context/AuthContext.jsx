import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    authService.getStoredUser()
  );

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuthentication = async () => {
      const token = authService.getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await authService.getCurrentUser();

        if (response.success && response.data) {
          const storedUser =
            authService.getStoredUser();

          if (storedUser) {
            const updatedUser = {
              ...storedUser,
              id: Number(response.data.userId),
              email: response.data.email,
              role: response.data.role,
            };

            localStorage.setItem(
              'taskify_user',
              JSON.stringify(updatedUser)
            );

            setUser(updatedUser);
          }
        }
      } catch {
        authService.clearAuthentication();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuthentication();
  }, []);

  const login = async (credentials) => {
    const response =
      await authService.login(credentials);

    if (response.success && response.data) {
      setUser(response.data.user);
    }

    return response;
  };

  const register = async (registerData) => {
    const response =
      await authService.register(registerData);

    if (response.success && response.data) {
      localStorage.setItem(
        'taskify_token',
        response.data.token
      );

      localStorage.setItem(
        'taskify_user',
        JSON.stringify(response.data.user)
      );

      setUser(response.data.user);
    }

    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'Admin',
    isUser: user?.role === 'User',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider'
    );
  }

  return context;
}