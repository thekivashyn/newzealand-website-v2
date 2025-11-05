// Types for Qwik stores
export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  grade_meta?: {
    firstName: string;
    lastName: string;
    grade: string;
    completed: boolean;
    completedAt: string;
    update_time?: string;
    device?: {
      userAgent: string;
      ip: string;
      platform: string;
    };
  };
  metadata?: any;
  role?: 'user' | 'admin';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentId?: string;
  relatedQuestions?: string[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentChatId: string | null;
}

export interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedQuestions?: string[];
}

export interface ChatHistory {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  messageCount: number;
  category: string | null;
  mode: string | null;
  subject?: string | null;
  topic?: string | null;
  isActive?: boolean;
}

export interface ChatHistoryUIState {
  chats: ChatHistory[];
  searchQuery: string;
  activeFilter: 'All' | 'Pinned';
  sectionsExpanded: {
    recent: boolean;
    pinned: boolean;
  };
  page: number;
  hasNextPage: boolean;
  loading: boolean;
  initialLoad: boolean;
}

export interface UIState {
  showToolDetails: { [key: string]: boolean };
  editingMessageId: string | null;
  regeneratingMessageId: string | null;
  chatKey: number;
  mode: 'chat' | 'study' | 'study-guide' | null;
  isMobileSidebarOpen: boolean;
  isDesktopSidebarCollapsed: boolean;
  currentChatTerm: string | null;
  currentChatSubject: string | null;
  currentChatTopic: string | null;
  currentChatSubCategory: string | null;
  chatMethod: 'new-chat' | null;
  newChatId: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatHistoryState {
  chats: ChatHistory[];
  isLoading: boolean;
  error: string | null;
  deletingChatIds: string[];
  isFetchingMore: boolean;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

