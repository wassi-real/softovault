import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';
import { goto } from '$app/navigation';

// Create a writable store for auth state
const authStore = writable({ user: null, session: null, loading: true });
const { subscribe, set, update } = authStore;

// Initialize the store
export const auth = {
  subscribe,
  update,
  set,
  
  // Initialize auth state
  init: async () => {
    if (browser) {
      // Set initial loading state
      update(state => ({ ...state, loading: true }));
      
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          set({ user, session, loading: false });
        } else {
          set({ user: null, session: null, loading: false });
        }
        
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              const { data: { user } } = await supabase.auth.getUser();
              set({ user, session, loading: false });
            } else {
              set({ user: null, session: null, loading: false });
            }
          }
        );
        
        return () => {
          if (subscription) subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        set({ user: null, session: null, loading: false });
      }
    }
  },
  
  // Sign up with email and password
  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/v1/verify`
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },
  
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Send password reset email
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  // Update password with new password
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      goto('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  // Get current user
  getUser: () => {
    let user = null;
    update(state => {
      user = state.user;
      return state;
    });
    return user;
  }
};