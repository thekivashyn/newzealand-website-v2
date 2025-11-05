import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { uiStore, uiActions } from '~/store/ui';

export const SidebarToggleButton = component$(() => {
  const isCollapsed = useSignal(uiStore.isDesktopSidebarCollapsed);

  useVisibleTask$(() => {
    isCollapsed.value = uiStore.isDesktopSidebarCollapsed;

    const handleUIStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.isDesktopSidebarCollapsed !== undefined) {
        isCollapsed.value = customEvent.detail.isDesktopSidebarCollapsed;
      }
      isCollapsed.value = uiStore.isDesktopSidebarCollapsed;
    };

    window.addEventListener('ui:state-changed', handleUIStateChange);
    return () => {
      window.removeEventListener('ui:state-changed', handleUIStateChange);
    };
  });

  const handleToggle = $(() => {
    uiActions.toggleDesktopSidebar();
  });

  return (
    <button
      onClick$={handleToggle}
      class="hidden md:flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg bg-black hover:bg-gray-800 border border-gray-600/50 hover:border-gray-500 transition-all duration-300 group hover:scale-105 active:scale-95"
      title={isCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-label={isCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!isCollapsed.value}
    >
      <div class={`flex items-center justify-center transition-transform duration-300 ${isCollapsed.value ? 'rotate-0' : 'rotate-180'}`} aria-hidden="true">
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          class="text-gray-400 group-hover:text-gray-200 transition-colors duration-300"
          aria-hidden="true"
        >
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </button>
  );
});

