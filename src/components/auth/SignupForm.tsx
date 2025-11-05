import { component$, useSignal, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { useAuthActions } from '../../composables/useAuth';
import { validators, validateForm, type FieldConfig } from '../../lib/validators';
import { AuthFormField } from './AuthFormField';
import { useNavigate } from '@builder.io/qwik-city';
import { logger } from '../../lib/logger';
import type { QwikSubmitEvent } from '@builder.io/qwik';

interface SignupFormProps {
  onSuccess$?: () => void;
}

interface PasswordStrength {
  score: number;
  level: string;
  color: string;
  checks: Array<{ label: string; met: boolean }>;
  percentage: number;
}

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, level: 'none', checks: [], percentage: 0, color: 'gray' };

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /\d/.test(password) },
    { label: 'Contains special character', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password) },
    { label: 'At least 12 characters', met: password.length >= 12 }
  ];

  const score = checks.filter(check => check.met).length;
  let level = 'weak';
  let color = 'red';

  if (score >= 5) {
    level = 'very strong';
    color = 'green';
  } else if (score >= 4) {
    level = 'strong';
    color = 'green';
  } else if (score >= 3) {
    level = 'good';
    color = 'yellow';
  } else if (score >= 2) {
    level = 'fair';
    color = 'orange';
  }

  return { score, level, color, checks, percentage: (score / 6) * 100 };
}

export const SignupForm = component$<SignupFormProps>(() => {
  const navigate = useNavigate();
  const authActions = useAuthActions();
  
  const formData = useStore({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const errors = useStore<Record<string, string>>({});
  const isLoading = useSignal(false);
  const success = useSignal(false);
  const isPasswordFocused = useSignal(false);
  const passwordStrength = useSignal<PasswordStrength>({ score: 0, level: 'none', checks: [], percentage: 0, color: 'gray' });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => formData.password);
    passwordStrength.value = getPasswordStrength(formData.password);
  });

  const handleSubmit$ = $(async (e: QwikSubmitEvent) => {
    e.preventDefault();
    
    // Define fields inline to avoid serialization issues
    const fields: Record<string, FieldConfig> = {
      email: {
        validations: [
          validators.required('Email is required'),
          validators.email(),
        ],
      },
      password: {
        validations: [
          validators.required('Password is required'),
          validators.custom(
            (value) => getPasswordStrength(value).score >= 3,
            'Password strength must be at least "Good"'
          ),
        ],
      },
      confirmPassword: {
        validations: [
          validators.required('Please confirm your password'),
          validators.matchesField('password', 'Passwords do not match'),
        ],
      },
    };
    
    const validation = validateForm(fields, formData);
    if (!validation.isValid) {
      Object.assign(errors, validation.errors);
      return;
    }

    Object.assign(errors, {});
    isLoading.value = true;
    
    try {
      await authActions.signup(formData.email, formData.password);
      success.value = true;
      
      // Navigate immediately after successful signup
      // LayoutContent will automatically update via auth:state-changed event
      navigate('/');
      
    } catch (error: any) {
      logger.error('Signup error:', error);
      errors.general = error.message || 'Signup failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="w-full max-w-md mx-auto">
      <form onSubmit$={handleSubmit$} class="space-y-6" preventdefault:submit>
        <AuthFormField
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          error={errors.email}
          placeholder="Enter your email"
          autoComplete="email"
          onInput$={(value) => {
            formData.email = value;
            if (errors.email) delete errors.email;
          }}
          disabled={isLoading.value || success.value}
        />

        <div class="relative">
          <AuthFormField
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            error={errors.password}
            placeholder="Create a strong password"
            autoComplete="new-password"
            onInput$={(value) => {
              formData.password = value;
              if (errors.password) delete errors.password;
            }}
            onFocus$={() => isPasswordFocused.value = true}
            onBlur$={() => isPasswordFocused.value = false}
            disabled={isLoading.value || success.value}
          />

          {isPasswordFocused.value && (
            <div class="absolute z-50 left-0 right-0 mt-3 p-5 bg-gradient-to-br from-[#0B3B3A] via-[#0F4A49] to-[#0B3B3A] border-2 border-[#14B8A6]/60 rounded-2xl shadow-2xl backdrop-blur-sm animate-fadeIn">
              <div class="mb-4">
                <h3 class="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password Requirements
                </h3>
              </div>

              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-300">Strength</span>
                  <span class={`text-xs font-bold ${
                    passwordStrength.value.color === 'green' ? 'text-green-400' :
                    passwordStrength.value.color === 'yellow' ? 'text-yellow-400' :
                    passwordStrength.value.color === 'orange' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {passwordStrength.value.level.charAt(0).toUpperCase() + passwordStrength.value.level.slice(1)}
                  </span>
                </div>
                <div class="relative h-2.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur">
                  <div
                    class={`h-full transition-all duration-500 ease-out rounded-full ${
                      passwordStrength.value.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                      passwordStrength.value.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-amber-400 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                      passwordStrength.value.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' :
                      'bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                    }`}
                    style={{ width: `${passwordStrength.value.percentage}%` }}
                  />
                </div>
              </div>

              <div class="space-y-2.5">
                {passwordStrength.value.checks.map((check, index) => (
                  <div 
                    key={index}
                    class={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                      check.met 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-gray-800/30 border border-gray-700/30'
                    }`}
                  >
                    <div class={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      check.met 
                        ? 'bg-green-500/20 border-2 border-green-400' 
                        : 'bg-gray-700/50 border-2 border-gray-600'
                    }`}>
                      {check.met ? (
                        <svg class="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      ) : (
                        <svg class="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span class={`text-sm transition-colors duration-200 ${
                      check.met 
                        ? 'text-green-300 font-medium' 
                        : 'text-gray-400'
                    }`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>

              {passwordStrength.value.score < 6 && (
                <div class="mt-4 pt-3 border-t border-gray-700/50">
                  <p class="text-xs text-gray-400 italic">
                    💡 Complete all requirements for a very strong password
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <AuthFormField
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          onInput$={(value) => {
            formData.confirmPassword = value;
            if (errors.confirmPassword) delete errors.confirmPassword;
          }}
          disabled={isLoading.value || success.value}
        />

        {errors.general && (
          <div class="rounded-xl bg-red-50 border-2 border-red-200 p-4">
            <p class="text-sm text-red-700 font-medium">{errors.general}</p>
          </div>
        )}

        {success.value && (
          <div class="rounded-xl bg-green-50 border-2 border-green-200 p-4 flex items-center gap-3" role="status" aria-live="polite">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-green-700 font-medium">Account created successfully! Redirecting...</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading.value || success.value}
          tabIndex={isLoading.value || success.value ? -1 : 0}
          class={`
            w-full py-4 px-6 rounded-xl font-bold text-lg
            transition-all duration-200 transform
            focus:outline-none focus:ring-4 focus:ring-[#14B8A6] focus:ring-offset-2 focus:ring-offset-transparent
            ${
              success.value
                ? 'bg-green-500 text-white cursor-default shadow-[0_4px_0_0_rgba(34,197,94,0.8)]'
                : isLoading.value
                ? 'bg-[#0D9488] text-white cursor-wait opacity-75 shadow-[0_4px_0_0_rgba(13,148,136,0.6)]'
                : 'bg-[#14B8A6] text-white hover:bg-[#0D9488] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(13,148,136,1)] shadow-[0_6px_0_0_rgba(13,148,136,1)]'
            }
          `}
        >
          {success.value ? (
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Success!
            </span>
          ) : isLoading.value ? (
            <span class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
});

