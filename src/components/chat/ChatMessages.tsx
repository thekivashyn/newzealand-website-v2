import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { ChatMessage } from '~/store/types';
import { UserMessage } from './messages/UserMessage';
import { AIMessage } from './messages/AIMessage';
// Qwik automatically code-splits imports - no need for lazy()
import { ExaminationDemo } from './ExaminationDemo';

interface ChatMessagesProps {
  messages: ChatMessage[];
  streamingMessage?: ChatMessage | null;
  status?: 'ready' | 'loading' | 'error';
  onCopy?: (text: string) => void;
  onRegenerate?: (messageId: string) => void;
  showExaminationDemo?: boolean;
  onExaminationDemoClose$?: () => void;
  onPromptSelect$?: (prompt: string, options?: { mode?: string; subject?: string; topic?: string }) => void;
}

/**
 * Enterprise-grade Chat Messages Component
 * Features:
 * - ChatGPT-style scroll: scroll to top when user submits, bringing their message to top of viewport
 * - No auto-scroll during streaming (preserve user's scroll position)
 * - Smooth scroll animations
 * - Optimized rendering
 * - Mobile-friendly padding
 */
export const ChatMessages = component$<ChatMessagesProps>((props) => {
  const scrollRef = useSignal<HTMLDivElement>();
  const previousMessagesLength = useSignal(0);
  const userJustSubmitted = useSignal(false);
  const hasEverHadContent = useSignal(false);

  // Find latest user message info (message + index) for precise targeting
  const latestUserMessageInfo = (() => {
    for (let i = props.messages.length - 1; i >= 0; i--) {
      const message = props.messages[i];
      if (message?.role === 'user') {
        return { message, index: i };
      }
    }
    return null;
  })();

  const latestUserMessageId = latestUserMessageInfo
    ? (latestUserMessageInfo.message.id ?? `msg-${latestUserMessageInfo.index}`)
    : null;

  // Add dynamic padding to mimic ChatGPT spacing for smoother scroll experience
  const shouldAddPadding =
    userJustSubmitted.value ||
    props.status === 'loading' ||
    !!props.streamingMessage ||
    hasEverHadContent.value;
  const dynamicPadding = shouldAddPadding ? '60vh' : '3rem';

  // Maintain padding once we've had content to avoid abrupt layout shifts
  useVisibleTask$(({ track }) => {
    const messagesLength = track(() => props.messages.length);
    const streamingMessage = track(() => props.streamingMessage);
    const status = track(() => props.status);

    if (messagesLength > 0 || streamingMessage) {
      hasEverHadContent.value = true;
    } else if (messagesLength === 0 && status === 'ready') {
      hasEverHadContent.value = false;
    }
  });

  // Scroll to top helper (ChatGPT style)
  const scrollToTop = $(() => {
    const container = scrollRef.value;
    if (!container) return;

    // Use requestAnimationFrame for smooth scroll
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = 0;
      }
    });
  });

  // Scroll to user's latest message and bring it to top near header (ChatGPT style)
  // Optimized version inspired by front folder implementation
  const scrollToUserMessage = $((messageId?: string) => {
    const container = scrollRef.value;
    if (!container) return;

    const targetMessageId = messageId || latestUserMessageId;

    if (!targetMessageId) {
      // Fallback: scroll to top if no user message found
      scrollToTop();
      return;
    }

    // Find the message element in DOM and scroll to it
    const findAndScroll = () => {
      const messageElement = container.querySelector(`[data-message-id="${targetMessageId}"]`) as HTMLElement;
      
      if (messageElement) {
        // Calculate precise scroll position for ChatGPT-style placement
        const containerRect = container.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();
        
        // Calculate offset to place message almost touching the header
        // Zero offset so the bubble sticks right to the top edge
        const offsetFromTop = 0;
        const currentElementTop = messageRect.top - containerRect.top;
        const targetScrollTop = container.scrollTop + currentElementTop - offsetFromTop;
        
        // Direct scroll to calculated position for better precision
        requestAnimationFrame(() => {
          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });
          
          // Backup verification: Verify positioning after scroll (fallback if needed)
          setTimeout(() => {
            if (!container || !messageElement) return;
            
            const finalElementRect = messageElement.getBoundingClientRect();
            const finalContainerRect = container.getBoundingClientRect();
            const finalElementTop = finalElementRect.top - finalContainerRect.top;
            
            // If element is not positioned correctly, use scrollIntoView as fallback
            if (Math.abs(finalElementTop - offsetFromTop) > 4) {
              messageElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              });
            }
          }, 50);
        });
      } else {
        // Message element not found yet, retry after a short delay
        setTimeout(() => {
          const retryElement = container.querySelector(`[data-message-id="${targetMessageId}"]`) as HTMLElement;
          if (retryElement) {
            const containerRect = container.getBoundingClientRect();
            const messageRect = retryElement.getBoundingClientRect();
            const offsetFromTop = 0;
            const currentElementTop = messageRect.top - containerRect.top;
            const targetScrollTop = container.scrollTop + currentElementTop - offsetFromTop;
            
            requestAnimationFrame(() => {
              container.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: 'smooth'
              });
            });
          } else {
            // If still not found, just scroll to top
            scrollToTop();
          }
        }, 120);
      }
    };

    // Use double RAF for better DOM sync (inspired by front folder)
    // This ensures DOM is ready and scroll happens smoothly
    requestAnimationFrame(() => {
      requestAnimationFrame(findAndScroll);
    });
  });

  // Handle user submission - scroll to top and bring user message to top
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    // Track only what we need for scroll logic
    const messagesLength = track(() => props.messages.length);
    const showExaminationDemo = track(() => props.showExaminationDemo);

    const hasNewMessage = messagesLength > previousMessagesLength.value;
    const lastMessage = props.messages[props.messages.length - 1];
    const isUserMessage = lastMessage?.role === 'user';

    // Update refs for next comparison
    previousMessagesLength.value = messagesLength;
    
    // Skip auto-scroll if ExaminationDemo is showing (let user control scroll)
    if (showExaminationDemo) {
      return;
    }
    
    // ChatGPT Style: When user submits -> scroll to top and bring their message to top of viewport
    if (hasNewMessage && isUserMessage && userJustSubmitted.value) {
      // Optimized: Use double RAF for better DOM sync (inspired by front folder)
      // This ensures DOM is ready and scroll happens smoothly
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToUserMessage(latestUserMessageId ?? undefined);
          // Keep padding during animation, then reset to allow layout to settle
          setTimeout(() => {
            userJustSubmitted.value = false;
          }, 300);
        });
      });
    }
  });

  // Setup event listener for user submission
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleUserSubmit = () => {
      userJustSubmitted.value = true;
    };

    window.addEventListener('chat:user-submitted', handleUserSubmit);

    return () => {
      window.removeEventListener('chat:user-submitted', handleUserSubmit);
    };
  });

  return (
    <div 
      ref={scrollRef}
      class="flex-1 overflow-y-auto transition-opacity duration-300 ease-in-out mt-[55px] bg-learning-cream min-h-0"
      style={{ 
        scrollbarWidth: 'none',
        // Only show scrollbar when content exceeds viewport (natural behavior)
        msOverflowStyle: 'none', // IE and Edge
        // Ensure container can scroll by having a defined height
        height: '100%',
      }}
      data-chat-messages-container
    >
      <div class="mx-auto max-w-3xl px-4 pt-0 pb-32 sm:pb-12">
        {props.messages.length === 0 && !props.streamingMessage ? (
          <div class="text-center text-gray-500 py-12">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div class="space-y-2">
            {props.messages.map((message, index) => {
              const messageId = message.id || `msg-${index}`;
              
              return message.role === 'user' ? (
                <div 
                  key={messageId} 
                  data-message-id={messageId}
                  class="w-full flex justify-end mt-2 mb-2 first:mt-0"
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
                  class="mt-2 mb-2 first:mt-0"
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
              <div class="mt-2 mb-2 first:mt-0" data-message-id={props.streamingMessage.id || 'streaming'}>
                <AIMessage
                  message={props.streamingMessage}
                  isStreaming={true}
                  isRegenerating={false}
                  onCopy={props.onCopy}
                  onRegenerate={props.onRegenerate}
                />
              </div>
            )}

            {/* ExaminationDemo - Show when triggered by Let's Practice button */}
            {props.showExaminationDemo && (
              <div class="my-2">
                <ExaminationDemo
                  latestAIMessage={[...props.messages].reverse().find(msg => msg.role === 'assistant') || props.streamingMessage!}
                  conversationHistory={props.messages.slice(-3)}
                  forceRegenerate={true}
                  onClose$={props.onExaminationDemoClose$}
                  onPromptSelect$={props.onPromptSelect$}
                />
              </div>
            )}

            {/* Spacer to create scrollable space for ChatGPT-style positioning */}
            <div aria-hidden="true" class="pointer-events-none select-none" style={{ height: dynamicPadding }}></div>
          </div>
        )}
      </div>
    </div>
  );
});
