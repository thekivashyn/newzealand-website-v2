import type { ChatHistoryState, ChatHistory } from './types';

export const chatHistoryStore: ChatHistoryState = {
  chats: [],
  isLoading: false,
  error: null,
  deletingChatIds: [],
  isFetchingMore: false,
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
  },
};

// Helper to dispatch events
const dispatchHistoryChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chat-history:state-changed'));
  }
};

export const chatHistoryActions = {
  setChats: (chats: ChatHistory[]) => {
    chatHistoryStore.chats = chats;
    dispatchHistoryChange();
  },

  addChat: (chat: ChatHistory) => {
    const existingChat = chatHistoryStore.chats.find(c => c.id === chat.id);
    if (!existingChat) {
      chatHistoryStore.chats = [chat, ...chatHistoryStore.chats];
      dispatchHistoryChange();
    }
  },

  deleteChat: (chatId: string) => {
    chatHistoryStore.chats = chatHistoryStore.chats.filter(chat => chat.id !== chatId);
    dispatchHistoryChange();
  },

  optimisticDeleteChat: (chatId: string) => {
    chatHistoryStore.chats = chatHistoryStore.chats.filter(chat => chat.id !== chatId);
    if (!chatHistoryStore.deletingChatIds.includes(chatId)) {
      chatHistoryStore.deletingChatIds = [...chatHistoryStore.deletingChatIds, chatId];
    }
    dispatchHistoryChange();
  },

  rollbackDeleteChat: (chat: ChatHistory) => {
    chatHistoryStore.chats = [chat, ...chatHistoryStore.chats];
    chatHistoryStore.deletingChatIds = chatHistoryStore.deletingChatIds.filter(id => id !== chat.id);
    dispatchHistoryChange();
  },

  confirmDeleteChat: (chatId: string) => {
    chatHistoryStore.deletingChatIds = chatHistoryStore.deletingChatIds.filter(id => id !== chatId);
    chatHistoryStore.pagination.totalItems = Math.max(0, (chatHistoryStore.pagination.totalItems || 0) - 1);
    dispatchHistoryChange();
  },

  updateChatMessageCount: (chatId: string, count: number) => {
    const chat = chatHistoryStore.chats.find(c => c.id === chatId);
    if (chat) {
      chat.messageCount = count;
      dispatchHistoryChange();
    }
  },

  setActiveChat: (chatId: string | null) => {
    chatHistoryStore.chats.forEach(chat => {
      chat.isActive = chat.id === chatId;
    });
    dispatchHistoryChange();
  },

  setLoading: (loading: boolean) => {
    chatHistoryStore.isLoading = loading;
    dispatchHistoryChange();
  },

  setFetchingMore: (fetching: boolean) => {
    chatHistoryStore.isFetchingMore = fetching;
    dispatchHistoryChange();
  },

  setError: (error: string | null) => {
    chatHistoryStore.error = error;
    dispatchHistoryChange();
  },

  setPagination: (pagination: ChatHistoryState['pagination']) => {
    chatHistoryStore.pagination = pagination;
    dispatchHistoryChange();
  },

  appendChats: (chats: ChatHistory[]) => {
    const existingIds = new Set(chatHistoryStore.chats.map(chat => chat.id));
    const newChats = chats.filter(chat => !existingIds.has(chat.id));
    chatHistoryStore.chats = [...chatHistoryStore.chats, ...newChats];
    dispatchHistoryChange();
  },
};

