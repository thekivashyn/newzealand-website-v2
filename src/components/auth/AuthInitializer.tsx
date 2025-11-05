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
    
    // 🚀 CRITICAL FIX: Add timeout fallback to prevent infinite loading
    // If auth check takes too long (>10s), assume network issue and proceed with cached data
    const timeoutId = setTimeout(() => {
      if (authStore.isLoading) {
        logger.warn('⚠️ Auth verification timeout - proceeding with cached data');
        // If we have cached user/token, keep them. Otherwise, clear auth.
        const { token, user } = authStore;
        if (token && user) {
          authActions.setLoading(false); // Keep cached auth
        } else {
          authActions.initialize(null, null); // Clear and set loading=false
        }
      }
    }, 10000); // 10 second timeout
    
    try {
      // Read from store directly (already loaded from localStorage)
      const { token, user } = authStore;
      
      if (token && user) {
        // Verify token in background
        try {
          const { user: verifiedUser } = await authVerify(token);
          clearTimeout(timeoutId); // Clear timeout on success
          authActions.initialize(verifiedUser, token);
        } catch (error: any) {
          clearTimeout(timeoutId); // Clear timeout on error
          
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
        clearTimeout(timeoutId); // Clear timeout if no auth to check
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
        clearTimeout(timeoutId);
        window.removeEventListener('auth:logout', handleAuthLogout);
      };
    } catch (error) {
      clearTimeout(timeoutId);
      // Catch-all: If anything unexpected happens, set loading=false to unblock UI
      logger.error('🚨 Unexpected error in AuthInitializer:', error);
      authActions.initialize(null, null);
    }
  });

  return null;
});

