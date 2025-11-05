import { component$, useStore, $ } from '@builder.io/qwik';
import { useAuthActions } from '../../composables/useAuth';
import { authStore } from '~/store/auth';

export const UserProfile = component$(() => {
  const authActions = useAuthActions();
  const auth = useStore(authStore);

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  // Get user name from first_name and last_name
  const fullName = auth.user.first_name && auth.user.last_name 
    ? `${auth.user.first_name} ${auth.user.last_name}`.trim() 
    : auth.user.email?.split('@')[0] || '';
  
  // Get grade from grade_meta
  const grade = auth.user.grade_meta?.grade;

  const handleLogout = $(() => {
    authActions.logout();
  });

  return (
    <div class="p-2 sm:p-3 border-t border-stone-700/30 bg-gradient-to-t from-stone-900/70 to-transparent backdrop-blur-sm">
      <div class="w-full flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-stone-800/40 via-neutral-700/30 to-stone-800/40 border border-stone-700/30 hover:bg-gradient-to-r hover:from-stone-800/60 hover:via-neutral-700/50 hover:to-stone-800/60 hover:border-stone-600/40 hover:shadow-lg hover:shadow-black/10 transition-all duration-300 group backdrop-blur-sm transform hover:scale-[1.01]">
        <div class="relative flex-shrink-0" aria-hidden="true">
          <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 ring-2 ring-amber-400/30 group-hover:ring-amber-400/50 transition-all duration-300 shadow-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="absolute inset-0 w-9 h-9 sm:w-10 sm:w-10 bg-amber-400/10 rounded-full blur-sm"></div>
        </div>
        <div class="ml-2.5 sm:ml-4 flex-1 text-left min-w-0">
          <p class="text-xs sm:text-sm font-bold text-white group-hover:text-gray-100 transition-colors duration-300 tracking-wide drop-shadow-sm truncate">
            {fullName}
          </p>
          <p class="text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-semibold truncate">
            {grade ? `Grade ${grade}` : auth.user?.email}
          </p>
        </div>
        <div class="flex items-center gap-x-0.5 sm:gap-x-1 flex-shrink-0">
          <button
            onClick$={handleLogout}
            class="p-1.5 sm:p-2 text-gray-400 transition-all duration-300 rounded-lg hover:bg-red-500/20 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/20 group/logout backdrop-blur-sm border border-transparent hover:border-red-400/30 transform hover:scale-110 active:scale-95 cursor-pointer"
            title="Logout"
            aria-label="Sign out"
          >
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/logout:translate-x-0.5 transition-transform duration-300 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

