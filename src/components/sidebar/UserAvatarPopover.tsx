import { component$, useSignal, useVisibleTask$, $, useStore } from '@builder.io/qwik';
import { useAuthActions } from '../../composables/useAuth';
import { authStore } from '~/store/auth';
import { uiActions } from '~/store/ui';

interface UserAvatarPopoverProps {
  children?: any;
}

export const UserAvatarPopover = component$<UserAvatarPopoverProps>((props) => {
  const authActions = useAuthActions();
  const auth = useStore(authStore);
  
  const isOpen = useSignal(false);
  const buttonRef = useSignal<HTMLElement>();
  const popoverRef = useSignal<HTMLDivElement>();
  const position = useSignal<{
    left: number;
    top: number;
    showArrow: boolean;
    arrowPosition: 'left' | 'right';
    arrowTop: number;
  }>({ left: 0, top: 0, showArrow: false, arrowPosition: 'left', arrowTop: 0 });

  // Get user name from first_name and last_name
  const fullName = auth.user?.first_name && auth.user?.last_name 
    ? `${auth.user.first_name} ${auth.user.last_name}`.trim() 
    : auth.user?.email?.split('@')[0] || '';
  
  // Get grade from grade_meta
  const grade = auth.user?.grade_meta?.grade;

  const handleToggle = $(() => {
    if (!isOpen.value && buttonRef.value && typeof window !== 'undefined') {
      // Opening - calculate position first
      const rect = buttonRef.value.getBoundingClientRect();
      const popoverWidth = 320;
      const popoverHeight = 220;
      const spacing = 12;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const avatarCenterY = rect.top + (rect.height / 2);

      let left = rect.right + spacing;
      let top = avatarCenterY - (popoverHeight / 2);
      let arrowPosition: 'left' | 'right' = 'left';
      let arrowTop = popoverHeight / 2 - 6;

      if (left + popoverWidth > viewportWidth - 16) {
        left = rect.left - popoverWidth - spacing;
        arrowPosition = 'right';
      }

      if (top < 16) {
        top = 16;
        arrowTop = avatarCenterY - top - 6;
      } else if (top + popoverHeight > viewportHeight - 16) {
        top = viewportHeight - popoverHeight - 16;
        arrowTop = avatarCenterY - top - 6;
      }

      arrowTop = Math.max(20, Math.min(arrowTop, popoverHeight - 40));
      if (left < 16) left = 16;

      position.value = {
        left,
        top,
        showArrow: true,
        arrowPosition,
        arrowTop: Math.round(arrowTop)
      };
    }
    isOpen.value = !isOpen.value;
  });

  const handleLogout = $(() => {
    authActions.logout();
    uiActions.setDesktopSidebarCollapsed(true);
    isOpen.value = false;
  });

  // Handle click outside
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => isOpen.value);
    
    if (!isOpen.value) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (
        buttonRef.value && 
        !buttonRef.value.contains(target) &&
        popoverRef.value &&
        !popoverRef.value.contains(target)
      ) {
        isOpen.value = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  if (!auth.isAuthenticated || !auth.user) {
    return <>{props.children}</>;
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick$={handleToggle}
        class="cursor-pointer focus:outline-none w-full text-left"
      >
        {props.children}
      </button>
      
      {isOpen.value && (
        <>
          {/* Backdrop blur overlay */}
          <div
            class="fixed inset-0 z-[9998] bg-black/5 backdrop-blur-sm transition-all duration-200"
            onClick$={() => isOpen.value = false}
          />

          {/* Main popover */}
          <div
            ref={popoverRef}
            class="fixed z-[9999] w-80 max-w-[calc(100vw-32px)] rounded-xl bg-gradient-to-r from-stone-800/95 via-neutral-700/95 to-stone-800/95 border border-stone-700/60 shadow-2xl shadow-black/60 backdrop-blur-md overflow-hidden transition-all duration-250 ease-out hover:scale-[1.02]"
            style={{
              left: `${position.value.left}px`,
              top: `${position.value.top}px`,
              transformOrigin: position.value.arrowPosition === 'left' ? 'left center' : 'right center'
            }}
          >
            {/* Arrow indicator */}
            {position.value.showArrow && (
              <div
                class="absolute transition-all duration-200 ease-out"
                style={{
                  [position.value.arrowPosition === 'left' ? 'left' : 'right']: '-6px',
                  top: `${position.value.arrowTop}px`,
                  transform: 'rotate(45deg)'
                }}
              >
                {/* Arrow shadow */}
                <div class="absolute w-3 h-3 bg-black/30 transform rotate-45 translate-x-0.5 translate-y-0.5" />
                {/* Main arrow */}
                <div class="absolute w-3 h-3 bg-stone-800 border-t border-l border-stone-700/60 transform rotate-45" />
                {/* Arrow glow */}
                <div class="absolute w-3 h-3 bg-amber-400/20 transform rotate-45 blur-sm" />
              </div>
            )}
            
            <div class="p-4 transition-all duration-200 ease-out">
              {/* User Info Section */}
              <div class="flex items-center mb-4 transition-all duration-250 ease-out">
                <div class="relative flex-shrink-0">
                  <div class="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 ring-2 ring-amber-400/30 transition-all duration-300 shadow-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="absolute inset-0 w-12 h-12 bg-amber-400/10 rounded-full blur-sm"></div>
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <p class="text-sm font-bold text-white tracking-wide drop-shadow-sm truncate">
                    {fullName}
                  </p>
                  <p class="text-xs text-gray-400 font-medium truncate">
                    {grade ? `Grade ${grade}` : auth.user?.email}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div class="border-t border-stone-600/50 my-3 transition-all duration-300 ease-out" />

              {/* Actions */}
              <div class="space-y-2 transition-all duration-300 ease-out">
                <button
                  onClick$={handleLogout}
                  class="w-full flex items-center px-3 py-2.5 text-sm text-gray-300 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all duration-200 group border border-transparent hover:border-red-400/30 hover:scale-[1.02] active:scale-98"
                >
                  <div class="flex-shrink-0 mr-3 p-1.5 rounded-md bg-red-500/20 group-hover:bg-red-500/30 transition-all duration-200">
                    <svg class="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span class="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});
