import { component$, Slot, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { uiStore } from '~/store/ui';

export const MainContentWrapper = component$(() => {
  // Use signal for reactive state
  const isDesktopSidebarCollapsed = useSignal(uiStore.isDesktopSidebarCollapsed);

  // Sync with store changes via events
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Initial sync
    isDesktopSidebarCollapsed.value = uiStore.isDesktopSidebarCollapsed;

    // Listen for UI state changes
    const handleUIStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.isDesktopSidebarCollapsed !== undefined) {
        isDesktopSidebarCollapsed.value = customEvent.detail.isDesktopSidebarCollapsed;
      }
      // Also sync directly from store
      isDesktopSidebarCollapsed.value = uiStore.isDesktopSidebarCollapsed;
    };

    window.addEventListener('ui:state-changed', handleUIStateChange);

    return () => {
      window.removeEventListener('ui:state-changed', handleUIStateChange);
    };
  });

  return (
    <main 
      class={`flex-grow flex flex-col bg-black overflow-y-auto transition-all duration-300 ease-in-out ${
        isDesktopSidebarCollapsed.value ? 'md:pl-16' : 'md:pl-80'
      }`}
    >
      <Slot />
    </main>
  );
});
