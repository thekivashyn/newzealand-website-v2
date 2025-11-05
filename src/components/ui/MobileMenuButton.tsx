import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { uiStore, uiActions } from '~/store/ui';

export const MobileMenuButton = component$(() => {
  // Use signal for reactive state
  const isMobileSidebarOpen = useSignal(uiStore.isMobileSidebarOpen);

  // Sync with store changes via events
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Initial sync
    isMobileSidebarOpen.value = uiStore.isMobileSidebarOpen;

    // Listen for UI state changes
    const handleUIStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.isMobileSidebarOpen !== undefined) {
        isMobileSidebarOpen.value = customEvent.detail.isMobileSidebarOpen;
      }
      // Also sync directly from store
      isMobileSidebarOpen.value = uiStore.isMobileSidebarOpen;
    };

    window.addEventListener('ui:state-changed', handleUIStateChange);

    return () => {
      window.removeEventListener('ui:state-changed', handleUIStateChange);
    };
  });

  const handleToggle = $(() => {
    uiActions.toggleMobileSidebar();
  });

  return (
    <button
      class={`fixed top-4 left-4 z-[70] flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800/90 text-gray-100 shadow-lg transition-all duration-300 hover:bg-gray-700/90 hover:scale-105 active:scale-95 md:hidden ${
        isMobileSidebarOpen.value ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
      }`}
      onClick$={handleToggle}
      aria-label={isMobileSidebarOpen.value ? 'Close menu' : 'Open menu'}
      aria-expanded={isMobileSidebarOpen.value}
    >
      <div class="transition-all duration-200" aria-hidden="true">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
    </button>
  );
});

