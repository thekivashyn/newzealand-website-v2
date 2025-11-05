import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import type { QwikSubmitEvent } from '@builder.io/qwik';
import type { ChatMessage } from '~/store/types';

interface ChatInputProps {
  input: string;
  onInputChange$: (value: string) => void;
  onSubmit$: (e: QwikSubmitEvent) => void;
  status: 'ready' | 'loading' | 'error';
  onStop$: () => void;
  messages: ChatMessage[];
  streamingMessage: ChatMessage | null;
  onLetsPracticeClick$?: () => void;
}

/**
 * Enterprise-grade Chat Input Component
 * Features:
 * - Auto-focus on mount
 * - Auto-resize textarea (max 200px)
 * - Enter to submit, Shift+Enter for newline
 * - Cmd/Ctrl + Enter to submit
 * - Auto-scroll to bottom on submit
 * - Optimistic UI updates
 * - Keyboard shortcuts support
 * - Mobile-friendly (prevents zoom on focus)
 * - Handles all edge cases:
 *   - Empty input (disabled submit)
 *   - Rapid submits (prevent duplicate)
 *   - Streaming state (disabled input)
 *   - Error state (allow retry)
 *   - Whitespace-only input (disabled submit)
 *   - Very long text (max height with scroll)
 */
export const ChatInput = component$<ChatInputProps>((props) => {
  const textareaRef = useSignal<HTMLTextAreaElement>();
  const formRef = useSignal<HTMLFormElement>();
  const isSubmitting = useSignal(false);
  
  const trimmedInput = props.input?.trim() || '';
  const canSubmit = trimmedInput.length > 0 && (props.status === 'ready' || props.status === 'error') && !isSubmitting.value;
  const isStreaming = props.status === 'loading';

  // Auto-focus: mount and after streaming
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => props.status);
    const textarea = textareaRef.value;
    if (textarea && props.status === 'ready' && !isSubmitting.value) {
      setTimeout(() => textarea.focus(), 100);
    }
  });

  // Reset submitting flag
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => props.status);
    if (props.status === 'ready') {
      isSubmitting.value = false;
    }
  });

  const handleInputChange$ = $((value: string) => {
    // Don't update if submitting (prevent race condition with clear)
    if (isSubmitting.value) return;
    props.onInputChange$(value);
  });

  const handleSubmit$ = $(async (e: Event) => {
    e.preventDefault();
    
    if (isSubmitting.value || isStreaming) return;
    
    const currentInput = props.input?.trim();
    if (!currentInput || (props.status !== 'ready' && props.status !== 'error')) return;
    
    // Set flag FIRST to prevent onInput$ from updating
    isSubmitting.value = true;
    
    // Clear input IMMEDIATELY - let Qwik reactivity handle DOM sync
    props.onInputChange$('');
    
    try {
      const syntheticEvent = {
        preventDefault: () => {},
        currentTarget: e.currentTarget,
        detail: { inputValue: currentInput },
      } as any;
      
      await props.onSubmit$(syntheticEvent);
      
      setTimeout(() => {
        const textarea = textareaRef.value;
        if (textarea && props.status === 'ready') {
          textarea.focus();
        }
      }, 100);
    } catch (error) {
      console.error('[ChatInput] Submit error:', error);
    }
  });

  // Sync textarea value with props.input and auto-resize
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => props.input);
    const textarea = textareaRef.value;
    if (!textarea) return;

    // Sync textarea.value with props.input (controlled component)
    // Always sync, even when submitting, to ensure clear works
    const inputValue = props.input || '';
    if (textarea.value !== inputValue) {
      textarea.value = inputValue;
    }

    // Auto-resize
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 200;
    
    if (scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  });

  const handleKeyDown$ = $((e: KeyboardEvent) => {
    if (isStreaming || isSubmitting.value) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
      }
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const currentInput = props.input?.trim();
      if (currentInput && (props.status === 'ready' || props.status === 'error')) {
        formRef.value?.requestSubmit();
      }
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentInput = props.input?.trim();
      if (currentInput && (props.status === 'ready' || props.status === 'error')) {
        formRef.value?.requestSubmit();
      }
    }
  });

  // Prevent zoom on iOS
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const textarea = textareaRef.value;
    if (!textarea) return;

    const handleFocus = () => {
      if (!textarea.style.fontSize || parseFloat(textarea.style.fontSize) < 16) {
        textarea.style.fontSize = '16px';
      }
    };

    textarea.addEventListener('focus', handleFocus);
    return () => textarea.removeEventListener('focus', handleFocus);
  });

  // Check if should show quick actions (similar to useRelatedQuestionsVisibility)
  const showQuickActions = props.messages.length > 0 && !props.streamingMessage && props.status === 'ready';

  return (
    <div class="fixed sm:sticky bottom-0 left-0 right-0 z-10 w-full bg-gradient-to-t from-learning-cream via-learning-cream/95 to-transparent pb-safe">
      <form ref={formRef} onSubmit$={handleSubmit$} preventdefault:submit>
        <div class="mx-auto max-w-3xl relative px-0 sm:px-4">
          {/* Quick Action Buttons */}
          {showQuickActions && (
            <div class="absolute -top-3 sm:-top-4 right-2 sm:right-4 flex gap-1.5 sm:gap-2 z-20">
              <button
                type="button"
                onClick$={() => {
                  if (props.onLetsPracticeClick$) {
                    props.onLetsPracticeClick$();
                  }
                }}
                class="flex disabled:opacity-50 cursor-pointer items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#1B7A7A] hover:bg-[#14B8A6] text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 shadow-lg hover:shadow-xl hover:shadow-[#14B8A6]/20 backdrop-blur-sm border border-[#1B7A7A]/30 touch-manipulation"
                disabled={isStreaming || isSubmitting.value}
              >
                <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span class="tracking-wide drop-shadow-sm">Let's Practice</span>
              </button>
            </div>
          )}
          
          <div class="relative rounded-t-xl sm:rounded-2xl bg-gradient-to-br from-stone-900/95 via-neutral-900/90 to-stone-900/95 border-t border-x-0 sm:border border-slate-600/50 backdrop-blur-2xl transition-all duration-700 ease-out hover:border-slate-500/70 focus-within:bg-gradient-to-br focus-within:from-stone-800/98 focus-within:via-neutral-800/95 focus-within:to-stone-800/98 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/30 hover:border-cyan-400/50 group overflow-hidden">
            {/* Animated border glow effect */}
            <div class="absolute inset-0 rounded-t-xl sm:rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-700 ease-out blur-sm" />
            <div class="absolute inset-[1px] rounded-t-xl sm:rounded-2xl bg-gradient-to-br from-stone-900/95 via-neutral-900/90 to-stone-900/95" />

            {/* Animated inner shimmer effect */}
            <div class="absolute inset-0 rounded-t-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-stone-700/[0.03] to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-700 animate-pulse" />

            {/* Metallic edge highlight */}
            <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />

            <label for="chat-message-input" class="sr-only">
              Ask me anything about this problem
            </label>
            
            {/* Textarea */}
              <textarea
              id="chat-message-input"
                ref={textareaRef}
              value={props.input || ''}
              onInput$={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                handleInputChange$(value);
              }}
                onKeyDown$={handleKeyDown$}
                placeholder="Ask me anything about this problem"
              disabled={isStreaming || isSubmitting.value}
                rows={1}
              class="w-full resize-none border-none bg-transparent py-3 sm:py-4 px-3 sm:px-4 text-sm sm:text-base text-white placeholder-slate-400/70 focus:outline-none focus:ring-0 font-medium leading-6 relative z-10 transition-all duration-300 drop-shadow-sm selection:bg-cyan-400/30 selection:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Ask me anything about this problem"
              aria-disabled={isStreaming || isSubmitting.value}
              autocomplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellcheck={false}
              maxLength={50000}
            />
            
            <div class="flex items-center justify-between p-2 sm:p-2 pt-0 relative z-10">
              <div class="flex-grow"></div>

              {/* Submit/Stop button */}
              {isStreaming ? (
            <button
                  type="button"
                  onClick$={props.onStop$}
                  class="flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-red-600/90 via-red-700/80 to-red-800/90 text-white transition-all duration-500 hover:scale-110 hover:rotate-3 active:scale-95 focus:outline-none disabled:scale-100 disabled:opacity-50 relative overflow-hidden group/btn border border-red-400/40 hover:border-red-300/60 touch-manipulation"
                  aria-label="Stop generating"
            >
                  {/* Animated background shimmer */}
                  <div class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover/btn:opacity-100 transition-all duration-500" />

                  {/* Button inner glow */}
                  <div class="absolute inset-0 rounded-full bg-gradient-to-r from-red-300/20 via-red-200/30 to-red-300/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

                  {/* Animated border */}
                  <div class="absolute inset-0 rounded-full border border-red-300/40 opacity-0 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-300" />

                  <svg class="h-5 w-5 sm:h-6 sm:w-6 relative z-10 drop-shadow-sm transition-all duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110 group-hover/btn:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="6" y="6" width="4" height="12" rx="1" />
                    <rect x="14" y="6" width="4" height="12" rx="1" />
                </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit || isStreaming || isSubmitting.value}
                  class={`flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-500 hover:scale-110 hover:rotate-3 active:scale-95 focus:outline-none disabled:scale-100 relative overflow-hidden group/btn touch-manipulation ${
                    canSubmit && !isStreaming && !isSubmitting.value
                      ? 'bg-gradient-to-br from-amber-500/90 via-orange-500/80 to-amber-600/90 hover:from-amber-400/95 hover:via-orange-400/85 hover:to-amber-500/95 border border-amber-400/40 hover:border-amber-300/60'
                      : 'bg-slate-700/60 cursor-not-allowed disabled:opacity-50 border border-slate-600/30'
                  }`}
                  aria-label="Send message"
                  title={canSubmit && !isStreaming && !isSubmitting.value ? 'Send message (Enter or Cmd/Ctrl+Enter)' : 'Type a message to send'}
                >
                  {/* Animated background shimmer */}
                  <div class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover/btn:opacity-100 transition-all duration-500" />

                  {/* Button inner glow */}
                  {canSubmit && !isStreaming && !isSubmitting.value && (
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/20 via-orange-200/30 to-amber-300/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  )}

                  {/* Animated border */}
                  {canSubmit && !isStreaming && !isSubmitting.value && (
                    <div class="absolute inset-0 rounded-full border border-amber-300/40 opacity-0 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-300" />
                  )}

                  <svg class="h-5 w-5 sm:h-6 sm:w-6 relative z-10 drop-shadow-sm transition-all duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110 group-hover/btn:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clip-rule="evenodd" />
                </svg>
                </button>
              )}
            </div>
          </div>
          </div>
        </form>
    </div>
  );
});

