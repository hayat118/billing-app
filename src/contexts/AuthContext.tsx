'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('billingAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string) => {
    // Get stored users from localStorage
    const storedUsers = localStorage.getItem('billingAppUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Find user with matching email and password
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userData = {
        name: user.name,
        email: user.email
      };
      localStorage.setItem('billingAppUser', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      router.push('/dashboard');
      return true;
    } else {
      return false;
    }
  };

  const register = (name: string, email: string, password: string) => {
    // Get stored users from localStorage
    const storedUsers = localStorage.getItem('billingAppUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if email already exists
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false; // Email already exists
    }
    
    // Add new user
    const newUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      password: password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('billingAppUsers', JSON.stringify(users));
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('billingAppUser');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
