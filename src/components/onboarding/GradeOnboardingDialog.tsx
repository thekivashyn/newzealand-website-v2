import { component$, useSignal, $ } from '@builder.io/qwik';
import { authStore, authActions } from '~/store/auth';
import { updateGradeMeta } from '~/services/user.service';
import { logger } from '~/lib/logger';

interface GradeOnboardingDialogProps {
  isOpen: boolean;
  onComplete$: () => void;
}

// New Zealand Secondary Education Forms (Grade 10 & 11)
const FORMS = [
  { 
    value: '10', 
    label: 'Grade 10', 
    bgGradient: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    borderColor: 'border-yellow-500',
    textColor: 'text-gray-900',
    iconBg: 'bg-yellow-100'
  },
  { 
    value: '11', 
    label: 'Grade 11', 
    bgGradient: 'bg-gradient-to-br from-red-600 to-red-700',
    borderColor: 'border-red-600',
    textColor: 'text-white',
    iconBg: 'bg-red-100'
  },
];

export const GradeOnboardingDialog = component$<GradeOnboardingDialogProps>((props) => {
  const firstName = useSignal('');
  const lastName = useSignal('');
  const selectedForm = useSignal('');
  const isLoading = useSignal(false);
  const error = useSignal('');

  if (!props.isOpen) return null;

  const handleSubmit$ = $(async () => {
    if (!firstName.value.trim()) {
      error.value = 'Please enter your first name';
      return;
    }

    if (!lastName.value.trim()) {
      error.value = 'Please enter your last name';
      return;
    }

    if (!selectedForm.value) {
      error.value = 'Please select your Form';
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      const gradeMeta = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        grade: selectedForm.value,
        completed: true,
        completedAt: new Date().toISOString(),
      };

      logger.debug('Submitting grade meta:', gradeMeta);

      // Get token from store
      const token = authStore.token;
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call API to update backend
      const response = await updateGradeMeta(gradeMeta, token);
      
      logger.debug('Grade meta update response:', response);

      // Update user in store after successful API call
      const user = authStore.user;
      if (user) {
        authActions.updateUser({
          ...user,
          first_name: firstName.value.trim(),
          last_name: lastName.value.trim(),
          grade_meta: gradeMeta,
        });
      }

      // Wait a tick to ensure state updates propagate before closing dialog
      // This ensures all components that listen to auth:state-changed can react
      await new Promise(resolve => setTimeout(resolve, 0));

      // Call completion callback
      props.onComplete$();
    } catch (err: any) {
      logger.error('Failed to update grade meta:', err);
      error.value = err.message || 'Failed to update profile. Please try again.';
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
      <div class="bg-gradient-to-br from-teal-700 via-teal-700 to-teal-800 w-full h-full sm:h-auto sm:w-full sm:max-w-2xl sm:max-h-[90vh] sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-teal-600/50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500">
        {/* Decorative Elements */}
        <div class="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-teal-500/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-tr from-cyan-400/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Header */}
        <div class="relative px-4 pt-8 sm:pt-12 flex-shrink-0">
          <div class="relative z-10">
            <h2 class="text-2xl sm:text-4xl font-bold text-white text-center mb-2">
              Let's set up your profile
            </h2>
            <p class="text-teal-200 text-sm sm:text-base text-center">
              Tell us a bit about yourself to get started
            </p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div class="relative flex-1 overflow-y-auto px-4 py-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Error Message */}
          {error.value && (
            <div class="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm">
              {error.value}
            </div>
          )}

          {/* Name Inputs */}
          <div class="space-y-4 sm:space-y-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-2xl font-bold text-white">What's your name?</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="group">
                <label for="firstName" class="block text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                  First Name*
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName.value}
                  onInput$={(e) => {
                    firstName.value = (e.target as HTMLInputElement).value;
                    if (error.value) error.value = '';
                  }}
                  placeholder="Enter first name"
                  class="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl border-0 focus:ring-2 focus:ring-teal-400 outline-none transition-all duration-300 bg-teal-800/60 text-white placeholder:text-teal-300/60 font-medium shadow-lg backdrop-blur-sm hover:bg-teal-800/70 touch-manipulation"
                  autoComplete="given-name"
                  disabled={isLoading.value}
                />
              </div>
              <div class="group">
                <label for="lastName" class="block text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                  Last Name*
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName.value}
                  onInput$={(e) => {
                    lastName.value = (e.target as HTMLInputElement).value;
                    if (error.value) error.value = '';
                  }}
                  placeholder="Enter last name"
                  class="w-full px-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl border-0 focus:ring-2 focus:ring-teal-400 outline-none transition-all duration-300 bg-teal-800/60 text-white placeholder:text-teal-300/60 font-medium shadow-lg backdrop-blur-sm hover:bg-teal-800/70 touch-manipulation"
                  autoComplete="family-name"
                  disabled={isLoading.value}
                />
              </div>
            </div>
          </div>

          {/* Grade Selection */}
          <div class="space-y-4 sm:space-y-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-2xl font-bold text-white">Select your grade</h3>
            </div>
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
              {FORMS.map((form) => (
                <button
                  key={form.value}
                  onClick$={() => {
                    selectedForm.value = form.value;
                    if (error.value) error.value = '';
                  }}
                  class={`relative p-6 sm:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform touch-manipulation ${
                    selectedForm.value === form.value
                      ? 'bg-gray-900 text-white shadow-xl scale-[1.02]'
                      : 'bg-white text-gray-900 shadow-lg hover:shadow-xl active:scale-[0.98]'
                  }`}
                  aria-label={`Select ${form.label}`}
                  aria-pressed={selectedForm.value === form.value}
                  disabled={isLoading.value}
                >
                  <div class="flex flex-col items-center text-center gap-0">
                    <div class={`font-bold text-xl sm:text-2xl transition-colors duration-300`}>
                      {form.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div class="relative px-4 py-4 sm:px-8 sm:pb-8 flex-shrink-0">
          <button
            onClick$={handleSubmit$}
            disabled={!firstName.value.trim() || !lastName.value.trim() || !selectedForm.value || isLoading.value}
            class="w-full flex justify-center items-center gap-3 py-4 sm:py-5 px-4 rounded-2xl text-lg sm:text-xl font-bold text-white bg-teal-500 hover:bg-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98] touch-manipulation"
          >
            {isLoading.value ? (
              <>
                <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Setting up your profile...</span>
              </>
            ) : (
              <span class="tracking-wide">Continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

