import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { ChatMessage } from '~/store/types';
import { UserMessage } from './messages/UserMessage';
import { AIMessage } from './messages/AIMessage';

interface ChatMessagesProps {
  messages: ChatMessage[];
  streamingMessage?: ChatMessage | null;
  status?: 'ready' | 'loading' | 'error';
  onCopy?: (text: string) => void;
  onRegenerate?: (messageId: string) => void;
}

/**
 * Enterprise-grade Chat Messages Component
 * Features:
 * - Auto-scroll to bottom on new messages
 * - Smart scroll behavior (preserve position when streaming finishes)
 * - Smooth scroll animations
 * - Optimized rendering
 * - Mobile-friendly padding
 * - ChatGPT-style scroll behavior
 */
export const ChatMessages = component$<ChatMessagesProps>((props) => {
  const scrollRef = useSignal<HTMLDivElement>();
  const previousMessagesLength = useSignal(0);
  const previousStreamingStatus = useSignal<string>('ready');
  const userJustSubmitted = useSignal(false);

  // Scroll to bottom helper with smooth behavior
  const scrollToBottom = $(() => {
    const container = scrollRef.value;
    if (!container) return;

    // Use requestAnimationFrame for smooth scroll
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  });

  // Combined auto-scroll logic and event listener in single hook
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    // Track only what we need for scroll logic
    const messagesLength = track(() => props.messages.length);
    const streamingMsg = track(() => props.streamingMessage);
    const currentStatus = track(() => props.status);

    const hasNewMessage = messagesLength > previousMessagesLength.value;
    const wasStreaming = previousStreamingStatus.value === 'loading';
    const isStreamingFinished = wasStreaming && currentStatus !== 'loading';

    // Update refs for next comparison
    previousMessagesLength.value = messagesLength;
    previousStreamingStatus.value = currentStatus || 'ready';

    // ChatGPT Style Auto-scroll logic:
    // 1. When user just submitted a message -> scroll to show their message
    // 2. When it's the first message -> always scroll
    // 3. Don't scroll when streaming finishes (preserve user's scroll position)
    // 4. Scroll when streaming starts to show streaming message
    const lastMessage = props.messages[props.messages.length - 1];
    const isUserMessage = lastMessage?.role === 'user';
    
    const shouldAutoScroll =
      !isStreamingFinished && ( // Don't scroll when streaming finishes
        (hasNewMessage && (userJustSubmitted.value || messagesLength === 1 || isUserMessage)) || // User just submitted
        (streamingMsg && !wasStreaming) // Streaming just started
      );

    if (shouldAutoScroll) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        scrollToBottom();
        if (userJustSubmitted.value) {
          userJustSubmitted.value = false; // Reset flag
        }
      });
    }
  });

  // Setup event listener and initial scroll in single hook
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleUserSubmit = () => {
      userJustSubmitted.value = true;
    };

    window.addEventListener('chat:user-submitted', handleUserSubmit);

    // Initial scroll on mount
    if (props.messages.length > 0 || props.streamingMessage) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }

    return () => {
      window.removeEventListener('chat:user-submitted', handleUserSubmit);
    };
  });

  return (
    <div 
      ref={scrollRef}
      class="flex-1 overflow-y-auto transition-opacity duration-300 ease-in-out mt-[55px] bg-learning-cream"
      style={{ scrollbarWidth: 'none' }}
      data-chat-messages-container
    >
      <div class="mx-auto max-w-3xl px-4 pt-6 pb-32 sm:pb-12">
        {props.messages.length === 0 && !props.streamingMessage ? (
          <div class="text-center text-gray-500 py-12">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div class="space-y-2">
            {props.messages.map((message) => {
              const messageId = message.id || `msg-${Date.now()}-${Math.random()}`;
              
              return message.role === 'user' ? (
                <div 
                  key={messageId} 
                  data-message-id={messageId}
                  class="w-full flex justify-end my-2"
                >
                  <UserMessage
                    message={message}
                    onCopy={props.onCopy}
                  />
                </div>
              ) : (
                <div 
                  key={messageId} 
                  data-message-id={messageId}
                  class="my-2"
                >
                  <AIMessage
                    message={message}
                    isStreaming={false}
                    isRegenerating={false}
                    onCopy={props.onCopy}
                    onRegenerate={props.onRegenerate}
                  />
                </div>
              );
            })}

            {/* Streaming message */}
            {props.streamingMessage && (
              <div class="my-2" data-message-id={props.streamingMessage.id || 'streaming'}>
                <AIMessage
                  message={props.streamingMessage}
                  isStreaming={true}
                  isRegenerating={false}
                  onCopy={props.onCopy}
                  onRegenerate={props.onRegenerate}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
