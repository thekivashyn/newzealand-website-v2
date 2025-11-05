import type { ChatState, ChatMessage } from './types';

export const chatStore: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  currentChatId: null,
};

export const chatActions = {
  addMessage: (message: ChatMessage) => {
    chatStore.messages = [...chatStore.messages, { ...message, timestamp: new Date().toISOString() }];
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat:state-changed', { 
        detail: { messages: chatStore.messages } 
      }));
    }
  },

  setMessages: (messages: ChatMessage[]) => {
    chatStore.messages = messages;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat:state-changed', { 
        detail: { messages } 
      }));
    }
  },

  setLoading: (loading: boolean) => {
    chatStore.isLoading = loading;
  },

  setError: (error: string | null) => {
    chatStore.error = error;
  },

  setCurrentChatId: (chatId: string | null) => {
    chatStore.currentChatId = chatId;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat:state-changed', { 
        detail: { currentChatId: chatId } 
      }));
    }
  },

  clearMessages: () => {
    chatStore.messages = [];
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat:state-changed', { 
        detail: { messages: [] } 
      }));
    }
  },

  clearChatOnDelete: (chatId: string) => {
    if (chatStore.currentChatId === chatId) {
      chatStore.messages = [];
      chatStore.currentChatId = null;
      chatStore.error = null;
    }
  },
};

