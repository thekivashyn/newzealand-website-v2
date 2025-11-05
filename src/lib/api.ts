// Shared API utilities
export const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/website';

// Helper to get auth token from localStorage (client-side only)
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

// Helper to create headers with auth token
export function createAuthHeaders(token: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

// Error handler for API responses
export async function handleApiError(response: Response): Promise<never> {
  const errorData = await response.json().catch(() => ({
    message: `HTTP ${response.status}: ${response.statusText}`,
  }));
  
  throw new Error(errorData.message || 'API request failed');
}

