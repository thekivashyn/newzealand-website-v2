import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { Chat } from "../components/chat/Chat";
import { chatActions, chatStore } from "~/store/chat";
import { uiStore } from "~/store/ui";
import { chatFlowController } from "~/services/chatFlowController";

export default component$(() => {
  const location = useLocation();
  
  // Sync chatId from URL to store whenever URL changes
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    // Track location.url.search to react to URL changes
    track(() => location.url.search);
    
    const urlParams = new URLSearchParams(location.url.search);
    const chatIdFromUrl = urlParams.get('id');
    
    if (chatIdFromUrl) {
      // Only update if different to avoid unnecessary re-renders
      if (chatIdFromUrl !== chatStore.currentChatId) {
        // Set chatId first
      chatActions.setCurrentChatId(chatIdFromUrl);
        
        // Always load chat when chatId is in URL (unless it's explicitly a new chat)
        // This handles cases like:
        // - Direct URL access (bookmark/reload)
        // - Browser back/forward navigation
        // - Clicking sidebar chat items
        if (uiStore.chatMethod !== 'new-chat') {
          chatFlowController.handleChatSwitch(chatIdFromUrl);
        }
      }
    } else {
      // No chatId in URL - clear current chat if exists
      if (chatStore.currentChatId) {
        chatActions.setCurrentChatId(null);
        chatActions.clearMessages();
      }
    }
  });
  
  return <Chat />;
});

export const head: DocumentHead = {
  title: "Home | Ministry Of Education",
};
