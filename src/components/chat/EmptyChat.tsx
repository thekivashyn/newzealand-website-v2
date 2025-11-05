import { component$, useSignal, useVisibleTask$, type QRL } from '@builder.io/qwik';
import { uiStore } from '~/store/ui';
import { chatStore } from '~/store/chat';
import { authStore } from '~/store/auth';
import { WelcomeStep, TermSelectionStep, SubjectSelectionStep, TopicSelectionStep, SubCategorySelectionStep, PresetQuestionsStep } from './steps';
import { getTopicsByTermAndSubject } from './constants';
import { PILOT_MODE_MATH_ONLY } from '~/config/pilotMode';
import type { StepType } from './types';

interface EmptyChatProps {
  onSendMessage?: QRL<(message: string) => void>;
}

export const EmptyChat = component$<EmptyChatProps>((props) => {
  // Use signals to track reactive state
  const currentChatTerm = useSignal(uiStore.currentChatTerm);
  const currentChatSubject = useSignal(uiStore.currentChatSubject);
  const currentChatTopic = useSignal(uiStore.currentChatTopic);
  const currentChatSubCategory = useSignal(uiStore.currentChatSubCategory);
  const currentChatId = useSignal(chatStore.currentChatId);
  const authUser = useSignal(authStore.user);
  
  // Sync with store changes via events
  useVisibleTask$(() => {
    // Initial sync
    currentChatTerm.value = uiStore.currentChatTerm;
    currentChatSubject.value = uiStore.currentChatSubject;
    currentChatTopic.value = uiStore.currentChatTopic;
    currentChatSubCategory.value = uiStore.currentChatSubCategory;
    currentChatId.value = chatStore.currentChatId;
    authUser.value = authStore.user;

    // Listen for UI state changes
    const handleUIStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.currentChatTerm !== undefined) {
        currentChatTerm.value = customEvent.detail.currentChatTerm;
      }
      if (customEvent.detail.currentChatSubject !== undefined) {
        currentChatSubject.value = customEvent.detail.currentChatSubject;
      }
      if (customEvent.detail.currentChatTopic !== undefined) {
        currentChatTopic.value = customEvent.detail.currentChatTopic;
      }
      if (customEvent.detail.currentChatSubCategory !== undefined) {
        currentChatSubCategory.value = customEvent.detail.currentChatSubCategory;
      }
      // Also sync directly from store
      currentChatTerm.value = uiStore.currentChatTerm;
      currentChatSubject.value = uiStore.currentChatSubject;
      currentChatTopic.value = uiStore.currentChatTopic;
      currentChatSubCategory.value = uiStore.currentChatSubCategory;
    };

    // Listen for chat state changes
    const handleChatStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.currentChatId !== undefined) {
        currentChatId.value = customEvent.detail.currentChatId;
      }
      // Also sync directly from store
      currentChatId.value = chatStore.currentChatId;
    };

    // Listen for auth state changes
    const handleAuthStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.user !== undefined) {
        authUser.value = customEvent.detail.user;
      }
      authUser.value = authStore.user;
    };

    window.addEventListener('ui:state-changed', handleUIStateChange);
    window.addEventListener('chat:state-changed', handleChatStateChange);
    window.addEventListener('auth:state-changed', handleAuthStateChange);

    return () => {
      window.removeEventListener('ui:state-changed', handleUIStateChange);
      window.removeEventListener('chat:state-changed', handleChatStateChange);
      window.removeEventListener('auth:state-changed', handleAuthStateChange);
    };
  });
  
  // Calculate current step reactively - access signals directly in render body
  // This ensures Qwik tracks them and re-renders when they change
  const currentStep = ((): StepType => {
    // Access signals directly - Qwik will track these dependencies
    const chatId = currentChatId.value;
    const term = currentChatTerm.value;
    const subject = currentChatSubject.value;
    const topic = currentChatTopic.value;
    const subCategory = currentChatSubCategory.value;
  const userGrade = authUser.value?.grade_meta?.grade || "10";
  
    // Debug logging
    console.log('📋 EmptyChat - Step calculation:', {
      chatId,
      term,
      subject,
      topic,
      subCategory,
      userGrade
    });
  
    // Step 0: Welcome (no term, subject, topic, and no chat ID)
    if (!chatId && !term && !subject && !topic) {
      console.log('📋 EmptyChat - Returning Step 0 (Welcome)');
      return 0;
    }
    
    // Step 5: PresetQuestionsStep - have term, subject, topic, and subCategory
    if (term && subject && topic && subCategory) {
      console.log('📋 EmptyChat - Returning Step 5 (PresetQuestionsStep - with subCategory)');
      return 5;
    }
    
    // Step 4/5: PresetQuestionsStep - have term, subject, topic (check if subcategories needed)
    if (term && subject && topic) {
      // Check if the topic has sub-categories
      const topics = getTopicsByTermAndSubject(term, subject, userGrade);
      const topicData = topics?.find(t => t.title === topic);
      
      if (topicData?.subCategories && topicData.subCategories.length > 0) {
        console.log('📋 EmptyChat - Returning Step 4 (SubCategorySelectionStep)');
        return 4; // SubCategorySelectionStep - need to select sub-category
      } else {
        console.log('📋 EmptyChat - Returning Step 5 (PresetQuestionsStep - no subCategory)');
        return 5; // PresetQuestionsStep - no sub-categories, go directly to questions
      }
    }
    
    // Step 3: TopicSelectionStep - have term and subject, need topic
    if (term && subject) {
      console.log('📋 EmptyChat - Returning Step 3 (TopicSelectionStep)');
      return 3;
    }
    
    // Step 2: SubjectSelectionStep - have term, need subject
    // PILOT_MODE: Skip SubjectSelection (step 2) and go directly to TopicSelection (step 3)
    if (term) {
      if (PILOT_MODE_MATH_ONLY) {
        console.log('📋 EmptyChat - Returning Step 3 (TopicSelectionStep - PILOT MODE)');
        return 3; // TopicSelectionStep - skip subject selection in pilot mode
      } else {
        console.log('📋 EmptyChat - Returning Step 2 (SubjectSelectionStep)');
        return 2; // SubjectSelectionStep - have term, need to select subject
      }
    }
    
    // Step 1: TermSelectionStep - need term
    console.log('📋 EmptyChat - Returning Step 1 (TermSelectionStep)');
    return 1;
  })();

  if (currentStep === 0) {
    return <WelcomeStep />;
  }

  if (currentStep === 1) {
    return <TermSelectionStep />;
  }

  if (currentStep === 2) {
    return <SubjectSelectionStep />;
  }

  if (currentStep === 3) {
    return <TopicSelectionStep />;
  }

  if (currentStep === 4) {
    return <SubCategorySelectionStep />;
  }

  if (currentStep === 5) {
    return <PresetQuestionsStep onSendMessage={props.onSendMessage} />;
  }

  return (
    <div class="flex-1 flex items-center justify-center bg-learning-cream">
      <div class="text-center">
        <p class="text-gray-600">Empty chat state</p>
      </div>
    </div>
  );
});
