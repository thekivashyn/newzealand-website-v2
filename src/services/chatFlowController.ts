/**
 * Chat State Manager - Centralized state management for chat operations
 * Follows enterprise patterns with clear separation of concerns
 */

import { chatStore, chatActions } from '~/store/chat';
import { uiStore, uiActions } from '~/store/ui';
import { fetchChatMessages } from '../services/chatMessages.service';

export enum ChatLoadState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

export interface ChatLoadContext {
  chatId: string | null;
  state: ChatLoadState;
  error: string | null;
}

/**
 * Chat Flow Controller - Manages chat loading lifecycle
 * Handles:
 * - Chat switching
 * - New chat creation
 * - Message loading
 * - State synchronization
 */
export class ChatFlowController {
  private currentLoadContext: ChatLoadContext = {
    chatId: null,
    state: ChatLoadState.IDLE,
    error: null,
  };
  
  private abortController: AbortController | null = null;
  private loadCallbacks: Set<(context: ChatLoadContext) => void> = new Set();

  /**
   * Subscribe to load state changes
   */
  subscribe(callback: (context: ChatLoadContext) => void): () => void {
    this.loadCallbacks.add(callback);
    // Immediately call with current state
    callback(this.currentLoadContext);
    
    // Return unsubscribe function
    return () => {
      this.loadCallbacks.delete(callback);
    };
  }

  /**
   * Get current load context
   */
  getContext(): ChatLoadContext {
    return { ...this.currentLoadContext };
  }

  /**
   * Abort current load operation
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Notify all subscribers of state change
   */
  private notify(context: ChatLoadContext): void {
    this.currentLoadContext = context;
    this.loadCallbacks.forEach(callback => callback(context));
  }

  /**
   * Load chat messages
   * Returns true if load was initiated, false if skipped
   */
  async loadChat(chatId: string | null): Promise<boolean> {
    // Validation: Don't load if no chatId
    if (!chatId) {
      this.notify({
        chatId: null,
        state: ChatLoadState.IDLE,
        error: null,
      });
      return false;
    }

    // Skip if already loading the same chat
    if (
      this.currentLoadContext.state === ChatLoadState.LOADING &&
      this.currentLoadContext.chatId === chatId
    ) {
      return false;
    }

    // Abort previous load if exists
    this.abort();

    // Clear messages if switching to different chat
    const previousChatId = chatStore.currentChatId;
    if (previousChatId && previousChatId !== chatId) {
      chatActions.clearMessages();
    }

    // Set loading state
    this.abortController = new AbortController();
    this.notify({
      chatId,
      state: ChatLoadState.LOADING,
      error: null,
    });

    try {
      const response = await fetchChatMessages(chatId, { page: 1, limit: 15 });

      // Check if aborted
      if (this.abortController?.signal.aborted) {
        return false;
      }

      // Set messages to store
      chatActions.setMessages(response.messages);
      
      // Clear chatMethod after loading (to allow future loads)
      uiActions.setChatMethod(null);

      // Dispatch event for reactivity
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chat:state-changed', {
          detail: {
            messages: response.messages,
            currentChatId: chatId,
          },
        }));
      }

      // Notify success
      this.notify({
        chatId,
        state: ChatLoadState.LOADED,
        error: null,
      });

      this.abortController = null;
      return true;
    } catch (err: any) {
      // Check if aborted
      if (err.name === 'AbortError') {
        return false;
      }

      const errorMessage = err.message || 'Failed to load chat messages';
      
      // Set empty messages on error
      chatActions.setMessages([]);

      // Notify error
      this.notify({
        chatId,
        state: ChatLoadState.ERROR,
        error: errorMessage,
      });

      this.abortController = null;
      throw err;
    }
  }

  /**
   * Handle new chat creation
   */
  handleNewChat(chatId: string): void {
    // Abort any ongoing loads
    this.abort();

    // Clear messages
    chatActions.clearMessages();
    
    // Set chatMethod to prevent auto-loading
    uiActions.setChatMethod('new-chat');

    // Reset state
    this.notify({
      chatId,
      state: ChatLoadState.IDLE,
      error: null,
    });
  }

  /**
   * Handle chat switch (from sidebar click)
   * This is the main entry point for switching chats
   */
  handleChatSwitch(chatId: string): void {
    // Clear chatMethod to allow loading
    uiActions.setChatMethod(null);
    
    // Set chatId in store first (before loading)
    chatActions.setCurrentChatId(chatId);
    
    // Load chat messages
    this.loadChat(chatId);
  }

  /**
   * Handle first message sent (clear new chat flag)
   */
  handleFirstMessageSent(): void {
    if (uiStore.chatMethod === 'new-chat') {
      uiActions.setChatMethod(null);
    }
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.abort();
    this.loadCallbacks.clear();
  }
}

// Singleton instance
export const chatFlowController = new ChatFlowController();

