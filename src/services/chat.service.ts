import { server$ } from '@builder.io/qwik-city';
import type { ChatMessage } from '~/store/types';

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/website';

interface StoreMessagesParams {
  messages: ChatMessage[];
  chatId: string;
  subject?: string | null;
  topic?: string | null;
  title?: string | null;
}

interface StoreMessagesResponse {
  success: boolean;
  message: string;
  data?: {
    chatId: string;
    messageIds: string[];
    count: number;
  };
  error?: string;
}

// Store messages without getting AI response
export const storeMessageOnly = server$(
  async (params: StoreMessagesParams, token: string): Promise<StoreMessagesResponse> => {
    const response = await fetch(`${API_BASE_URL}/chat/store-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to store messages');
    }

    return response.json();
  }
);

// Chat streaming endpoint (client-side for streaming)
export async function chatStream(
  messages: ChatMessage[],
  chatId: string,
  options?: {
    subject?: string | null;
    topic?: string | null;
    term?: string | null;
    subCategory?: string | null;
    mode?: string;
  }
): Promise<Response> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  // Format request body to match backend API structure
  // Backend expects: { messages: [], data: { uuid, mode, subject, topic, agent } }
  const requestBody = {
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    data: {
      uuid: chatId,
      mode: options?.mode || 'STUDY',
      subject: options?.subject || null,
      topic: options?.topic || null,
      agent: null,
    },
  };

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to send message');
  }

  return response;
}

// Client-side version of storeMessageOnly (for use in client components)
export async function storeMessageOnlyClient(
  params: StoreMessagesParams
): Promise<StoreMessagesResponse> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE_URL}/chat/store-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to store messages');
  }

  return response.json();
}

// Fetch chat history by ID
export const fetchChatById = server$(
  async (chatId: string, token: string): Promise<{ messages: ChatMessage[] }> => {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }

    return response.json();
  }
);

