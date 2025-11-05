import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { chatStore, chatActions } from '~/store/chat';
import { uiStore, uiActions } from '~/store/ui';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { EmptyChat } from './EmptyChat';
import { EmptyHeaderCustom } from '../EmptyHeaderCustom';
import { useChatStreaming } from '../../composables/useChatStreaming';
import { usePresetResponse } from '../../composables/usePresetResponse';
import { useLoadChat } from '../../composables/useLoadChat';
import { chatFlowController } from '~/services/chatFlowController';
import type { ChatMessage } from '~/store/types';

export const Chat = component$(() => {
  // Load chat messages when chatId changes
  useLoadChat({ enabled: true });
  
  const navigate = useNavigate();
  const input = useSignal('');
  const status = useSignal<'ready' | 'loading' | 'error'>('ready');
  const showExaminationDemo = useSignal(false);
  const { streamingMessage: apiStreamingMessage, startStreaming, stopStreaming } = useChatStreaming();
  const { streamingMessage: presetStreamingMessage, isStreaming: isPresetStreaming, handlePresetResponse, stopPresetStreaming } = usePresetResponse();

  // Track store changes and streaming state reactively
  const chatMessages = useSignal(chatStore.messages);
  const currentChatId = useSignal(chatStore.currentChatId);
  const currentChatTopic = useSignal(uiStore.currentChatTopic);
  const currentChatSubject = useSignal(uiStore.currentChatSubject);
  const currentChatTerm = useSignal(uiStore.currentChatTerm);
  const currentChatSubCategory = useSignal(uiStore.currentChatSubCategory);
  
  // eslint-disable-next-line qwik/no-use-visible-task
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
    currentChatTopic.value = uiStore.currentChatTopic;
    currentChatSubject.value = uiStore.currentChatSubject;
    currentChatTerm.value = uiStore.currentChatTerm;
    currentChatSubCategory.value = uiStore.currentChatSubCategory;
    
    // Update status based on streaming state
    if (isPresetStreaming.value) {
      status.value = 'loading';
    } else if (!presetStreamingMessage.value && status.value === 'loading' && !apiStreamingMessage.value) {
      status.value = 'ready';
    }
  });

  // Listen for store changes via events and preset streaming completion
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleChatStateChange = () => {
      // Sync from store as source of truth (event is just notification)
      chatMessages.value = chatStore.messages;
      currentChatId.value = chatStore.currentChatId;
    };

    const handleUIStateChange = () => {
      // Sync UI store state
      currentChatTopic.value = uiStore.currentChatTopic;
      currentChatSubject.value = uiStore.currentChatSubject;
      currentChatTerm.value = uiStore.currentChatTerm;
      currentChatSubCategory.value = uiStore.currentChatSubCategory;
    };

    const handlePresetComplete = () => {
      status.value = 'ready';
    };

    window.addEventListener('chat:state-changed', handleChatStateChange);
    window.addEventListener('ui:state-changed', handleUIStateChange);
    window.addEventListener('preset-streaming-complete', handlePresetComplete);

    return () => {
      window.removeEventListener('chat:state-changed', handleChatStateChange);
      window.removeEventListener('ui:state-changed', handleUIStateChange);
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
          subject: currentChatSubject.value,
          topic: currentChatTopic.value,
          term: currentChatTerm.value,
          subCategory: currentChatSubCategory.value,
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

  const handleLetsPracticeClick$ = $(() => {
    // Get latest AI message
    const latestAIMessage = [...chatMessages.value].reverse().find(msg => msg.role === 'assistant');
    
    if (!latestAIMessage || latestAIMessage.content.trim().length < 50) {
      console.warn('No valid AI message found for practice questions');
      return;
    }
    
    showExaminationDemo.value = true;
  });

  // Handle prompt select from ExaminationDemo
  const handlePromptSelect$ = $(async (prompt: string, options?: { mode?: string; subject?: string; topic?: string }) => {
    // Create user message with the prompt
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    };

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
          subject: options?.subject || currentChatSubject.value,
          topic: options?.topic || currentChatTopic.value,
          term: currentChatTerm.value,
          subCategory: currentChatSubCategory.value,
        }
      );
      
      chatFlowController.handleFirstMessageSent();
      status.value = 'ready';
    } catch (error: any) {
      console.error('Chat error:', error);
      status.value = 'error';
    }
  });

  // Handle message sending from PresetQuestionsStep
  const handleSendMessage$ = $(async () => {
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
            subject: currentChatSubject.value,
            topic: currentChatTopic.value,
            term: currentChatTerm.value,
            subCategory: currentChatSubCategory.value,
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

  // Handle back navigation for study mode - Go back to PresetQuestionsStep
  const handleStudyBack$ = $(async () => {
    // CRITICAL: Preserve context from store BEFORE any operations
    // Read directly from store to ensure we have the latest values
    const preservedTerm = uiStore.currentChatTerm;
    const preservedSubject = uiStore.currentChatSubject;
    const preservedTopic = uiStore.currentChatTopic;
    const preservedSubCategory = uiStore.currentChatSubCategory;
    
    console.log('🔙 Back navigation - Preserving context:', {
      term: preservedTerm,
      subject: preservedSubject,
      topic: preservedTopic,
      subCategory: preservedSubCategory
    });
    
    // Generate new chatId (like front does)
    const newChatId = crypto.randomUUID();
    
    // 🚀 CRITICAL: Set chatMethod FIRST to prevent route handler from loading chat
    // This must happen BEFORE any other operations
    uiActions.setChatMethod('new-chat');
    
    // Clear messages
    chatActions.clearMessages();
    
    // Set new chatId (like front does - set chatId BEFORE navigate)
    chatActions.setCurrentChatId(newChatId);
    
    // Re-set context to ensure it's preserved (like front does)
    uiActions.setCurrentChatContext({
      term: preservedTerm,
      subject: preservedSubject,
      topic: preservedTopic,
      subCategory: preservedSubCategory,
    });
    
    // Dispatch events to ensure reactive updates complete
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chat:state-changed'));
      window.dispatchEvent(new CustomEvent('ui:state-changed', {
        detail: {
          currentChatTerm: preservedTerm,
          currentChatSubject: preservedSubject,
          currentChatTopic: preservedTopic,
          currentChatSubCategory: preservedSubCategory,
        }
      }));
    }
    
    // Small delay to ensure store updates propagate before navigation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Navigate with new chatId in URL (like front does)
    // Route handler will see chatMethod='new-chat' and won't try to load the chat
    // This preserves our context and shows EmptyChat with PresetQuestionsStep
    await navigate(`/?id=${newChatId}`);
  });

  // Read from signals (synced with store)
  const hasMessages = chatMessages.value.length > 0;
  // Use preset streaming if active, otherwise use API streaming
  const currentStreamingMessage = presetStreamingMessage.value || apiStreamingMessage.value;
  const currentIsStreaming = isPresetStreaming.value || status.value === 'loading';
  
  // Show header when there are messages and a topic
  const showStudyHeader = hasMessages && currentChatTopic.value;

  return (
    <div class="flex h-screen flex-col bg-learning-cream relative">
      {showStudyHeader && (
        <EmptyHeaderCustom
          backText={`Back to ${currentChatTopic.value}`}
          onBack={handleStudyBack$}
          logo="/logo.png"
        />
      )}
      {hasMessages || currentStreamingMessage ? (
        <>
          <ChatMessages 
            messages={chatMessages.value} 
            streamingMessage={currentStreamingMessage}
            status={currentIsStreaming ? 'loading' : status.value}
            showExaminationDemo={showExaminationDemo.value}
            onExaminationDemoClose$={() => { showExaminationDemo.value = false; }}
            onPromptSelect$={handlePromptSelect$}
          />
          <ChatInput
            input={input.value}
            onInputChange$={handleInputChange$}
            onSubmit$={handleSubmit$}
            status={currentIsStreaming ? 'loading' : status.value}
            onStop$={handleStop$}
            messages={chatMessages.value}
            streamingMessage={currentStreamingMessage}
            onLetsPracticeClick$={handleLetsPracticeClick$}
          />
        </>
      ) : (
        <EmptyChat onSendMessage={handleSendMessage$} />
      )}
    </div>
  );
});

