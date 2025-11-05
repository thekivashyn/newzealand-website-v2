import type { ChatHistory } from '~/store/types';
import { getAuthToken } from '~/lib/api';

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/website';

interface FetchChatHistoryResponse {
  data: ChatHistory[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

// Client-side fetch for chat history (can access localStorage)
export async function fetchChatHistory(options: { page?: number; limit?: number } = {}): Promise<FetchChatHistoryResponse> {
    const { page = 1, limit = 20 } = options;
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }
    
    const response = await fetch(
      `${API_BASE_URL}/history?page=${page}&limit=${limit}`,
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
      throw new Error(`HTTP ${response.status}: Failed to fetch chat history`);
    }

    return response.json();
  }

export async function deleteChatHistory(chatId: string): Promise<void> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const response = await fetch(`${API_BASE_URL}/history/${chatId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete chat');
  }
}

