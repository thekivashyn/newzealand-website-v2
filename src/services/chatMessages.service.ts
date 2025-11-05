import type { ChatMessage } from '~/store/types';
import { getAuthToken } from '~/lib/api';

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/website';

interface FetchChatMessagesResponse {
  messages: ChatMessage[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

/**
 * Fetch chat messages for a specific chat ID
 * Backend returns messages in reverse order (latest first), so we reverse them
 */
export async function fetchChatMessages(
  chatId: string,
  options: { page?: number; limit?: number } = {}
): Promise<FetchChatMessagesResponse> {
  const { page = 1, limit = 15 } = options;
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const response = await fetch(
    `${API_BASE_URL}/history/${chatId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      // Chat not found - return empty messages
      return {
        messages: [],
        pagination: {
          page: 1,
          limit,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
        },
      };
    }
    throw new Error(`HTTP ${response.status}: Failed to fetch chat messages`);
  }

  const data = await response.json();
  
  // Ensure all messages have id
  const messagesWithId = (data.messages || []).map((msg: any, index: number) => ({
    ...msg,
    id: msg.id || `msg-${chatId}-${index}-${Date.now()}`,
    role: msg.role || 'user',
    content: msg.content || '',
    timestamp: msg.timestamp || new Date().toISOString(),
  }));

  // Backend returns latest first, reverse to show oldest first
  const reversedMessages = [...messagesWithId].reverse();

  return {
    messages: reversedMessages,
    pagination: data.pagination || {
      page: 1,
      limit,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
    },
  };
}

