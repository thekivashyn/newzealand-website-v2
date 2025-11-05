// Composable for chat streaming
import { useSignal, $ } from '@builder.io/qwik';
import { chatActions } from '~/store/chat';
import { chatStream } from '../services/chat.service';
import type { ChatMessage } from '~/store/types';

export const useChatStreaming = () => {
  const isStreaming = useSignal(false);
  const streamingMessage = useSignal<ChatMessage | null>(null);

  const startStreaming = $(async (
    messages: ChatMessage[],
    chatId: string,
    options?: {
      subject?: string | null;
      topic?: string | null;
      term?: string | null;
      subCategory?: string | null;
    }
  ) => {
    isStreaming.value = true;
    
    try {
      const response = await chatStream(messages, chatId, options);
      
      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let responseId: string | null = null;
      let streamComplete = false;

      // Initialize streaming message (will be set on first chunk)
      let streamingMsg: ChatMessage | null = null;

      while (!streamComplete) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          // Skip empty lines
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) {
            continue;
          }

          const data = trimmed.slice(6);
            
          // Handle [DONE] signal
            if (data === '[DONE]') {
            streamComplete = true;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
            // Handle OpenAI streaming format: { choices: [{ delta: { content: "..." } }] }
            if (parsed.choices && Array.isArray(parsed.choices) && parsed.choices.length > 0) {
              const choice = parsed.choices[0];
              
              // Store response ID from first chunk
              if (!responseId && parsed.id) {
                responseId = parsed.id;
              }
              
              // Initialize message on first chunk (even if content is empty)
              if (!streamingMsg) {
                streamingMsg = {
                  id: responseId || crypto.randomUUID(),
                  role: 'assistant',
                  content: '',
                  timestamp: new Date().toISOString(),
                };
                streamingMessage.value = streamingMsg;
              }
              
              // Update content from delta
              if (choice.delta && choice.delta.content) {
                const content = choice.delta.content;
                fullContent += content;
                
                // Update streaming message with accumulated content
                if (streamingMsg) {
                  streamingMessage.value = {
                    ...streamingMsg,
                    content: fullContent,
                  };
                }
              }
              
              // Handle finish_reason (streaming complete)
              if (choice.finish_reason && choice.finish_reason !== null && choice.finish_reason !== 'null') {
                streamComplete = true;
                break;
              }
            }
          } catch (parseError) {
            // Invalid JSON, skip this line
            console.warn('Failed to parse SSE data:', parseError, data.substring(0, 100));
            continue;
          }
        }
      }
      
      // Cleanup reader
      reader.releaseLock();
      
      // Ensure final message is added when streaming completes
      if (streamingMessage.value && fullContent) {
        const finalMessage: ChatMessage = {
          ...streamingMessage.value,
          content: fullContent,
        };
        chatActions.addMessage(finalMessage);
        streamingMessage.value = null;
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
      console.error('Streaming error:', error);
      streamingMessage.value = null;
      throw error;
      }
    } finally {
      isStreaming.value = false;
    }
  });

  const stopStreaming = $(() => {
    // Reset streaming state
    // Note: Reader will be cleaned up automatically when component unmounts or stream completes
    isStreaming.value = false;
    streamingMessage.value = null;
  });

  return {
    isStreaming,
    streamingMessage,
    startStreaming,
    stopStreaming,
  };
};

