import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI, LoginCredentials, RegisterCredentials, tokenManager } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
        } catch (err) {
          tokenManager.removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      await authAPI.login(credentials);
      const profile = await authAPI.getProfile();
      setUser(profile);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      toast({ title: "Login Failed", description: message, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      await authAPI.register(credentials);
      const profile = await authAPI.getProfile();
      setUser(profile);
      toast({
        title: "Account Created",
        description: "Your account has been created successfully.",
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      toast({ title: "Registration Failed", description: message, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    toast({ title: "Logged Out", description: "You've been successfully logged out." });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
