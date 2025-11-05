import { useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { chatFlowController, ChatLoadState } from '../services/chatFlowController';

interface UseLoadChatOptions {
  enabled?: boolean;
}

/**
 * Enterprise-grade composable for chat loading
 * Uses ChatFlowController for centralized state management
 * Follows Qwik reactive patterns
 * 
 * Note: This composable only subscribes to state changes for UI updates.
 * Actual loading is triggered by:
 * - ChatItem.handleChatSwitch() when clicking sidebar items
 * - Route sync when URL changes (if needed)
 */
export const useLoadChat = (options: UseLoadChatOptions = {}) => {
  const { enabled = true } = options;
  
  const isLoading = useSignal(false);
  const error = useSignal<string | null>(null);
  const loadState = useSignal<ChatLoadState>(ChatLoadState.IDLE);

  // Subscribe to chat flow controller state changes
  // This provides reactive UI updates for loading states
  useVisibleTask$(() => {
    if (!enabled) return;

    // Subscribe to load state changes
    const unsubscribe = chatFlowController.subscribe((context) => {
      isLoading.value = context.state === ChatLoadState.LOADING;
      error.value = context.error;
      loadState.value = context.state;
    });

    return () => {
      unsubscribe();
    };
  });

  // Cleanup on unmount
  useVisibleTask$(() => {
    return () => {
      chatFlowController.abort();
    };
  });

  return {
    isLoading,
    error,
    loadState,
  };
};
