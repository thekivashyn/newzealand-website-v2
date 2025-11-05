import type { AuthState, User } from './types';

// Helper functions for localStorage persistence
const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const CACHE_TIMESTAMP_KEY = 'authCacheTimestamp';

function loadAuthFromStorage(): Partial<AuthState> {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, token: null, isLoading: false, error: null };
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const userData = localStorage.getItem(USER_KEY);
  
  let user: User | null = null;
  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch {
      // Invalid data, ignore
    }
  }

  return {
    isAuthenticated: !!token && !!user,
    user,
    token,
    isLoading: false,
    error: null,
  };
}

function saveAuthToStorage(state: Partial<AuthState>) {
  if (typeof window === 'undefined') return;
  
  // Optimize: Only update if values changed
  const currentToken = localStorage.getItem(TOKEN_KEY);
  const currentUserData = localStorage.getItem(USER_KEY);
  
  if (state.token !== undefined) {
    if (state.token && state.token !== currentToken) {
      localStorage.setItem(TOKEN_KEY, state.token);
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } else if (!state.token && currentToken) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    }
  }
  
  if (state.user !== undefined) {
    const userStr = state.user ? JSON.stringify(state.user) : null;
    if (userStr !== currentUserData) {
      if (state.user && userStr) {
        localStorage.setItem(USER_KEY, userStr);
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } else if (currentUserData) {
        localStorage.removeItem(USER_KEY);
      }
    }
  }
}

function clearAuthFromStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}

// Initialize auth store with persisted state
const persistedState = loadAuthFromStorage();

export const authStore: AuthState = {
  isAuthenticated: persistedState.isAuthenticated ?? false,
  user: persistedState.user ?? null,
  token: persistedState.token ?? null,
  // Always start with loading=true to prevent flash
  // AuthInitializer will set it to false after checking auth
  isLoading: true,
  error: null,
};

// Auth actions
export const authActions = {
  login: (user: User, token: string) => {
    authStore.isAuthenticated = true;
    authStore.user = user;
    authStore.token = token;
    authStore.isLoading = false;
    authStore.error = null;
    saveAuthToStorage({ user, token });
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:state-changed', { 
        detail: { isAuthenticated: true, user, token } 
      }));
    }
  },

  logout: () => {
    authStore.isAuthenticated = false;
    authStore.user = null;
    authStore.token = null;
    authStore.isLoading = false;
    authStore.error = null;
    clearAuthFromStorage();
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:state-changed', { 
        detail: { isAuthenticated: false, user: null, token: null } 
      }));
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'user_logout' } }));
    }
  },

  updateUser: (user: User) => {
    authStore.user = user;
    saveAuthToStorage({ user, token: authStore.token });
  },

  setLoading: (loading: boolean) => {
    // Optimize: Only update if value changed
    if (authStore.isLoading === loading) return;
    
    authStore.isLoading = loading;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:state-changed', { 
        detail: { isLoading: loading } 
      }));
    }
  },

  setError: (error: string | null) => {
    authStore.error = error;
    authStore.isLoading = false;
  },

  initialize: (user: User | null, token: string | null) => {
    if (user && token) {
      authStore.isAuthenticated = true;
      authStore.user = user;
      authStore.token = token;
    } else {
      authStore.isAuthenticated = false;
      authStore.user = null;
      authStore.token = null;
    }
    authStore.isLoading = false;
    authStore.error = null;
    saveAuthToStorage({ user, token });
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:state-changed', { 
        detail: { 
          isAuthenticated: !!user && !!token, 
          user, 
          token,
          isLoading: false
        } 
      }));
    }
  },
};

// Helper to get auth token for API calls
export function getAuthToken(): string | null {
  return authStore.token;
}

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  return authStore.isAuthenticated;
}

// Helper to get current user
export function getCurrentUser(): User | null {
  return authStore.user;
}

