import { server$ } from '@builder.io/qwik-city';
import type { User } from '~/store/types';

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/website';

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Note: In server$ functions, we can't access localStorage directly
  // Token should be passed as parameter or via request headers
  return headers;
}

// Auth API server functions
export const authSignup = server$(async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Signup failed. Please try again.');
  }

  return response.json();
});

export const authLogin = server$(async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed. Please try again.');
  }

  return response.json();
});

export const authVerify = server$(async (token: string): Promise<{ user: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expired or invalid');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Auth verification failed');
  }

  return response.json();
});

// Client-side auth service (for token management)
export class AuthService {
  private static TOKEN_KEY = 'authToken';
  private static USER_KEY = 'user';
  private static CACHE_TIMESTAMP_KEY = 'authCacheTimestamp';
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  static setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AuthService.TOKEN_KEY, token);
    localStorage.setItem(AuthService.CACHE_TIMESTAMP_KEY, Date.now().toString());
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(AuthService.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    localStorage.setItem(AuthService.CACHE_TIMESTAMP_KEY, Date.now().toString());
  }

  static logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
    localStorage.removeItem(AuthService.CACHE_TIMESTAMP_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

