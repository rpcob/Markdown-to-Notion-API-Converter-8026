import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser({ ...session.user, ...profile });
      }
      setLoading(false);
    };

    fetchInitialSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser({ ...session.user, ...profile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      setUser({ ...data.user, ...profile });
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      const apiKey = uuidv4();

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            api_key: apiKey,
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      setUser({ ...data.user, ...profile });
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const regenerateApiKey = async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const newApiKey = uuidv4();

      const { data, error } = await supabase
        .from('profiles')
        .update({ api_key: newApiKey })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the user state with the new profile data
      setUser(prev => ({ ...prev, ...data }));

      return { success: true, apiKey: newApiKey };
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
      throw new Error('Failed to regenerate API key');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    regenerateApiKey
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};