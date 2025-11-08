import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../lib/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('access_token');
  });

  // Save access token to localStorage and state
  const saveAccessToken = useCallback((access) => {
    if (access) {
      localStorage.setItem('access_token', access);
      setAccessToken(access);
    }
  }, []);

  // Clear tokens from localStorage and state
  const clearTokens = useCallback(() => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
    setUser(null);
  }, []);

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      const userData = await api.me();
      setUser(userData);
      return userData;
    } catch (error) {
      // Only log non-401 errors (401 means not authenticated, which is normal)
      if (error?.status !== 401) {
        console.error('Failed to fetch user:', error);
      }
      // If token is invalid, clear tokens
      if (error?.status === 401) {
        clearTokens();
      }
      setUser(null);
      return null;
    }
  }, [clearTokens]);

  // Refresh access token using cookie-based refresh
  const refreshAccessToken = useCallback(async () => {
    try {
      // Try to refresh using the backend's cookie-based refresh endpoint
      // The refresh token should be stored in an HttpOnly cookie by the backend
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Important: send cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Save new access token if provided
      if (data.access_token) {
        saveAccessToken(data.access_token);
      }
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      return false;
    }
  }, [clearTokens, saveAccessToken]);

  // Login function
  const login = useCallback(async (email, password, remember = false) => {
    try {
      const response = await api.login({ email, password, remember });
      
      // Handle token-based response
      if (response.access_token) {
        saveAccessToken(response.access_token);
        // Note: refresh_token should be set by backend as HttpOnly cookie
      }
      
      // Always fetch user data after login
      await fetchUser();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error?.body?.detail || error?.message || 'Login failed' 
      };
    }
  }, [saveAccessToken, fetchUser]);

  // Signup function
  const signup = useCallback(async (email, password, username) => {
    try {
      const payload = username 
        ? { email, password, username }
        : { email, password };
      
      const response = await api.signup(payload);
      
      // Handle token-based response
      if (response.access_token) {
        saveAccessToken(response.access_token);
        await fetchUser();
      } else {
        // If no tokens in signup response, try logging in
        await login(email, password);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error?.body?.detail || error?.message || 'Signup failed' 
      };
    }
  }, [saveAccessToken, fetchUser, login]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  }, [clearTokens]);

  // Initialize auth state on mount
  // CRITICAL: Always attempt to fetch user, regardless of local token
  // This ensures cookie-based sessions work correctly on page reload
  useEffect(() => {
    const initAuth = async () => {
      // Always try to fetch user - supports both token and cookie auth
      await fetchUser();
      setLoading(false);
    };

    initAuth();
  }, [fetchUser]);

  // Auto-refresh token before expiration (every 14 minutes if token expires in 15)
  // Only runs if we have an access token (for token-based auth)
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [accessToken, refreshAccessToken]);

  const value = {
    user,
    loading,
    accessToken,
    login,
    signup,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
