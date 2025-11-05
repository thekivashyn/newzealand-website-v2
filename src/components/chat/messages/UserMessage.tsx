import { component$, useSignal, $ } from '@builder.io/qwik';
import type { ChatMessage } from '~/store/types';
import { ImageQuestionTemplate } from '../shared/ImageQuestionTemplate';
import { MultipleChoiceTemplate } from '../shared/MultipleChoiceTemplate';
import { AnswerTemplate, type AnswerSubmission } from '../shared/AnswerTemplate';
import { uiStore } from '~/store/ui';

interface UserMessageProps {
  message: ChatMessage;
  onCopy?: (content: string) => void;
}

export const UserMessage = component$<UserMessageProps>((props) => {
  const isCopied = useSignal(false);
  
  // Extract and parse template data once per render
  const textContent = typeof props.message.content === 'string' ? props.message.content : '';
  const imageQuestionPrefix = '<-Image Question Template-> ';
  const multipleChoicePrefix = '<-Multiple Choice Template-> ';
  const answerTemplatePrefix = '<-Answer Template-> ';
  
  // Memoize template detection and parsing
  const templateData = (() => {
    const isImageQuestion = textContent.includes(imageQuestionPrefix);
    const isMultipleChoice = textContent.includes(multipleChoicePrefix);
    const isAnswerTemplate = textContent.includes(answerTemplatePrefix);
    
    let imageQuestionData: any = null;
    let multipleChoiceData: any = null;
    let answerSubmission: AnswerSubmission | null = null;
    
    if (isImageQuestion) {
      try {
        const content = textContent.replace(imageQuestionPrefix, '');
        imageQuestionData = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse image question data:', e);
      }
    }
    
    if (isMultipleChoice) {
      try {
        const content = textContent.replace(multipleChoicePrefix, '');
        multipleChoiceData = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse multiple choice data:', e);
      }
    }
    
    if (isAnswerTemplate) {
      try {
        const content = textContent.replace(answerTemplatePrefix, '').trim();
        answerSubmission = JSON.parse(content) as AnswerSubmission;
      } catch (e) {
        console.error('Failed to parse answer template data:', e);
      }
    }
    
    return {
      isImageQuestion,
      isMultipleChoice,
      isAnswerTemplate,
      imageQuestionData,
      multipleChoiceData,
      answerSubmission,
      processedTextContent: isImageQuestion || isMultipleChoice || isAnswerTemplate
        ? textContent.replace(imageQuestionPrefix, '').replace(multipleChoicePrefix, '').replace(answerTemplatePrefix, '')
        : textContent,
    };
  })();
  
  const { imageQuestionData, multipleChoiceData, answerSubmission, isAnswerTemplate, processedTextContent } = templateData;
  
  const handleCopy$ = $(async () => {
    if (props.onCopy) {
      props.onCopy(processedTextContent);
    } else {
      await navigator.clipboard.writeText(processedTextContent);
    }
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  });

  return (
    <div class={`group relative flex flex-col items-end space-y-1.5 sm:space-y-2 ${
      imageQuestionData || multipleChoiceData || answerSubmission || isAnswerTemplate ? 'w-full' : 'max-w-xl sm:max-w-2xl'
    }`}>
      <div
        class={`${
          imageQuestionData || multipleChoiceData || answerSubmission || isAnswerTemplate ? 'w-full' : 'max-w-fit'
        } rounded-2xl text-white bg-[#1B7A7A] ${
          imageQuestionData || multipleChoiceData || answerSubmission || isAnswerTemplate ? 'p-0 bg-transparent' : 
          'px-3 py-1.5 sm:px-4 sm:py-2'
        }`}
      >
        {answerSubmission ? (
          <div class="w-full">
            <AnswerTemplate 
              submission={answerSubmission} 
              displayMode="submitted"
              subject={uiStore.currentChatSubject || undefined}
            />
          </div>
        ) : multipleChoiceData ? (
          <div class="w-full">
            <MultipleChoiceTemplate data={multipleChoiceData} />
          </div>
        ) : imageQuestionData ? (
          <div class="w-full">
            <ImageQuestionTemplate data={imageQuestionData} />
          </div>
        ) : (
          <p class="not-prose whitespace-pre-wrap text-sm sm:text-base">{processedTextContent}</p>
        )}
      </div>

      {/* Hover Actions - Hidden for templates */}
      {!multipleChoiceData && !answerSubmission && (
        <div class="absolute top-0 right-full mr-1.5 sm:mr-2 flex items-center space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick$={handleCopy$}
            class="rounded-full bg-gray-800 p-1.5 text-gray-300 shadow-sm transition-all hover:scale-110 hover:bg-gray-900 touch-manipulation"
            title={isCopied.value ? 'Copied!' : 'Copy'}
            aria-label={isCopied.value ? 'Copied to clipboard' : 'Copy to clipboard'}
          >
            {isCopied.value ? (
              <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
});

