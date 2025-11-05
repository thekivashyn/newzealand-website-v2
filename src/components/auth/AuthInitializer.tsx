import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { authActions, authStore } from '~/store/auth';
import { authVerify } from '../../services/auth.service';
import { logger } from '../../lib/logger';

export const AuthInitializer = component$(() => {
  const hasInitialized = useSignal(false);

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
      } catch {
        logger.warn('Token verification failed, clearing auth');
        authActions.logout();
        hasInitialized.value = false; // Reset flag on logout
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

