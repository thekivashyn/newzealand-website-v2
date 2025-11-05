import { component$, useSignal, $ } from '@builder.io/qwik';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { logger } from '../../lib/logger';

export const AuthLayout = component$(() => {
  const authMode = useSignal<'login' | 'signup' | 'forgot-password'>('login');

  const handleAuthSuccess$ = $(() => {
    logger.debug('Auth success handled');
  });

  return (
    <div class="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-[#E6F4F1]">
      {/* Logo */}
      <div class="absolute top-3 right-3 sm:top-6 sm:right-6">
        <img src="/logo.png" alt="Logo" class="w-auto h-8 sm:h-10 md:h-12" />
      </div>

      <div class="w-full max-w-5xl">
        {/* Title */}
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800 transition-all duration-500 ease-out px-2">
          {authMode.value === 'login' ? (
            <>Sign in to your <span class="text-[#1B7A7A]">account</span></>
          ) : authMode.value === 'signup' ? (
            <>Create your <span class="text-[#1B7A7A]">account</span></>
          ) : (
            <>Reset your <span class="text-[#1B7A7A]">password</span></>
          )}
        </h1>

        {/* Main Card */}
        <div
          class="rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 mx-auto transition-all duration-500 ease-out"
          style={{ backgroundColor: '#1B7A7A', maxWidth: '1200px' }}
        >
          <div class="flex flex-col lg:flex-row items-start gap-6 sm:gap-8 lg:gap-12">
            {/* Left Side - Features */}
            <div class="w-full lg:flex-1">
              <div class="transition-all duration-500 ease-out">
                <div class="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg mb-3 sm:mb-4" aria-hidden="true">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#1B7A7A]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                </div>
                <h2 class="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  New Zealand Ministry of Education Study Guide
                </h2>
                <ul class="space-y-2 text-white text-xs sm:text-sm">
                  <li class="flex items-start">
                    <span class="w-1.5 h-1.5 bg-white rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span>Designed for Kiwi students</span>
                  </li>
                  <li class="flex items-start">
                    <span class="w-1.5 h-1.5 bg-white rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span>Save your progress and practice quizzes</span>
                  </li>
                  <li class="flex items-start">
                    <span class="w-1.5 h-1.5 bg-white rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span>Ask questions with helpful examples</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Form */}
            <div class="w-full lg:flex-1">
              <div class="transition-all duration-500 ease-out">
                <div class="transition-opacity duration-200">
                  {authMode.value === 'login' ? (
                    <LoginForm 
                      onSuccess$={handleAuthSuccess$} 
                      onForgotPassword$={$(() => authMode.value = 'forgot-password')}
                    />
                  ) : authMode.value === 'signup' ? (
                    <SignupForm onSuccess$={handleAuthSuccess$} />
                  ) : (
                    <div class="text-white">Forgot password form - to be implemented</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle between login/signup */}
        {authMode.value !== 'forgot-password' && (
          <div class="text-center mt-4 sm:mt-6 transition-opacity duration-500 px-2">
            {authMode.value === 'signup' ? (
              <p class="text-gray-600 text-sm sm:text-base">
                Already have an account?{' '}
                <button
                  onClick$={() => authMode.value = 'login'}
                  class="text-black hover:text-gray-700 font-medium underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p class="text-gray-600 text-sm sm:text-base">
                Don't have an account?{' '}
                <button
                  onClick$={() => authMode.value = 'signup'}
                  class="text-black hover:text-gray-700 font-medium underline transition-colors"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
