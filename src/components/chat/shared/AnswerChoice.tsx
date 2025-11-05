import { component$, useSignal, $ } from '@builder.io/qwik';
import { getQuizTheme } from '../constants';
import { CustomMarkdown } from './CustomMarkdown';

interface AnswerChoiceProps {
  choices: string[];
  questionText?: string;
  correctAnswer?: number;
  questionNumber?: number;
  subject?: string;
  onAnswerSubmit$?: (selectedChoice: number) => void;
}

/**
 * AnswerChoice Component - Optimized for Qwik
 * Displays answer choices with theme-based styling
 */
export const AnswerChoice = component$<AnswerChoiceProps>((props) => {
  const selectedChoice = useSignal<number | null>(null);
  
  // Get theme using subject
  const theme = getQuizTheme(props.subject || 'default');

  const handleChoiceClick$ = $((choiceIndex: number) => {
    selectedChoice.value = choiceIndex;
    if (props.onAnswerSubmit$) {
      props.onAnswerSubmit$(choiceIndex);
    }
  });

  const getChoiceStyle = (choiceIndex: number) => {
    if (selectedChoice.value === choiceIndex) {
      return `${theme.optionSelected} transition-all duration-200`;
    }
    return `${theme.optionDefault}`;
  };

  const textColor = 'textColor' in theme ? (theme.textColor as string) : 'text-black';
  
  return (
    <div class={textColor}>
      {props.questionText && (
        <div class={`mb-2 font-medium ${textColor}`}>
          <CustomMarkdown content={props.questionText} />
        </div>
      )}
      
      <div 
        class="space-y-2"
        role="radiogroup"
        aria-label="Answer choices"
      >
        {props.choices.map((choice, index) => (
          <button
            key={index}
            onClick$={() => handleChoiceClick$(index)}
            class={`w-full text-left p-3 flex items-center gap-2 ${theme.focusRing} ${getChoiceStyle(index)}`}
            role="radio"
            aria-checked={selectedChoice.value === index}
            aria-label={`Option ${String.fromCharCode(65 + index)}: ${choice
              .replace(/\$\$[\s\S]*?\$\$/g, '')
              .replace(/\$[^$]*\$/g, '')
              .replace(/\\\([\s\S]*?\\\)/g, '')
              .replace(/\\\[[\s\S]*?\\\]/g, '')
              .trim()}`}
            tabIndex={0}
            onKeyDown$={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleChoiceClick$(index);
              }
            }}
          >
            <span 
              class={`flex-shrink-0 w-7 h-7 rounded-full bg-white/20 ${textColor} text-sm font-bold flex items-center justify-center backdrop-blur-sm shadow-sm`}
              aria-hidden="true"
            >
              {String.fromCharCode(65 + index)}
            </span>
            <div class="flex-1 choice-math-content text-sm font-medium">
              <CustomMarkdown content={choice} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

