import { component$, Slot, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { authStore } from '~/store/auth';
import { AuthLayout } from '../auth/AuthLayout';
import { AuthInitializer } from '../auth/AuthInitializer';
import { AppLayout } from './AppLayout';

export const LayoutContent = component$(() => {
  // Use signals for reactivity (optimized: read from store directly)
  const isAuthenticated = useSignal(authStore.isAuthenticated);
  const isLoading = useSignal(authStore.isLoading);

  // Sync authStore changes via events (optimized: minimal event handler)
  useVisibleTask$(() => {
    const handleAuthStateChange = () => {
      // Sync from store as source of truth
      isAuthenticated.value = authStore.isAuthenticated;
      isLoading.value = authStore.isLoading;
    };

    window.addEventListener('auth:state-changed', handleAuthStateChange);

    return () => {
      window.removeEventListener('auth:state-changed', handleAuthStateChange);
    };
  });

  return (
    <>
      {/* Render AuthInitializer only once at top level */}
      <AuthInitializer />
      
      {/* Show loading screen while checking auth */}
      {isLoading.value ? (
        <div class="min-h-screen flex items-center justify-center bg-learning-cream">
          <div class="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Logo"
              class="relative h-32 w-auto animate-pulse"
              loading="eager"
            />
          </div>
        </div>
      ) : !isAuthenticated.value ? (
        <AuthLayout />
      ) : (
        <AppLayout>
          <Slot />
        </AppLayout>
      )}
    </>
  );
});

