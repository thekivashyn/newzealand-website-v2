import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { authActions, authStore } from '~/store/auth';
import { authVerify } from '../../services/auth.service';
import { logger } from '../../lib/logger';

export const AuthInitializer = component$(() => {
  const hasInitialized = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // Prevent multiple initializations
    if (hasInitialized.value) {
      return;
    }
    
    hasInitialized.value = true;
    
    // Read from store directly (already loaded from localStorage)
    const { token, user } = authStore;
    
    if (token && user) {
      // Verify token in background
      try {
        const { user: verifiedUser } = await authVerify(token);
        authActions.initialize(verifiedUser, token);
      } catch (error: any) {
        // 🚀 FIX: Only clear token if it's DEFINITELY a 401 (token expired/invalid)
        // Network errors, timeouts, 5xx errors = temporary issues, NOT auth failures
        const isAuthError = error.isAuthError === true || error.status === 401;
        const isNetworkError = error.isNetworkError === true || (error.name === 'TypeError' && error.message?.includes('fetch'));
        
        if (isAuthError) {
          // Token is definitely invalid/expired - clear auth
          logger.warn('🔒 Token invalid (401), clearing auth data');
        authActions.logout();
          hasInitialized.value = false; // Reset flag on logout
        } else if (isNetworkError) {
          // 🚀 PRESERVE TOKEN: Network errors are temporary, keep token and user
          logger.warn('⚠️ Auth verification failed but token preserved (network error):', error.message);
          // Keep user logged in with cached data - token might still be valid
          authActions.setLoading(false);
        } else {
          // Other errors (5xx, etc.) - also preserve token
          logger.warn('⚠️ Auth verification failed but token preserved (server error):', {
            message: error.message,
            status: error.status
          });
          // Keep user logged in with cached data
          authActions.setLoading(false);
        }
      }
    } else {
      // No token/user - set as not authenticated (this will set isLoading=false)
      authActions.initialize(null, null);
    }

    // Listen for logout events
    const handleAuthLogout = () => {
      logger.debug('🔒 Auth logout event received');
      authActions.logout();
      hasInitialized.value = false; // Reset flag on logout
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  });

  return null;
});

