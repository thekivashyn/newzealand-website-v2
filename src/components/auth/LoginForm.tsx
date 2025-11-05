import { component$, useSignal, useStore, $ } from '@builder.io/qwik';
import { useAuthActions } from '../../composables/useAuth';
import { validators, validateForm, type FieldConfig } from '../../lib/validators';
import { AuthFormField } from './AuthFormField';
import { useNavigate } from '@builder.io/qwik-city';
import { logger } from '../../lib/logger';
import type { QwikSubmitEvent } from '@builder.io/qwik';

interface LoginFormProps {
  onSuccess$?: () => void;
  onForgotPassword$?: () => void;
}

export const LoginForm = component$<LoginFormProps>((props) => {
  const navigate = useNavigate();
  const authActions = useAuthActions();
  
  const formData = useStore({
    email: '',
    password: '',
  });
  
  const errors = useStore<Record<string, string>>({});
  const isLoading = useSignal(false);
  const success = useSignal(false);
  const rememberMe = useSignal(false);

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
      await authActions.login(formData.email, formData.password, rememberMe.value);
      success.value = true;
      
      // Navigate immediately after successful login
      // LayoutContent will automatically update via auth:state-changed event
      navigate('/');
      
    } catch (error: any) {
      logger.error('Login error:', error);
      errors.general = error.message || 'Login failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="w-full max-w-md mx-auto">
      <form onSubmit$={handleSubmit$} class="space-y-5" preventdefault:submit>
        <AuthFormField
          type="email"
          name="email"
          label="Email address"
          value={formData.email}
          error={errors.email}
          placeholder="Your School Email Address"
          autoComplete="email"
          onInput$={(value) => {
            formData.email = value;
            if (errors.email) delete errors.email;
          }}
          disabled={isLoading.value || success.value}
        />

        <AuthFormField
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          onInput$={(value) => {
            formData.password = value;
            if (errors.password) delete errors.password;
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
            <p class="text-sm text-green-700 font-medium">Login successful! Redirecting...</p>
          </div>
        )}

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-2 border-gray-400 text-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 focus:ring-offset-transparent"
              disabled={isLoading.value || success.value}
              tabIndex={isLoading.value || success.value ? -1 : 0}
              checked={rememberMe.value}
              onChange$={() => rememberMe.value = !rememberMe.value}
            />
            <span class="text-sm text-white font-medium">Keep me signed in for 30 days</span>
          </label>
          
          {props.onForgotPassword$ && (
            <button
              type="button"
              onClick$={props.onForgotPassword$}
              class="text-sm text-[#14B8A6] hover:text-[#0D9488] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
              disabled={isLoading.value || success.value}
              tabIndex={isLoading.value || success.value ? -1 : 0}
            >
              Forgot password?
            </button>
          )}
        </div>

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
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
});
