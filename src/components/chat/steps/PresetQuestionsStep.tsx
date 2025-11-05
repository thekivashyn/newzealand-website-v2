import { component$, useSignal, useVisibleTask$, $, type QRL } from '@builder.io/qwik';
import { uiStore, uiActions } from '~/store/ui';
import { chatStore } from '~/store/chat';
import { authStore } from '~/store/auth';
import { agentGroups, getTopicsByTermAndSubject, getTopicTheme, getPresetMessagesByTermAndGrade } from '../constants';
import { EmptyHeaderCustom } from '../../EmptyHeaderCustom';
import { EmptyState } from '../shared/EmptyState';
import { ImageQuestionCard } from './PresetQuestionsStep/ImageQuestionCard';
import { RegularQuestionCard } from './PresetQuestionsStep/RegularQuestionCard';
import { MultipleChoiceAnswers } from './PresetQuestionsStep/MultipleChoiceAnswers';
import { useQuestionHandler } from './PresetQuestionsStep/useQuestionHandler';
import type { PresetMessageItem, PresetMessageValue } from '../types';
import type { AgentKey } from '../types';

interface PresetQuestionsStepProps {
  onSendMessage?: QRL<(message: string) => void>;
}

export const PresetQuestionsStep = component$<PresetQuestionsStepProps>((props) => {
  const currentChatTerm = useSignal(uiStore.currentChatTerm);
  const currentChatSubject = useSignal(uiStore.currentChatSubject);
  const currentChatTopic = useSignal(uiStore.currentChatTopic);
  const currentChatSubCategory = useSignal(uiStore.currentChatSubCategory);
  const currentChatId = useSignal(chatStore.currentChatId);
  const authUser = useSignal(authStore.user);
  
  // Sync with store changes
  useVisibleTask$(() => {
    currentChatTerm.value = uiStore.currentChatTerm;
    currentChatSubject.value = uiStore.currentChatSubject;
    currentChatTopic.value = uiStore.currentChatTopic;
    currentChatSubCategory.value = uiStore.currentChatSubCategory;
    currentChatId.value = chatStore.currentChatId;
    authUser.value = authStore.user;

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
      currentChatTerm.value = uiStore.currentChatTerm;
      currentChatSubject.value = uiStore.currentChatSubject;
      currentChatTopic.value = uiStore.currentChatTopic;
      currentChatSubCategory.value = uiStore.currentChatSubCategory;
    };

    const handleChatStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.currentChatId !== undefined) {
        currentChatId.value = customEvent.detail.currentChatId;
      }
      currentChatId.value = chatStore.currentChatId;
    };

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

  // Get user grade from auth context
  const userGrade = authUser.value?.grade_meta?.grade || "10";
  
  // Calculate currentAgentKey
  let currentAgentKey: AgentKey | null = null;
  if (currentChatSubject.value) {
    const agentData = agentGroups.find(group => group.title === currentChatSubject.value);
    currentAgentKey = (agentData?.key as AgentKey) || null;
  }

  // Use term-based topics from termData with user's grade
  const selectedAgentData = agentGroups.find(group => group.key === currentAgentKey);
  const topics = getTopicsByTermAndSubject(currentChatTerm.value, selectedAgentData?.title || null, userGrade);
  
  // Find selected topic by title (since we store title in state, not key)
  const selectedTopicData = topics?.find(topic => topic.title === currentChatTopic.value);
  const selectedSubCategoryData = selectedTopicData?.subCategories?.find(sub => sub.title === currentChatSubCategory.value);
  
  // Get subject and topic titles for API
  const subjectTitle = selectedAgentData?.title || null;
  const topicTitle = selectedTopicData?.title || null;
  
  // Get preset messages for the user's grade and term
  const presetMessagesForGrade = getPresetMessagesByTermAndGrade(currentChatTerm.value, userGrade);
  const agentMessages = presetMessagesForGrade[currentAgentKey || ''];
  
  // Find topic key from title
  const topicKey = selectedTopicData?.key || '';
  
  // Handle both old format (topic -> questions) and new format (topic -> subcategory -> questions)
  let currentPresets: PresetMessageValue[] = [];
  if (agentMessages && topicKey) {
    const topicMessages = agentMessages[topicKey];
    if (Array.isArray(topicMessages)) {
      // Old format: direct array of messages
      currentPresets = topicMessages;
    } else if (topicMessages && currentChatSubCategory.value) {
      // Find subcategory key from title
      const subCategoryKey = selectedSubCategoryData?.key || '';
      // New format: subcategory -> messages
      currentPresets = topicMessages[subCategoryKey] || [];
    }
  }
  
  // Normalize all messages to object format
  const normalizedPresets: PresetMessageItem[] = currentPresets.map(message => {
    if (typeof message === 'string') {
      // Auto-convert old string format to new object format
      return {
        type: 'single_ask' as const,
        value: message
      };
    }
    return message;
  });
  
  // Check if preset questions are available
  const hasPresets = normalizedPresets && normalizedPresets.length > 0;
  
      // Use custom hook for question handling with full context
      const { selectedAnswers, handlePresetClick$, handleAnswerSelect$ } = useQuestionHandler({ 
        onSendMessage: props.onSendMessage,
        chatId: currentChatId.value || undefined,
        subject: subjectTitle,
        topic: topicTitle,
      });

  // Get theme for styling
  const theme = getTopicTheme(topicKey);
  
  // Helper function to get border color from theme
  const getBorderColor = (themeObj: any) => {
    const bgClass = themeObj.iconBg || themeObj.bg;
    const colorMap: Record<string, string> = {
      'bg-blue-400': 'rgba(96, 165, 250, 0.4)',
      'bg-pink-400': 'rgba(244, 114, 182, 0.4)',
      'bg-lime-400': 'rgba(163, 230, 53, 0.4)',
      'bg-orange-400': 'rgba(251, 146, 60, 0.4)',
      'bg-emerald-400': 'rgba(52, 211, 153, 0.4)',
      'bg-violet-400': 'rgba(167, 139, 250, 0.4)',
      'bg-cyan-400': 'rgba(34, 211, 238, 0.4)',
      'bg-rose-400': 'rgba(251, 113, 133, 0.4)',
      'bg-yellow-400': 'rgba(250, 204, 21, 0.4)',
      'bg-green-400': 'rgba(74, 222, 128, 0.4)',
    };
    return colorMap[bgClass] || 'rgba(96, 165, 250, 0.4)';
  };

  // Handle back navigation - go back to SubCategorySelectionStep or TopicSelectionStep
  const handleBack$ = $(() => {
    // Get current values from store at execution time
    const term = uiStore.currentChatTerm;
    const subject = uiStore.currentChatSubject;
    const topic = uiStore.currentChatTopic;
    
    console.log('handleBack$ called, clearing subCategory');
    
    // Clear subCategory to go back
    uiActions.setCurrentChatContext({
      term: term,
      subject: subject,
      topic: topic,
      subCategory: null
    });
  });

  return (
    <div 
      class="relative flex h-full flex-col is-selecting-agent min-h-screen"
      style={{
        backgroundImage: 'url(/step-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <EmptyHeaderCustom 
        onBack={handleBack$}
        breadcrumbs={
          selectedSubCategoryData 
            ? [
                { label: 'Sub-categories' },
                { label: selectedSubCategoryData.title }
              ]
            : [
                { label: 'Topics' },
                { label: selectedTopicData?.title || 'Topic' }
              ]
        }
      />

      {/* Fixed Header Section */}
      <div class="flex-shrink-0 pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 lg:px-12">
        <div class="container mx-auto">
          <div class="flex flex-col items-center justify-center w-full text-center">
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Ready to solve a problem?
            </h2>
            <p class="text-white/90 text-base sm:text-lg md:text-xl">
              Select one and let's work it out together.
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div class="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-8">
        <div class="container mx-auto">
          {!hasPresets ? (
            <EmptyState 
              title="No Questions Available"
              message={`Practice questions for ${selectedSubCategoryData?.title || selectedTopicData?.title || 'this section'} are currently being prepared. Please select a different sub-category or topic.`}
              icon={selectedSubCategoryData?.icon || selectedTopicData?.icon}
            />
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full auto-rows-fr">
              {normalizedPresets.map((messageItem, index) => {
                const hasMultipleChoice = messageItem.preset_answers && messageItem.preset_answers.length > 0;
                const isMultiPart = messageItem.questions && messageItem.questions.length > 0;
                const isImageQuestion = messageItem.type === 'image_question';
                
                return (
                  <div key={index} class="w-full h-full flex flex-col">
                    {/* Image Question Card - Enhanced UX */}
                    {isImageQuestion && isMultiPart ? (
                      <ImageQuestionCard
                        question={messageItem}
                        index={index}
                        theme={theme}
                        onQuestionClick={handlePresetClick$}
                      />
                    ) : hasMultipleChoice ? (
                      /* Multiple Choice Question with Answers Container */
                      <div 
                        class="flex flex-col h-full bg-teal-800/30 backdrop-blur-md rounded-[24px] overflow-hidden border-2"
                        style={{ borderColor: getBorderColor(theme) }}
                      >
                        <div class="p-5 sm:p-6 border-b-2 border-white/10">
                          <div class="flex items-start gap-3 sm:gap-4">
                            <span class={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${(theme as any)?.iconBg || (theme as any)?.bg || 'bg-blue-400'} rounded-full text-sm font-bold text-black shadow-lg flex-shrink-0`}>
                              {index + 1}
                            </span>
                            <div class="flex-1 min-w-0 pt-1">
                              <p class="text-white text-sm sm:text-base leading-relaxed font-medium">
                                {messageItem.value}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Multiple Choice Answers - Inside same container */}
                        <div class="px-5 pb-5 pt-4">
                          <MultipleChoiceAnswers
                            question={messageItem}
                            questionIndex={index}
                            selectedAnswer={selectedAnswers.value[index]}
                            theme={theme}
                            onAnswerSelect={handleAnswerSelect$}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Regular Question without Multiple Choice */
                      <RegularQuestionCard
                        question={messageItem}
                        index={index}
                        theme={theme}
                        hasMultipleChoice={false}
                        onQuestionClick={handlePresetClick$}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
