import { component$, Slot, useSignal } from '@builder.io/qwik';
import { Sidebar } from '../Sidebar';
import { MainContentWrapper } from '../MainContentWrapper';
import { MobileMenuButton } from '../ui/MobileMenuButton';
import { GradeOnboardingDialog } from '../onboarding/GradeOnboardingDialog';
import { useGradeOnboarding } from '~/composables/useGradeOnboarding';

export const AppLayout = component$(() => {
  const { shouldShowOnboarding } = useGradeOnboarding();
  const showOnboarding = useSignal(true);

  const handleOnboardingComplete$ = () => {
    showOnboarding.value = false;
  };

  return (
    <div class="flex h-screen">
      <Sidebar />
      <MobileMenuButton />
      <MainContentWrapper>
        <Slot />
      </MainContentWrapper>
      
      {/* Grade Onboarding Dialog - Force show for users without grade_meta */}
      {shouldShowOnboarding.value && showOnboarding.value && (
        <GradeOnboardingDialog 
          isOpen={true}
          onComplete$={handleOnboardingComplete$}
        />
      )}
    </div>
  );
});

