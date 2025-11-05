import { useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { authStore } from '~/store/auth';

/**
 * Hook to check if user needs to complete grade onboarding
 * Returns true if user is authenticated but hasn't set their grade_meta
 */
export const useGradeOnboarding = () => {
  const shouldShowOnboarding = useSignal(false);
  const gradeMeta = useSignal(authStore.user?.grade_meta || null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const updateOnboardingState = () => {
      const user = authStore.user;
      if (user) {
        const currentGradeMeta = user.grade_meta;
        const hasGradeMeta = currentGradeMeta && 
                            currentGradeMeta.grade && 
                            currentGradeMeta.completed;
        shouldShowOnboarding.value = !hasGradeMeta;
        gradeMeta.value = currentGradeMeta || null;
      } else {
        shouldShowOnboarding.value = false;
        gradeMeta.value = null;
      }
    };

    // Initial check
    updateOnboardingState();

    // Listen for auth state changes
    const handleAuthStateChange = () => {
      updateOnboardingState();
    };

    window.addEventListener('auth:state-changed', handleAuthStateChange);

    return () => {
      window.removeEventListener('auth:state-changed', handleAuthStateChange);
    };
  });

  return {
    shouldShowOnboarding,
    gradeMeta,
  };
};

