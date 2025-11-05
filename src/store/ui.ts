import type { UIState } from './types';

// Load mode from localStorage
function loadModeFromStorage(): 'chat' | 'study' | 'study-guide' | null {
  if (typeof window === 'undefined') return null;
  const savedMode = localStorage.getItem('chatMode');
  if (savedMode === 'chat' || savedMode === 'study' || savedMode === 'study-guide') {
    return savedMode;
  }
  return null;
}

// Save mode to localStorage
function saveModeToStorage(mode: 'chat' | 'study' | 'study-guide' | null) {
  if (typeof window === 'undefined') return;
  if (mode) {
    localStorage.setItem('chatMode', mode);
  } else {
    localStorage.removeItem('chatMode');
  }
}

// Load sidebar collapse state from localStorage
function loadSidebarCollapsedFromStorage(): boolean {
  if (typeof window === 'undefined') return true;
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState === 'true' || savedState === 'false') {
    return savedState === 'true';
  }
  return true; // Default to collapsed
}

// Save sidebar collapse state to localStorage
function saveSidebarCollapsedToStorage(collapsed: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sidebarCollapsed', collapsed.toString());
}

export const uiStore: UIState = {
  showToolDetails: {},
  editingMessageId: null,
  regeneratingMessageId: null,
  chatKey: 0,
  mode: loadModeFromStorage(),
  isMobileSidebarOpen: false,
  isDesktopSidebarCollapsed: loadSidebarCollapsedFromStorage(),
  currentChatTerm: null,
  currentChatSubject: null,
  currentChatTopic: null,
  currentChatSubCategory: null,
  chatMethod: null,
  newChatId: null,
};

export const uiActions = {
  toggleToolDetails: (key: string) => {
    uiStore.showToolDetails = {
      ...uiStore.showToolDetails,
      [key]: !uiStore.showToolDetails[key],
    };
  },

  setEditingMessageId: (messageId: string | null) => {
    uiStore.editingMessageId = messageId;
  },

  setRegeneratingMessageId: (messageId: string | null) => {
    uiStore.regeneratingMessageId = messageId;
  },

  setMode: (mode: 'chat' | 'study' | 'study-guide') => {
    uiStore.mode = mode;
    saveModeToStorage(mode);
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { mode } 
      }));
    }
  },

  clearMode: () => {
    uiStore.mode = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatMode');
    }
  },

  triggerNewChat: () => {
    uiStore.chatKey++;
  },

  toggleMobileSidebar: () => {
    uiStore.isMobileSidebarOpen = !uiStore.isMobileSidebarOpen;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { isMobileSidebarOpen: uiStore.isMobileSidebarOpen } 
      }));
    }
  },

  setMobileSidebarOpen: (open: boolean) => {
    uiStore.isMobileSidebarOpen = open;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { isMobileSidebarOpen: open } 
      }));
    }
  },

  toggleDesktopSidebar: () => {
    uiStore.isDesktopSidebarCollapsed = !uiStore.isDesktopSidebarCollapsed;
    saveSidebarCollapsedToStorage(uiStore.isDesktopSidebarCollapsed);
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { isDesktopSidebarCollapsed: uiStore.isDesktopSidebarCollapsed } 
      }));
    }
  },

  setDesktopSidebarCollapsed: (collapsed: boolean) => {
    uiStore.isDesktopSidebarCollapsed = collapsed;
    saveSidebarCollapsedToStorage(collapsed);
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { isDesktopSidebarCollapsed: collapsed } 
      }));
    }
  },

  setCurrentChatContext: (context: {
    term?: string | null;
    subject: string | null;
    topic: string | null;
    subCategory?: string | null;
  }) => {
    if (context.term !== undefined) uiStore.currentChatTerm = context.term;
    uiStore.currentChatSubject = context.subject;
    uiStore.currentChatTopic = context.topic;
    uiStore.currentChatSubCategory = context.subCategory ?? null;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { 
          currentChatTerm: uiStore.currentChatTerm,
          currentChatSubject: uiStore.currentChatSubject,
          currentChatTopic: uiStore.currentChatTopic,
          currentChatSubCategory: uiStore.currentChatSubCategory,
        } 
      }));
    }
  },

  clearCurrentChatContext: () => {
    uiStore.currentChatTerm = null;
    uiStore.currentChatSubject = null;
    uiStore.currentChatTopic = null;
    uiStore.currentChatSubCategory = null;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { 
          currentChatTerm: null,
          currentChatSubject: null,
          currentChatTopic: null,
          currentChatSubCategory: null,
        } 
      }));
    }
  },

  setChatMethod: (method: 'new-chat' | null) => {
    uiStore.chatMethod = method;
    
    // Dispatch custom event for reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ui:state-changed', { 
        detail: { chatMethod: method } 
      }));
    }
  },

  setNewChatId: (chatId: string | null) => {
    uiStore.newChatId = chatId;
  },

  generateNewChatId: () => {
    uiStore.newChatId = crypto.randomUUID();
  },

  clearNewChatId: () => {
    uiStore.newChatId = null;
  },

  updateNewChatIdOnSubmit: () => {
    uiStore.newChatId = crypto.randomUUID();
    uiStore.chatMethod = null;
  },
};

