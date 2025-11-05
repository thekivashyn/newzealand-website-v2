import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { useChatHistory } from '~/composables/useChatHistory';
import { chatStore } from '~/store/chat';
import { chatHistoryStore } from '~/store/chatHistory';
import { ChatItem } from './ChatItem';

interface ChatListProps {
  searchQuery: string;
}

export const ChatList = component$<ChatListProps>((props) => {
  const { chats, isLoading, error, pagination, loadChatHistory, loadMoreChatHistory } = useChatHistory();
  const activeChatId = useSignal(chatStore.currentChatId);
  const chatsSignal = useSignal(chats);
  const isLoadingSignal = useSignal(isLoading);
  const errorSignal = useSignal(error);
  const paginationSignal = useSignal(pagination);
  const simpleBarRef = useSignal<HTMLDivElement>();
  
  // Sync active chat ID
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    activeChatId.value = chatStore.currentChatId;
    
    const handleChatStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.currentChatId !== undefined) {
        activeChatId.value = customEvent.detail.currentChatId;
      }
      activeChatId.value = chatStore.currentChatId;
    };
    
    window.addEventListener('chat:state-changed', handleChatStateChange);
    
    return () => {
      window.removeEventListener('chat:state-changed', handleChatStateChange);
    };
  });
  
  // Sync chat history state
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const updateState = () => {
      chatsSignal.value = chatHistoryStore.chats;
      isLoadingSignal.value = chatHistoryStore.isLoading;
      errorSignal.value = chatHistoryStore.error;
      paginationSignal.value = chatHistoryStore.pagination;
    };
    
    updateState();
    
    const handleHistoryChange = () => {
      updateState();
    };
    
    window.addEventListener('chat-history:state-changed', handleHistoryChange);
    
    return () => {
      window.removeEventListener('chat-history:state-changed', handleHistoryChange);
    };
  });
  
  // Fetch chat history on mount
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    loadChatHistory({ page: 1, limit: 20 });
  });
  
  // Filter chats based on search query - reactive calculation
  // Access props.searchQuery directly in render body to ensure Qwik tracks it
  const filteredChats = (() => {
    const query = props.searchQuery;
    const chats = chatsSignal.value;
    
    if (!query.trim()) {
      return chats;
    }
    
    const queryLower = query.toLowerCase().trim();
    return chats.filter(chat => {
      const titleMatch = chat.title?.toLowerCase().includes(queryLower) || false;
      const subjectMatch = chat.subject?.toLowerCase().includes(queryLower) || false;
      return titleMatch || subjectMatch;
    });
  })();
  
  // Handle scroll to load more
  const handleScroll$ = $((event: Event) => {
    const target = event.target as HTMLDivElement;
    if (!target) return;
    
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    // Load more when near bottom (within 200px)
    if (scrollHeight - scrollTop - clientHeight < 200 && paginationSignal.value.hasNextPage && !isLoadingSignal.value) {
      loadMoreChatHistory();
    }
  });
  
  if (isLoadingSignal.value && chatsSignal.value.length === 0) {
    return (
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} class="animate-pulse">
              <div class="h-16 bg-gray-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (errorSignal.value) {
    return (
      <div class="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div class="text-center text-gray-400 text-sm">
          <p>Failed to load chat history</p>
          <button
            onClick$={() => loadChatHistory({ page: 1, limit: 20 })}
            class="mt-2 text-purple-400 hover:text-purple-300 text-xs underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (filteredChats.length === 0 && !isLoadingSignal.value) {
    const isSearching = props.searchQuery.trim().length > 0;
    
    return (
      <div class="flex-1 overflow-y-auto relative">
        <div class="text-center py-12 px-4 transition-all duration-300 ease-out relative">
          {/* ✨ Beautiful Icon Container with Animation */}
          <div class="relative mx-auto mb-6 w-20 h-20 transition-all duration-300 ease-out">
            {/* Background Gradient Circle */}
            <div class="absolute inset-0 bg-gradient-to-br from-[#fac84f]/20 via-[#f7b731]/20 to-[#f39c12]/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* Main Icon Container */}
            <div class="relative w-20 h-20 bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-[#fac84f]/30 shadow-lg">
              {isSearching ? (
                <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              ) : (
                <svg class="w-10 h-10 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>

            {/* Floating Decorative Icons */}
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#14B8A6]/30 to-[#0D9488]/30 rounded-full flex items-center justify-center border border-[#14B8A6]/40">
              <svg class="w-3 h-3 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>

            <div class="absolute -bottom-1 -left-2 w-5 h-5 bg-gradient-to-br from-[#14B8A6]/30 to-[#0D9488]/30 rounded-full flex items-center justify-center border border-[#14B8A6]/40">
              <svg class="w-2.5 h-2.5 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* ✨ Enhanced Text Content */}
          <div class="space-y-3">
            <h3 class="text-base font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              {isSearching ? "No matches found" : "Ready to explore?"}
            </h3>
            
            <p class="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
              {isSearching 
                ? `No chats match "${props.searchQuery}". Try a different search term or start a new conversation.`
                : "Your conversation history will appear here. Start chatting to see your amazing discussions!"
              }
            </p>
            
            {!isSearching && (
              <div class="pt-4">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#14B8A6]/10 to-[#0D9488]/10 rounded-full border border-[#14B8A6]/20 backdrop-blur-sm">
                  <svg class="w-4 h-4 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-xs text-[#14B8A6] font-medium">New Chat</span>
                </div>
              </div>
            )}
          </div>

          {/* ✨ Subtle Background Pattern */}
          <div class="absolute inset-0 opacity-15 pointer-events-none">
            <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-[#14B8A6] rounded-full animate-pulse"></div>
            <div 
              class="absolute top-3/4 right-1/3 w-1 h-1 bg-[#0D9488] rounded-full animate-pulse" 
              style={{ animationDelay: '700ms' }}
            ></div>
            <div 
              class="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-[#0A6B62] rounded-full animate-pulse" 
              style={{ animationDelay: '1000ms' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      class="flex-1 overflow-y-auto"
      ref={simpleBarRef}
      onScroll$={handleScroll$}
    >
      <div class="py-2">
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId.value}
          />
        ))}
        
        {/* Loading more indicator */}
        {isLoadingSignal.value && chatsSignal.value.length > 0 && (
          <div class="flex items-center justify-center py-4">
            <div class="flex items-center gap-2">
              <div class="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs text-gray-400">Loading more...</span>
            </div>
          </div>
        )}
        
        {/* End of list indicator */}
        {!paginationSignal.value.hasNextPage && filteredChats.length > 10 && (
          <div class="flex items-center justify-center py-4 text-xs text-gray-500">
            <span>No more chats</span>
          </div>
        )}
      </div>
    </div>
  );
});

