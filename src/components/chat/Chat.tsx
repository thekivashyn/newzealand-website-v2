import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { chatStore, chatActions } from '~/store/chat';
import { uiStore } from '~/store/ui';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { EmptyChat } from './EmptyChat';
import { useChatStreaming } from '../../composables/useChatStreaming';
import { usePresetResponse } from '../../composables/usePresetResponse';
import { useLoadChat } from '../../composables/useLoadChat';
import { chatFlowController } from '~/services/chatFlowController';
import type { ChatMessage } from '~/store/types';

export const Chat = component$(() => {
  // Load chat messages when chatId changes
  useLoadChat({ enabled: true });
  
  const input = useSignal('');
  const status = useSignal<'ready' | 'loading' | 'error'>('ready');
  const { streamingMessage: apiStreamingMessage, startStreaming, stopStreaming } = useChatStreaming();
  const { streamingMessage: presetStreamingMessage, isStreaming: isPresetStreaming, handlePresetResponse, stopPresetStreaming } = usePresetResponse();

  // Track store changes and streaming state reactively
  const chatMessages = useSignal(chatStore.messages);
  const currentChatId = useSignal(chatStore.currentChatId);
  
  useVisibleTask$(({ track }) => {
    // Track store properties
    track(() => chatStore.messages);
    track(() => chatStore.currentChatId);
    track(() => uiStore.currentChatSubject);
    track(() => uiStore.currentChatTopic);
    track(() => uiStore.currentChatTerm);
    track(() => uiStore.currentChatSubCategory);
    
    // Track streaming state
    track(() => presetStreamingMessage.value);
    track(() => apiStreamingMessage.value);
    track(() => isPresetStreaming.value);
    track(() => status.value);
    
    // Sync signals with store
    chatMessages.value = chatStore.messages;
    currentChatId.value = chatStore.currentChatId;
    
    // Update status based on streaming state
    if (isPresetStreaming.value) {
      status.value = 'loading';
    } else if (!presetStreamingMessage.value && status.value === 'loading' && !apiStreamingMessage.value) {
      status.value = 'ready';
    }
  });

  // Listen for store changes via events and preset streaming completion
  useVisibleTask$(() => {
    const handleChatStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      // Sync from store as source of truth (event is just notification)
      chatMessages.value = chatStore.messages;
      currentChatId.value = chatStore.currentChatId;
    };

    const handlePresetComplete = () => {
      status.value = 'ready';
    };

    window.addEventListener('chat:state-changed', handleChatStateChange);
    window.addEventListener('preset-streaming-complete', handlePresetComplete);

    return () => {
      window.removeEventListener('chat:state-changed', handleChatStateChange);
      window.removeEventListener('preset-streaming-complete', handlePresetComplete);
    };
  });

  // Helper: Ensure chatId exists and is valid
  const ensureChatId = $(() => {
    let chatId = chatStore.currentChatId;
    if (!chatId) {
      chatId = crypto.randomUUID();
      chatActions.setCurrentChatId(chatId);
    }
    return chatId;
  });

  const handleSubmit$ = $(async (e: any) => {
    e.preventDefault();
    
    // Prevent submit if already processing
    if (status.value === 'loading' || isPresetStreaming.value) {
      return;
    }
    
    // Get input value from event detail (if passed from ChatInput) or from signal
    const inputValue = e.detail?.inputValue || input.value.trim();
    
    // Validate - check for empty or whitespace-only input
    if (!inputValue || inputValue.length === 0 || status.value !== 'ready') {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    // Clear input IMMEDIATELY - ensure it's cleared
    input.value = '';
    
    // Add message to store
    chatActions.addMessage(userMessage);
    
    // Set loading status BEFORE async operations
    status.value = 'loading';
    
    // Dispatch event to trigger auto-scroll
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat:user-submitted'));
    }

    // Ensure chatId exists
    const chatId = await ensureChatId();

    // Check if message has preset response first
    const handled = await handlePresetResponse(userMessage);
    
    if (handled) {
      // Preset response handled - fake streaming will complete
      chatFlowController.handleFirstMessageSent();
      return;
    }

    // No preset response - proceed with normal API streaming
    try {
      await startStreaming(
        [...chatMessages.value, userMessage],
        chatId,
        {
          subject: uiStore.currentChatSubject,
          topic: uiStore.currentChatTopic,
          term: uiStore.currentChatTerm,
          subCategory: uiStore.currentChatSubCategory,
        }
      );
      
      chatFlowController.handleFirstMessageSent();
      
      // Ensure input is still cleared after streaming completes
      if (input.value !== '') {
        input.value = '';
      }
      
      status.value = 'ready';
    } catch (error: any) {
      console.error('Chat error:', error);
      status.value = 'error';
      // On error, restore input value for retry
      if (input.value === '') {
        input.value = inputValue;
      }
    }
  });

  const handleStop$ = $(() => {
    // Stop both API and preset streaming
    stopStreaming();
    stopPresetStreaming();
    status.value = 'ready';
  });

  const handleInputChange$ = $((value: string) => {
    input.value = value;
  });

  // Handle message sending from PresetQuestionsStep
  const handleSendMessage$ = $(async (_messageContent: string) => {
    // Message is already added to store by useQuestionHandler
    const lastMessage = chatMessages.value[chatMessages.value.length - 1];
    if (!lastMessage) return;

    // Try to handle preset response first
    const handled = await handlePresetResponse(lastMessage);
    
    if (handled) {
      // Preset response handled - fake streaming will complete
      chatFlowController.handleFirstMessageSent();
      return;
    }

    // No preset response - proceed with normal API streaming
    const chatId = await ensureChatId();

    if (status.value === 'ready') {
      status.value = 'loading';
      try {
        await startStreaming(
          chatMessages.value,
          chatId,
          {
            subject: uiStore.currentChatSubject,
            topic: uiStore.currentChatTopic,
            term: uiStore.currentChatTerm,
            subCategory: uiStore.currentChatSubCategory,
          }
        );
        
        chatFlowController.handleFirstMessageSent();
        status.value = 'ready';
      } catch (error: any) {
        console.error('Chat error:', error);
        status.value = 'error';
      }
    }
  });

  // Read from signals (synced with store)
  const hasMessages = chatMessages.value.length > 0;
  // Use preset streaming if active, otherwise use API streaming
  const currentStreamingMessage = presetStreamingMessage.value || apiStreamingMessage.value;
  const currentIsStreaming = isPresetStreaming.value || status.value === 'loading';

  return (
    <div class="flex h-screen flex-col bg-learning-cream">
      {hasMessages || currentStreamingMessage ? (
        <>
          <ChatMessages 
            messages={chatMessages.value} 
            streamingMessage={currentStreamingMessage}
            status={currentIsStreaming ? 'loading' : status.value}
          />
          <ChatInput
            input={input.value}
            onInputChange$={handleInputChange$}
            onSubmit$={handleSubmit$}
            status={currentIsStreaming ? 'loading' : status.value}
            onStop$={handleStop$}
            messages={chatMessages.value}
            streamingMessage={currentStreamingMessage}
          />
        </>
      ) : (
        <EmptyChat onSendMessage={handleSendMessage$} />
      )}
    </div>
  );
});

