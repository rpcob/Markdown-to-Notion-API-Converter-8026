import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabaseService } from '../services/supabaseService';
import supabase from '../lib/supabase';

const AuthContext = createContext();

// Export the useAuth hook directly from the context file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return !(supabase.supabaseUrl.includes('<PROJECT-ID>') || 
           supabase.supabaseKey.includes('<ANON_KEY>'));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [backendType, setBackendType] = useState(isSupabaseConfigured() ? 'supabase' : 'demo');

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for mock user first (demo mode)
        const mockUserJson = localStorage.getItem('mockUser');
        if (mockUserJson) {
          const mockUser = JSON.parse(mockUserJson);
          setUser(mockUser);
          setIsDemo(true);
          setBackendType('demo');
          setLoading(false);
          return;
        }

        // Try Supabase first if configured
        if (isSupabaseConfigured()) {
          try {
            // Get the session from Supabase
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              // Get user profile
              const userData = await supabaseService.getProfile();
              setUser(userData.user);
              setBackendType('supabase');
              setIsDemo(false);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Supabase auth error:', error);
          }
        }

        // If not using Supabase, try Express backend
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await authService.getProfile(token);
            setUser(userData.user);
            setBackendType('express');
            setIsDemo(false);
          } catch (error) {
            console.error('Express auth error:', error);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      if (backendType === 'supabase') {
        const response = await supabaseService.login(email, password);
        setUser(response.user);
        setIsDemo(false);
        return response;
      } else {
        const response = await authService.login(email, password);
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsDemo(false);
        setBackendType('express');
        return response;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      if (backendType === 'supabase') {
        const response = await supabaseService.register(name, email, password);
        setUser(response.user);
        setIsDemo(false);
        return response;
      } else {
        const response = await authService.register(name, email, password);
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsDemo(false);
        setBackendType('express');
        return response;
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (backendType === 'supabase') {
      await supabase.auth.signOut();
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    setUser(null);
    setIsDemo(false);
    
    // Reset to default backend type
    setBackendType(isSupabaseConfigured() ? 'supabase' : 'demo');
  };

  const regenerateApiKey = async () => {
    if (isDemo) {
      // For demo mode, just generate a random API key
      const newApiKey = `demo-${Math.random().toString(36).substring(2, 15)}`;
      const updatedUser = { ...user, apiKey: newApiKey };
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { apiKey: newApiKey };
    } else if (backendType === 'supabase') {
      const response = await supabaseService.regenerateApiKey();
      setUser(prev => ({ ...prev, apiKey: response.apiKey }));
      return response;
    } else {
      // For Express backend
      const token = localStorage.getItem('token');
      const response = await authService.regenerateApiKey(token);
      setUser(prev => ({ ...prev, apiKey: response.apiKey }));
      return response;
    }
  };

  const enableDemoMode = () => {
    setBackendType('demo');
    setIsDemo(true);
  };

  const value = {
    user,
    loading,
    isDemo,
    backendType,
    login,
    register,
    logout,
    regenerateApiKey,
    enableDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};