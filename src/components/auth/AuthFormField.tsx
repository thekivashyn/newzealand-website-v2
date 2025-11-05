import { component$, useSignal, $ } from '@builder.io/qwik';

export type InputType = 'text' | 'email' | 'password';

export interface AuthFormFieldProps {
  type: InputType;
  name: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  onInput$?: (value: string) => void;
  onFocus$?: () => void;
  onBlur$?: () => void;
}

export const AuthFormField = component$<AuthFormFieldProps>((props) => {
  const showPassword = useSignal(false);

  const handleInput$ = $((value: string) => {
    // eslint-disable-next-line qwik/valid-lexical-scope
    props.onInput$?.(value);
  });

  const handleFocus$ = $(() => {
    // eslint-disable-next-line qwik/valid-lexical-scope
    props.onFocus$?.();
  });

  const handleBlur$ = $(() => {
    // eslint-disable-next-line qwik/valid-lexical-scope
    props.onBlur$?.();
  });

  const getIcon = () => {
    switch (props.type) {
      case 'email':
        return (
          <svg class="w-5 h-5 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'password':
        return (
          <svg class="w-5 h-5 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return (
          <svg class="w-5 h-5 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  const inputType = props.type === 'password' && showPassword.value ? 'text' : props.type;

  return (
    <div class="space-y-2">
      <label 
        for={props.name}
        class="flex items-center gap-2 text-sm font-semibold text-white"
      >
        <span class="text-white">{getIcon()}</span>
        {props.label}
      </label>
      
      <div class="relative">
        <input
          id={props.name}
          name={props.name}
          type={inputType}
          value={props.value}
          onInput$={(e) => handleInput$((e.target as HTMLInputElement).value)}
          onFocus$={handleFocus$}
          onBlur$={handleBlur$}
          disabled={props.disabled}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          tabIndex={props.disabled ? -1 : 0}
          class={`
            block w-full px-4 ${props.type === 'password' ? 'pr-12' : 'pr-4'} py-4
            bg-[#0B3B3A] border-2 rounded-xl
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 focus:ring-offset-[#0B3B3A] focus:border-[#14B8A6]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${props.error 
              ? 'border-red-500' 
              : 'border-[#0B3B3A]'
            }
          `}
        />
        
        {props.type === 'password' && (
          <button
            type="button"
            onClick$={() => showPassword.value = !showPassword.value}
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 focus:ring-offset-[#0B3B3A] rounded"
            tabIndex={-1}
            aria-label={showPassword.value ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword.value}
            disabled={props.disabled}
          >
            {showPassword.value ? (
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12m-8.71 0L3 21m8.71-9L21 21" />
              </svg>
            ) : (
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      {props.error && (
        <p class="text-sm text-red-600 font-medium animate-in fade-in duration-200">
          {props.error}
        </p>
      )}
    </div>
  );
});

