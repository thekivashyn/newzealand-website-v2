// Composable for chat history
import { useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { chatHistoryStore, chatHistoryActions } from '~/store/chatHistory';
import { fetchChatHistory, deleteChatHistory } from '../services/history.service';

export const useChatHistory = () => {
  const chats = useSignal(chatHistoryStore.chats);
  const isLoading = useSignal(chatHistoryStore.isLoading);
  const error = useSignal(chatHistoryStore.error);
  const pagination = useSignal(chatHistoryStore.pagination);
  const isFetchingMore = useSignal(chatHistoryStore.isFetchingMore);

  // Sync store changes
  useVisibleTask$(() => {
    chats.value = chatHistoryStore.chats;
    isLoading.value = chatHistoryStore.isLoading;
    error.value = chatHistoryStore.error;
    pagination.value = chatHistoryStore.pagination;
    isFetchingMore.value = chatHistoryStore.isFetchingMore;

    const handleHistoryChange = () => {
      chats.value = chatHistoryStore.chats;
      isLoading.value = chatHistoryStore.isLoading;
      error.value = chatHistoryStore.error;
      pagination.value = chatHistoryStore.pagination;
      isFetchingMore.value = chatHistoryStore.isFetchingMore;
    };

    window.addEventListener('chat-history:state-changed', handleHistoryChange);

    return () => {
      window.removeEventListener('chat-history:state-changed', handleHistoryChange);
    };
  });

  const loadChatHistory = async (options?: { page?: number; limit?: number }) => {
    chatHistoryActions.setLoading(true);
    chatHistoryActions.setError(null);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
    }
    
    try {
      const response = await fetchChatHistory(options || {});
      chatHistoryActions.setChats(response.data);
      chatHistoryActions.setPagination(response.pagination);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
      }
    } catch (error: any) {
      chatHistoryActions.setError(error.message || 'Failed to load chat history');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
      }
    } finally {
      chatHistoryActions.setLoading(false);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
      }
    }
  };

  const loadMoreChatHistory = async () => {
    if (!pagination.value.hasNextPage || isFetchingMore.value) return;

    chatHistoryActions.setFetchingMore(true);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
    }
    
    try {
      const response = await fetchChatHistory({
        page: pagination.value.page + 1,
        limit: pagination.value.limit,
      });
      chatHistoryActions.appendChats(response.data);
      chatHistoryActions.setPagination(response.pagination);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
      }
    } catch (error: any) {
      chatHistoryActions.setError(error.message || 'Failed to load more chats');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
      }
    } finally {
      chatHistoryActions.setFetchingMore(false);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
      }
    }
  };

  const deleteChat = async (chatId: string) => {
    chatHistoryActions.optimisticDeleteChat(chatId);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
    }
    
    try {
      await deleteChatHistory(chatId);
      chatHistoryActions.confirmDeleteChat(chatId);
      
      // Refresh list after deletion
      await loadChatHistory({ page: 1, limit: pagination.value.limit });
    } catch (error: any) {
      chatHistoryActions.setError(error.message || 'Failed to delete chat');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
      }
    }
  };

  return {
    get chats() { return chats.value; },
    get isLoading() { return isLoading.value; },
    get error() { return error.value; },
    get pagination() { return pagination.value; },
    get isFetchingMore() { return isFetchingMore.value; },
    loadChatHistory,
    loadMoreChatHistory,
    deleteChat,
  };
};

