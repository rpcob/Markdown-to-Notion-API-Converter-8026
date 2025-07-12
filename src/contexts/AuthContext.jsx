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
  const [sessionChecked, setSessionChecked] = useState(false);

  // Initial session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Initial session check:', data?.session ? 'Session found' : 'No session');
        
        if (error) {
          console.error('Session check error:', error);
          setLoading(false);
          setSessionChecked(true);
          return;
        }
        
        if (data?.session?.user) {
          console.log('User found in session, fetching profile');
          await updateUserData(data.session.user);
        }
        
        setLoading(false);
        setSessionChecked(true);
      } catch (err) {
        console.error('Session check exception:', err);
        setLoading(false);
        setSessionChecked(true);
      }
    };
    
    checkSession();
  }, []);

  // Auth state listener
  useEffect(() => {
    if (!sessionChecked) return;
    
    console.log('Setting up auth state listener');
    
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
      
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          console.log('User signed in, updating user data');
          await updateUserData(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing user data');
        setUser(null);
      }
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, [sessionChecked]);

  const updateUserData = async (authUser) => {
    console.log('Updating user data for:', authUser.id);
    try {
      // First check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles_md2n')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.log('Profile not found, creating one');
        
        // If no profile exists, create one
        if (error.code === 'PGRST116') {
          const apiKey = uuidv4();
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles_md2n')
            .insert([{
              id: authUser.id,
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
              email: authUser.email,
              api_key: apiKey
            }])
            .select()
            .single();
            
          if (insertError) {
            console.error('Failed to create profile:', insertError);
            setUser(authUser);
            return;
          }
          
          setUser({
            ...authUser,
            ...newProfile
          });
          return;
        }
        
        console.error('Error fetching user profile:', error);
        setUser(authUser);
        return;
      }

      console.log('Profile found, setting user data');
      setUser({
        ...authUser,
        ...profile
      });
    } catch (error) {
      console.error('Exception in updateUserData:', error);
      setUser(authUser);
    }
  };

  const login = async (email, password) => {
    console.log('Login attempt for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error from Supabase:', error);
        throw error;
      }

      console.log('Login successful, user:', data.user.id);
      
      // The onAuthStateChange listener will handle updating the user data
      return data;
    } catch (error) {
      console.error('Login exception:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    console.log('Register attempt for:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        console.error('Registration error from Supabase:', error);
        throw error;
      }

      console.log('Registration successful, user:', data.user?.id);
      
      // Create profile immediately
      if (data.user) {
        const apiKey = uuidv4();
        const { error: profileError } = await supabase
          .from('profiles_md2n')
          .insert([{
            id: data.user.id,
            name,
            email,
            api_key: apiKey
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      }
      
      // The onAuthStateChange listener will handle updating the user data
      return data;
    } catch (error) {
      console.error('Registration exception:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logout attempt');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error from Supabase:', error);
        throw error;
      }
      
      console.log('Logout successful');
      setUser(null);
    } catch (error) {
      console.error('Logout exception:', error);
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
        .from('profiles_md2n')
        .update({ api_key: newApiKey })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        ...data
      }));

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