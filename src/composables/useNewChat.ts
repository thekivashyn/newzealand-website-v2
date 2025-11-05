// Composable for new chat
import { $ } from '@builder.io/qwik';
import { chatActions } from '~/store/chat';
import { uiActions, uiStore } from '~/store/ui';
import { chatFlowController } from '~/services/chatFlowController';

export const useNewChat = () => {
  const startNewStudyMode = $(() => {
    // Use existing newChatId or generate new one if needed
    const newChatId = uiStore.newChatId || crypto.randomUUID();
    
    // Use ChatFlowController to handle new chat
    chatFlowController.handleNewChat(newChatId);
    
    // Set current chat ID
    chatActions.setCurrentChatId(newChatId);
    
    // Clear context
    uiActions.clearCurrentChatContext();
    uiActions.setMode('study-guide');
    
    if (!uiStore.newChatId) {
      uiActions.setNewChatId(newChatId);
    }
    
    // Navigate with chatId in URL (will be handled by useNavigate)
    // Note: We'll need to get navigate from component context
    return newChatId;
  });

  return {
    startNewStudyMode,
  };
};

