import { component$, $ } from '@builder.io/qwik';
import { uiActions, uiStore } from '../../../store/ui';
import { agentGroups, getSubjectTheme } from '../constants';
import { GenericSelectionStep } from './GenericSelectionStep';
import type { AgentKey } from '../types';

export const SubjectSelectionStep = component$(() => {
  const handleAgentSelect$ = $((agentKey: string) => {
    const agentData = agentGroups.find(group => group.key === agentKey);
    const subjectTitle = agentData?.title || agentKey;
    
    uiActions.setCurrentChatContext({
      term: uiStore.currentChatTerm,
      subject: subjectTitle,
      topic: null,
      subCategory: null
    });
  });

  // Handle back navigation - go back to TermSelectionStep
  const handleBack$ = $(() => {
    console.log('SubjectSelectionStep handleBack$ called, clearing term');
    
    // Clear term to go back to TermSelectionStep
    uiActions.setCurrentChatContext({
      term: null,
      subject: null,
      topic: null,
      subCategory: null
    });
  });

  // Transform agentGroups to selection items
  const items = agentGroups.map(group => ({
    key: group.key,
    title: group.title,
    description: group.description,
    icon: group.icon,
    disabled: group.key !== 'mathematics'
  }));

  return (
    <GenericSelectionStep
      title="What would you like to learn today?"
      subtitle="Build your skills step by step."
      items={items}
      onSelect={handleAgentSelect$}
      breadcrumbs={[
        { label: 'Terms' },
        { label: 'Subjects' }
      ]}
      onBack={handleBack$}
      getTheme={(key) => getSubjectTheme(key as AgentKey)}
    />
  );
});

