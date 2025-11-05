// Composable for preset response streaming (fake streaming with animation)
import { useSignal, $ } from '@builder.io/qwik';
import { chatActions, chatStore } from '~/store/chat';
import { uiStore } from '~/store/ui';
import { storeMessageOnlyClient } from '~/services/chat.service';
import type { ChatMessage } from '~/store/types';

interface PresetStreamingState {
  fullResponse: string;
  currentIndex: number;
  aiMessageId: string;
  lastUpdateTime: number;
  isActive: boolean;
}

/**
 * Parse preset response from message content
 * Checks if message contains preset response
 */
function parsePresetResponse(content: string): {
  hasPresetResponse: boolean;
  presetResponse: string | null;
  multipleChoiceData: any | null;
} {
  if (!content.includes('<-Multiple Choice Template->')) {
    return { hasPresetResponse: false, presetResponse: null, multipleChoiceData: null };
  }

  try {
    const jsonStr = content.replace('<-Multiple Choice Template->', '').trim();
    const data = JSON.parse(jsonStr);
    
    if (data.hasPresetResponse && data.presetResponse) {
      return {
        hasPresetResponse: true,
        presetResponse: data.presetResponse,
        multipleChoiceData: data,
      };
    }
  } catch (e) {
    // Not a valid JSON, continue with normal flow
  }

  return { hasPresetResponse: false, presetResponse: null, multipleChoiceData: null };
}

/**
 * Composable for handling preset response streaming
 * Similar to frontend usePresetResponse hook
 */
export const usePresetResponse = () => {
  const streamingMessage = useSignal<ChatMessage | null>(null);
  const isStreaming = useSignal(false);
  const streamingState = useSignal<PresetStreamingState | null>(null);

  /**
   * Stream preset response with animation (simulates AI typing)
   */
  const streamPresetResponse = $(async (
    userMessage: ChatMessage,
    presetResponse: string,
    chatIdOverride?: string
  ) => {
    if (isStreaming.value) {
      return; // Already streaming
    }

    isStreaming.value = true;

    // Create AI message ID
    const aiMessageId = crypto.randomUUID();

    // Initialize streaming state
    streamingState.value = {
      fullResponse: presetResponse,
      currentIndex: 0,
      aiMessageId,
      lastUpdateTime: performance.now(),
      isActive: true,
    };

    // Initialize streaming message
    streamingMessage.value = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    // Start animation loop
    const animateStreaming = (currentTime: number) => {
      const state = streamingState.value;
      if (!state || !state.isActive) {
        return;
      }

      // Stream ~30 characters per 100ms (similar to ChatGPT)
      const charsPerUpdate = 30;
      const timeSinceLastUpdate = currentTime - state.lastUpdateTime;

      if (timeSinceLastUpdate >= 50) {
        const charsToAdd = Math.min(
          charsPerUpdate,
          state.fullResponse.length - state.currentIndex
        );

        if (charsToAdd > 0) {
          state.currentIndex += charsToAdd;
          const currentContent = state.fullResponse.substring(0, state.currentIndex);

          // Update streaming message
          streamingMessage.value = {
            ...streamingMessage.value!,
            content: currentContent,
          };

          state.lastUpdateTime = currentTime;
        }

        if (state.currentIndex >= state.fullResponse.length) {
          // Streaming complete - add final message to store
          const finalMessage: ChatMessage = {
            id: state.aiMessageId,
            role: 'assistant',
            content: state.fullResponse,
            timestamp: new Date().toISOString(),
          };

          chatActions.addMessage(finalMessage);

          // Store AI message only (user message already stored in handleAnswerSelect$)
          // This is for multiple_choice type with preset response
          const validChatId = chatIdOverride || chatStore.currentChatId || crypto.randomUUID();
          
          // Only store AI message - user message was already stored
          storeMessageOnlyClient({
            messages: [finalMessage],
            chatId: validChatId,
            subject: uiStore.currentChatSubject || null,
            topic: uiStore.currentChatTopic || null,
            title: userMessage.content.substring(0, 50) || 'Preset Response',
          }).catch((error) => {
            console.error('Failed to store preset response AI message:', error);
          });

          // Mark as inactive and cleanup
          streamingState.value = null;
          streamingMessage.value = null;
          isStreaming.value = false;
          
          // Dispatch event to notify completion
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('preset-streaming-complete'));
          }
          
          return;
        }
      }

      // Continue animation
      requestAnimationFrame(animateStreaming);
    };

    // Start animation
    requestAnimationFrame(animateStreaming);
  });

  /**
   * Stop streaming
   */
  const stopPresetStreaming = $(() => {
    if (streamingState.value) {
      streamingState.value.isActive = false;
    }
    streamingMessage.value = null;
    isStreaming.value = false;
    streamingState.value = null;
  });

  /**
   * Check if message has preset response and handle it
   */
  const handlePresetResponse = $(async (userMessage: ChatMessage) => {
    const content = typeof userMessage.content === 'string' ? userMessage.content : '';
    const { hasPresetResponse, presetResponse } = parsePresetResponse(content);

    if (hasPresetResponse && presetResponse) {
      // Fake stream preset response
      await streamPresetResponse(userMessage, presetResponse);
      return true; // Handled preset response
    }

    return false; // No preset response, continue with normal flow
  });

  return {
    streamingMessage,
    isStreaming,
    streamPresetResponse,
    stopPresetStreaming,
    handlePresetResponse,
  };
};

