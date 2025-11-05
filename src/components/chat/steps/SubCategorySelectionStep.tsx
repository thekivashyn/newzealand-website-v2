import { component$, $, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { uiStore, uiActions } from '~/store/ui';
import { authStore } from '~/store/auth';
import { agentGroups, getTopicsByTermAndSubject, getTopicTheme } from '../constants';
import { GenericSelectionStep } from './GenericSelectionStep';
import type { AgentKey } from '../types';

export const SubCategorySelectionStep = component$(() => {
  const currentChatTerm = useSignal(uiStore.currentChatTerm);
  const currentChatSubject = useSignal(uiStore.currentChatSubject);
  const currentChatTopic = useSignal(uiStore.currentChatTopic);
  const authUser = useSignal(authStore.user);
  
  // Sync with store changes
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    currentChatTerm.value = uiStore.currentChatTerm;
    currentChatSubject.value = uiStore.currentChatSubject;
    currentChatTopic.value = uiStore.currentChatTopic;
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
      currentChatTerm.value = uiStore.currentChatTerm;
      currentChatSubject.value = uiStore.currentChatSubject;
      currentChatTopic.value = uiStore.currentChatTopic;
    };

    const handleAuthStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.user !== undefined) {
        authUser.value = customEvent.detail.user;
      }
      authUser.value = authStore.user;
    };

    window.addEventListener('ui:state-changed', handleUIStateChange);
    window.addEventListener('auth:state-changed', handleAuthStateChange);

    return () => {
      window.removeEventListener('ui:state-changed', handleUIStateChange);
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
  const currentSubCategories = selectedTopicData?.subCategories || [];
  
  // Check if sub-categories are available
  const hasSubCategories = currentSubCategories && currentSubCategories.length > 0;

  const handleSubCategoryClick$ = $((subCategoryKey: string) => {
    // Get the sub-category title from term-based constants for storage
    const topics = getTopicsByTermAndSubject(currentChatTerm.value, currentChatSubject.value, userGrade);
    const topicData = topics?.find(topic => topic.title === currentChatTopic.value);
    const subCategoryData = topicData?.subCategories?.find(sub => sub.key === subCategoryKey);
    const subCategoryTitle = subCategoryData?.title || subCategoryKey;

    // Update state - step will be recalculated automatically
    uiActions.setCurrentChatContext({
      term: currentChatTerm.value,
      subject: currentChatSubject.value,
      topic: currentChatTopic.value,
      subCategory: subCategoryTitle
    });
  });

  // Handle back navigation - go back to TopicSelectionStep
  const handleBack$ = $(() => {
    // Get current values from store at execution time
    const term = uiStore.currentChatTerm;
    const subject = uiStore.currentChatSubject;
    
    console.log('SubCategorySelectionStep handleBack$ called, clearing topic');
    
    // Clear topic to go back to TopicSelectionStep
    uiActions.setCurrentChatContext({
      term: term,
      subject: subject,
      topic: null,
      subCategory: null
    });
  });

  // Transform sub-categories to selection items
  const items = hasSubCategories ? currentSubCategories.map(subCategory => ({
    key: subCategory.key,
    title: subCategory.title,
    description: subCategory.description,
    icon: subCategory.icon,
    disabled: false
  })) : [];

  return (
    <GenericSelectionStep
      title="Choose a sub-category"
      subtitle="Select a specific area to practice."
      items={items}
      onSelect={handleSubCategoryClick$}
      breadcrumbs={[
        { label: 'Topics' },
        { label: selectedTopicData?.title || 'Topic' }
      ]}
      onBack={handleBack$}
      getTheme={() => getTopicTheme(selectedTopicData?.key || '')}
      parentTopicKey={selectedTopicData?.key}
      emptyState={{
        title: "No Sub-Categories Available",
        message: `Sub-categories for ${selectedTopicData?.title || 'this topic'} are currently being prepared. Please select a different topic.`,
        icon: selectedTopicData?.icon
      }}
    />
  );
});

