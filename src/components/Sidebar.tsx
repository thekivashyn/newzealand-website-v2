import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { uiStore, uiActions } from '~/store/ui';
import { chatActions } from '~/store/chat';
import { useNavigate } from '@builder.io/qwik-city';
import { authStore } from '~/store/auth';
import { UserAvatarPopover } from './sidebar/UserAvatarPopover';
import { UserProfile } from './sidebar/UserProfile';
import { SidebarToggleButton } from './sidebar/SidebarToggleButton';
import { ChatList } from './sidebar/ChatList';

export const Sidebar = component$(() => {
  const navigate = useNavigate();
  
  // Use signals for reactive state
  const isDesktopSidebarCollapsed = useSignal(uiStore.isDesktopSidebarCollapsed);
  const isMobileSidebarOpen = useSignal(uiStore.isMobileSidebarOpen);
  const authUser = useSignal(authStore.user);
  const searchQuery = useSignal('');

  // Sync with store changes via events
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Initial sync
    isDesktopSidebarCollapsed.value = uiStore.isDesktopSidebarCollapsed;
    isMobileSidebarOpen.value = uiStore.isMobileSidebarOpen;
    authUser.value = authStore.user;

    // Listen for UI state changes
    const handleUIStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.isDesktopSidebarCollapsed !== undefined) {
        isDesktopSidebarCollapsed.value = customEvent.detail.isDesktopSidebarCollapsed;
      }
      if (customEvent.detail.isMobileSidebarOpen !== undefined) {
        isMobileSidebarOpen.value = customEvent.detail.isMobileSidebarOpen;
      }
      // Also sync directly from store
      isDesktopSidebarCollapsed.value = uiStore.isDesktopSidebarCollapsed;
      isMobileSidebarOpen.value = uiStore.isMobileSidebarOpen;
    };

    // Listen for auth state changes
    const handleAuthStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.user !== undefined) {
        authUser.value = customEvent.detail.user;
      }
      // Also sync directly from store
      authUser.value = authStore.user;
    };

    window.addEventListener('ui:state-changed', handleUIStateChange);
    window.addEventListener('auth:state-changed', handleAuthStateChange);

    return () => {
      window.removeEventListener('ui:state-changed', handleUIStateChange);
      window.removeEventListener('auth:state-changed', handleAuthStateChange);
    };
  });

  const handleNewChat = $(() => {
    searchQuery.value = '';
    chatActions.clearMessages();
    chatActions.setCurrentChatId(null);
    uiActions.clearCurrentChatContext();
    uiActions.triggerNewChat();
    
    // Close mobile sidebar when creating new chat
    if (isMobileSidebarOpen.value) {
      uiActions.setMobileSidebarOpen(false);
    }
    
    navigate('/');
  });

  const handleToggleSidebar = $(() => {
    uiActions.toggleDesktopSidebar();
  });

  const handleGoHome = $(() => {
    chatActions.clearMessages();
    chatActions.setCurrentChatId(null);
    navigate('/');
  });

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        class={`fixed inset-y-0 left-0 z-10 hidden md:flex border-r border-stone-700/30 bg-black text-gray-100 transition-all duration-300 ease-in-out ${
          isDesktopSidebarCollapsed.value ? 'w-16' : 'w-80'
        }`}
      >
        <div class="flex h-full w-full flex-col overflow-y-auto overflow-x-visible">
          {/* Header */}
          <div class="flex-shrink-0 p-3 bg-black relative">
            {/* Collapsed Mode - Toggle Button and Quick Action Icons */}
            {isDesktopSidebarCollapsed.value && (
              <div class="flex flex-col items-center space-y-3 mb-4 transition-all duration-300 ease-in-out">
                <SidebarToggleButton />

                {/* Quick Action Icons */}
                <div class="flex flex-col space-y-2">
                  {/* History Icon */}
                  <button
                    onClick$={handleToggleSidebar}
                    class="group relative flex items-center justify-center w-11 h-11 rounded-lg bg-transparent hover:bg-purple-500 hover:border-purple-400/70 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                    title="Expand Sidebar"
                    aria-label="Expand Sidebar"
                  >
                    <svg class="h-5 w-5 text-white group-hover:text-white/90 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Expanded Mode - Logo, Title, and Toggle Button */}
            {!isDesktopSidebarCollapsed.value && (
              <div class="transition-all duration-300 ease-in-out overflow-hidden">
                <div class="flex items-center justify-between mb-4 pb-4 border-b border-stone-600/50">
                  {/* Logo and Title Section */}
                  <div class="flex items-center gap-3">
                    {/* Logo */}
                    <div
                      class="relative cursor-pointer hover:scale-105 transition-transform duration-200 bg-white rounded-full"
                      onClick$={handleGoHome}
                      tabIndex={0}
                      role="button"
                      aria-label="Go to Home"
                      title="Go to Home"
                    >
                      <img
                        src="/flag.png"
                        alt="Ministry of education"
                        class="w-8 h-8 object-contain flex-shrink-0 rounded-full border-2 border-stone-500 transition-all duration-200"
                      />
                    </div>

                    {/* Title and Subtitle */}
                    <div
                      class="flex flex-col min-w-0 cursor-pointer overflow-hidden"
                      onClick$={handleGoHome}
                      tabIndex={0}
                      role="button"
                      aria-label="Go to Home"
                      title="Go to Home"
                    >
                      <h1 class="text-sm font-black leading-tight tracking-wider hover:tracking-[0.15em] transition-all duration-300 truncate">
                        Ministry Of Education
                      </h1>
                      <p class="text-xs leading-tight font-medium tracking-wide hover:tracking-wider transition-all duration-300 truncate">
                        Your Study Companion
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <SidebarToggleButton />
                </div>
              </div>
            )}

            {/* New Chat Button and Search - Hide when collapsed */}
            {!isDesktopSidebarCollapsed.value && (
              <div class="transition-all duration-300 ease-in-out overflow-hidden">
                {/* Mode Selection Buttons */}
                <div class="flex gap-2 mb-4">
                  {/* New Study Guide Mode */}
                  <button
                    onClick$={handleNewChat}
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-150 transform border-b-4 border-red-700 hover:border-red-800 active:border-b-2 active:translate-y-1 cursor-pointer"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15" />
                    </svg>
                    <span class="truncate">New Study Guide</span>
                  </button>
                </div>

                {/* Search Section */}
                <div class="relative group">
                  <label for="chat-search-input-desktop" class="sr-only">
                    Search chats by title, subject, or topic
                  </label>
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10" aria-hidden="true">
                    <svg class="h-4 w-4 text-gray-400 group-focus-within:text-amber-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="chat-search-input-desktop"
                    type="text"
                    placeholder="Search by title, subject, or topic..."
                    value={searchQuery.value}
                    onInput$={(e) => searchQuery.value = (e.target as HTMLInputElement).value}
                    class="w-full bg-stone-800/60 border text-xs border-stone-700/50 rounded-lg pl-10 pr-10 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-stone-800/80 transition-all duration-200 shadow-inner"
                    aria-label="Search chats by title, subject, or topic"
                  />
                  <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                  {searchQuery.value && (
                    <button
                      onClick$={() => searchQuery.value = ''}
                      class="absolute inset-y-0 right-0 pr-3 flex items-center z-10 group/clear cursor-pointer"
                      aria-label="Clear search"
                    >
                      <svg class="h-4 w-4 text-gray-500 hover:text-gray-300 group-hover/clear:text-red-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chat List */}
          {!isDesktopSidebarCollapsed.value && (
            <div class="flex-1 min-h-0 overflow-hidden">
              <ChatList searchQuery={searchQuery.value} />
            </div>
          )}

          {/* User Profile Section - Always at bottom */}
          <div class="flex-shrink-0 mt-auto">
            {/* Collapsed state - Only show avatar */}
            {isDesktopSidebarCollapsed.value && authUser.value && (
              <div class="p-3 flex items-center justify-center bg-gradient-to-t from-gray-900/90 to-transparent">
                <UserAvatarPopover>
                  <div class="relative flex-shrink-0 group cursor-pointer">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 ring-2 ring-amber-400/30 group-hover:ring-amber-400/50 transition-all duration-300 shadow-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div class="absolute inset-0 w-10 h-10 bg-amber-400/10 rounded-full blur-sm"></div>
                  </div>
                </UserAvatarPopover>
              </div>
            )}

            {/* Expanded state - Full user profile */}
            {!isDesktopSidebarCollapsed.value && (
              <div class="transition-all duration-300 ease-in-out overflow-hidden bg-gradient-to-t from-gray-900/90 to-transparent">
                <UserProfile />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        class={`fixed inset-0 z-[55] bg-black/50 md:hidden cursor-pointer transition-opacity duration-300 ease-in-out ${
          isMobileSidebarOpen.value ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick$={() => uiActions.setMobileSidebarOpen(false)}
      />
      <div
        class={`fixed inset-y-0 left-0 z-[60] w-80 border-r border-stone-700/30 md:hidden bg-black text-gray-100 transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen.value ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div class="flex h-full w-full flex-col">
          <div class="flex-shrink-0 p-3 bg-black">
            {/* Premium Ministry Of Education Header */}
            <div class="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10 relative">
              <div class="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/30 to-transparent"></div>
              
              {/* Logo and Title - Clickable */}
              <div 
                class="flex items-center gap-3 flex-1 cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-all duration-200 backdrop-blur-sm"
                onClick$={handleGoHome}
                tabIndex={0}
                role="button"
                aria-label="Go to Home"
                title="Go to Home"
              >
                <div class="relative">
                  <img
                    src="/flag.png"
                    alt="Ministry Of Education Logo"
                    class="w-8 h-8 object-contain flex-shrink-0 rounded-full ring-2 ring-[#14B8A6]/30 shadow-lg hover:ring-[#14B8A6]/50 transition-all duration-300"
                  />
                  <div class="absolute inset-0 w-8 h-8 bg-[#14B8A6]/10 rounded-full blur-sm"></div>
                </div>
                <div class="flex flex-col flex-1 min-w-0">
                  <h1 class="text-xs sm:text-sm font-black text-transparent bg-gradient-to-r from-white via-[#14B8A6] to-white bg-clip-text leading-tight tracking-wide drop-shadow-sm">
                    Ministry Of Education
                  </h1>
                  <p class="text-[10px] sm:text-xs text-gray-300/90 leading-tight font-semibold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                    Your Study Companion
                  </p>
                </div>
              </div>

              {/* Close Button - Only visible on mobile */}
              <button
                onClick$={(e) => {
                  e.stopPropagation();
                  uiActions.setMobileSidebarOpen(false);
                }}
                class="md:hidden flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white group"
                title="Close sidebar"
                aria-label="Close sidebar"
              >
                <svg 
                  class="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mode Selection Buttons */}
            <div class="flex gap-3 mb-4">
              {/* New Study Guide Mode */}
              <button
                onClick$={handleNewChat}
                class="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-150 transform border-b-4 border-red-700 hover:border-red-800 active:border-b-2 active:translate-y-1 cursor-pointer"
                aria-label="Create new study guide"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15" />
                </svg>
                <span class="truncate">New Study Guide</span>
              </button>
            </div>

            {/* Search Section */}
            <div class="relative group">
              <label for="chat-search-input" class="sr-only">
                Search chats by title, subject, or topic
              </label>
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10" aria-hidden="true">
                <svg class="h-4 w-4 text-gray-400 group-focus-within:text-amber-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="chat-search-input"
                type="text"
                placeholder="Search by title, subject, or topic..."
                value={searchQuery.value}
                onInput$={(e) => searchQuery.value = (e.target as HTMLInputElement).value}
                class="w-full bg-stone-800/60 border text-xs border-stone-700/50 rounded-lg pl-10 pr-10 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-stone-800/80 transition-all duration-200 shadow-inner"
                aria-label="Search chats by title, subject, or topic"
              />
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              {searchQuery.value && (
                <button
                  onClick$={() => searchQuery.value = ''}
                  class="absolute inset-y-0 right-0 pr-3 flex items-center z-10 group/clear cursor-pointer"
                  aria-label="Clear search"
                >
                  <svg class="h-4 w-4 text-gray-500 hover:text-gray-300 group-hover/clear:text-red-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div class="flex-1 min-h-0 overflow-hidden">
            <ChatList searchQuery={searchQuery.value} />
          </div>
          <div class="flex-shrink-0 bg-black">
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  );
});
