import { useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

const STORAGE_KEY = 'link_manager_user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored) as User;
        setUser(userData);
        api.setUserId(userData.id);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string): Promise<User> => {
    const userData = await api.login(email);
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (email: string): Promise<User> => {
    const userData = await api.register(email);
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    api.setUserId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateUserLinks = useCallback((links: User['links']) => {
    if (user) {
      const updatedUser = { ...user, links };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserLinks,
  };
}
