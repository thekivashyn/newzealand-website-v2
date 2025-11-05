import { component$, $, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { uiStore, uiActions } from '~/store/ui';
import { authStore } from '~/store/auth';
import { agentGroups, getTopicsByTermAndSubject, getTopicTheme } from '../constants';
import { PILOT_MODE_MATH_ONLY } from '~/config/pilotMode';
import { GenericSelectionStep } from './GenericSelectionStep';
import type { AgentKey } from '../types';

export const TopicSelectionStep = component$(() => {
  const currentChatTerm = useSignal(uiStore.currentChatTerm);
  const currentChatSubject = useSignal(uiStore.currentChatSubject);
  const authUser = useSignal(authStore.user);
  
  // Sync with store changes
  useVisibleTask$(() => {
    currentChatTerm.value = uiStore.currentChatTerm;
    currentChatSubject.value = uiStore.currentChatSubject;
    authUser.value = authStore.user;

    const handleUIStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.currentChatTerm !== undefined) {
        currentChatTerm.value = customEvent.detail.currentChatTerm;
      }
      if (customEvent.detail.currentChatSubject !== undefined) {
        currentChatSubject.value = customEvent.detail.currentChatSubject;
      }
      currentChatTerm.value = uiStore.currentChatTerm;
      currentChatSubject.value = uiStore.currentChatSubject;
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

  const selectedAgentData = agentGroups.find(group => group.key === currentAgentKey);
  // Use term-based topics from termData with user's grade
  const currentTopics = getTopicsByTermAndSubject(currentChatTerm.value, selectedAgentData?.title || null, userGrade);
  
  // Check if topics are available
  const hasTopics = currentTopics && currentTopics.length > 0;

  const handleTopicClick$ = $((topicKey: string) => {
    // Get the topic title from term-based constants for storage
    const topics = getTopicsByTermAndSubject(currentChatTerm.value, currentChatSubject.value, userGrade);
    const topicData = topics?.find(topic => topic.key === topicKey);
    const topicTitle = topicData?.title || topicKey;

    // Update state - step will be recalculated automatically
    uiActions.setCurrentChatContext({
      term: currentChatTerm.value,
      subject: currentChatSubject.value,
      topic: topicTitle,
      subCategory: null // Clear sub-category when selecting new topic
    });
  });

  // Handle back navigation - go back to SubjectSelectionStep or TermSelectionStep (if PILOT_MODE_MATH_ONLY)
  const handleBack$ = $(() => {
    // Get current values from store at execution time
    const term = uiStore.currentChatTerm;
    
    console.log('TopicSelectionStep handleBack$ called, clearing topic and subject');
    
    if (PILOT_MODE_MATH_ONLY) {
      // In pilot mode, go back to TermSelectionStep
      uiActions.setCurrentChatContext({
        term: null,
        subject: null,
        topic: null,
        subCategory: null
      });
    } else {
      // Normal mode: go back to SubjectSelectionStep
      uiActions.setCurrentChatContext({
        term: term,
        subject: null,
        topic: null,
        subCategory: null
      });
    }
  });

  // Transform topics to selection items
  const items = hasTopics ? currentTopics.map(topic => ({
    key: topic.key,
    title: topic.title,
    description: topic.description,
    icon: topic.icon,
    disabled: false
  })) : [];

  return (
    <GenericSelectionStep
      title="What topic interests you?"
      subtitle="Select to begin learning."
      items={items}
      onSelect={handleTopicClick$}
      breadcrumbs={[
        // PILOT MODE: Show 'Home' instead of 'Subjects' - clicking starts fresh like "Begin Your Journey"
        { label: PILOT_MODE_MATH_ONLY ? 'Home' : 'Subjects' },
        { label: `${currentChatTerm.value || ''} ${selectedAgentData?.title || 'Subject'}` }
      ]}
      onBack={handleBack$}
      getTheme={(key) => getTopicTheme(key)}
      emptyState={{
        title: "No Topics Available",
        message: `Topics for ${selectedAgentData?.title || 'this subject'} in ${currentChatTerm.value || 'this term'} are currently being prepared. Please select a different term or subject.`,
        icon: selectedAgentData?.icon
      }}
    />
  );
});

