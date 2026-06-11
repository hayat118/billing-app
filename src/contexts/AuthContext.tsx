'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';
import { signIn, signUp, logOut, onAuthChange, getUserData } from '@/src/services/authService';
import { AppUser } from '@/src/types/database';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        
        try {
          // Retrieve current ID token and set __session cookie for Middleware protection
          const token = await firebaseUser.getIdToken();
          document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
        } catch (error) {
          console.error("Error setting session cookie:", error);
        }

        // Get user data from Firestore
        const userData = await getUserData(firebaseUser.uid);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
        setIsAuthenticated(false);
        // Clear __session cookie on sign-out
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.success && result.user) {
      try {
        const token = await result.user.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
      } catch (error) {
        console.error("Error setting token during login:", error);
      }
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await signUp(email, password, name);
    if (result.success) {
      router.push('/login?registered=true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    await logOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, firebaseUser, login, register, logout, loading }}>
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
