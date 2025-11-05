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
  
  if (filteredChats.length === 0) {
    return (
      <div class="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div class="text-center text-gray-400 text-sm">
          {props.searchQuery.trim() ? 'No chats found' : 'No chats yet'}
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

