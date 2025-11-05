import { component$, useSignal, $ } from '@builder.io/qwik';
import type { ChatMessage } from '~/store/types';
import { CustomMarkdown } from '../shared/CustomMarkdown';

interface AIMessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
  isRegenerating?: boolean;
  onCopy?: (text: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export const AIMessage = component$<AIMessageProps>((props) => {
  const isCopied = useSignal(false);
  
  // Extract content once per render
  const content = typeof props.message.content === 'string' ? props.message.content : '';
  
  const handleCopy$ = $(async () => {
    if (props.onCopy) {
      props.onCopy(content);
    } else {
      await navigator.clipboard.writeText(content);
    }
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  });

  const handleRegenerate$ = $(() => {
    if (props.onRegenerate && props.message.id) {
      props.onRegenerate(props.message.id);
    }
  });

  return (
    <div class="group/message relative -mx-2 sm:-mx-4 flex gap-x-2 sm:gap-x-3 md:gap-x-4 rounded-lg px-2 sm:px-4 py-3 sm:py-4 md:py-5 transition-colors duration-200">
      {/* Avatar */}
      <div
        class="relative hidden h-10 w-10 flex-shrink-0 items-center justify-center bg-white border-1 border-black rounded-full transition-all duration-300 sm:flex bg-gray-700"
      >
        <img
          src="/flag.png"
          alt="AI Avatar"
          width={40}
          height={40}
          class="rounded-full"
        />
      </div>
      
      {/* Content */}
      <div class="min-w-0 flex-1 space-y-2 sm:space-y-3">
        {/* Markdown Content */}
        <div class="prose prose-invert prose-p:!my-0 prose-pre:!my-0 prose-pre:!bg-transparent prose-pre:!p-0 max-w-none text-black">
          <CustomMarkdown content={content} />
        </div>

        {/* Action buttons - always visible */}
        <div class="flex items-center justify-start gap-1.5 sm:gap-2 opacity-100">
          <button
            class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-black hover:text-gray-700 bg-transparent hover:bg-gray-100/50 border border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
            onClick$={handleCopy$}
            aria-label={isCopied.value ? 'Copied to clipboard' : 'Copy to clipboard'}
          >
            {isCopied.value ? (
              <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          
          {props.onRegenerate && (
            <button
              class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-black hover:text-gray-700 bg-transparent hover:bg-gray-100/50 border border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
              onClick$={handleRegenerate$}
              aria-label={props.isRegenerating ? 'Regenerating response' : 'Regenerate response'}
            >
              {props.isRegenerating ? (
                <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

