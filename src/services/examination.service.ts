import { server$ } from '@builder.io/qwik-city';
import { logger } from '../lib/logger';

export interface ExamQuestion {
  id: string;
  question: string;
  choices: string[];
  correctAnswer?: number;
  subject: string;
  explanation?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ExaminationRequest {
  context: string;
  conversationHistory?: ConversationMessage[];
  previousTopics?: string[];
  subject?: string | null;
  topic?: string | null;
}

export interface ExaminationResponse {
  questions: ExamQuestion[];
  metadata: {
    difficulty: string;
    subject: string;
    questionCount: number;
    generatedAt: string;
    contextLength: number;
  };
}

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/website';

export const extractExamination = server$(
  async (request: ExaminationRequest, token: string): Promise<ExaminationResponse> => {
    const response = await fetch(`${API_BASE_URL}/examination/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        context: request.context,
        conversationHistory: request.conversationHistory || [],
        previousTopics: request.previousTopics || [],
        subject: request.subject,
        topic: request.topic,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) {
        throw new Error('Invalid request: Please check your input parameters');
      } else if (response.status === 500) {
        throw new Error('Server error: Failed to extract examination questions');
      } else {
        throw new Error(errorData.message || 'Failed to extract examination questions');
      }
    }

    return response.json();
  }
);

// Helper to extract topics from conversation history
export function extractTopicsFromHistory(history: ConversationMessage[]): string[] {
  const topics: Set<string> = new Set();
  
  const topicKeywords = [
    'mathematics', 'math', 'algebra', 'geometry', 'calculus',
    'science', 'physics', 'chemistry', 'biology',
    'history', 'geography', 'literature', 'english',
    'social studies', 'economics', 'government',
    'computer science', 'programming', 'technology'
  ];
  
  history.forEach(message => {
    const content = message.content.toLowerCase();
    topicKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        topics.add(keyword);
      }
    });
  });
  
  return Array.from(topics);
}

// Client-side streaming function for examination
export async function extractExaminationStream(
  request: ExaminationRequest,
  callbacks?: {
    onChunk?: (chunk: string) => void;
    onAiResponseChunk?: (chunk: string) => void;
    onAiResponseComplete?: () => void;
    onComplete?: (questions: ExamQuestion[]) => void;
    onError?: (error: string) => void;
  }
): Promise<void> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/examination/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        context: request.context,
        conversationHistory: request.conversationHistory || [],
        previousTopics: request.previousTopics || [],
        subject: request.subject,
        topic: request.topic,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.type === 'chunk' && callbacks?.onChunk) {
              callbacks.onChunk(parsed.content);
            } else if (parsed.type === 'ai_response_chunk' && callbacks?.onAiResponseChunk) {
              callbacks.onAiResponseChunk(parsed.content);
            } else if (parsed.type === 'ai_response_complete' && callbacks?.onAiResponseComplete) {
              callbacks.onAiResponseComplete();
            } else if (parsed.type === 'complete' && callbacks?.onComplete) {
              callbacks.onComplete(parsed.questions);
            } else if (parsed.type === 'error' && callbacks?.onError) {
              callbacks.onError(parsed.message);
            }
          } catch (e) {
            logger.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } catch (error: any) {
    logger.error('Error in streaming examination:', error);
    if (callbacks?.onError) {
      callbacks.onError(error.message || 'Failed to stream examination questions');
    }
  }
}

