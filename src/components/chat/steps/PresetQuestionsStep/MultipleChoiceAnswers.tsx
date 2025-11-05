import { component$, $ } from '@builder.io/qwik';
import type { PresetMessageItem } from '../../types';

interface MultipleChoiceAnswersProps {
  question: PresetMessageItem;
  questionIndex: number;
  selectedAnswer?: string;
  theme: any;
  onAnswerSelect: (questionIndex: number, answer: string, question: PresetMessageItem) => void;
}

export const MultipleChoiceAnswers = component$<MultipleChoiceAnswersProps>((props) => {
  const { question, questionIndex, selectedAnswer, theme, onAnswerSelect } = props;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  if (!question.preset_answers || question.preset_answers.length === 0) {
    return null;
  }

  const getBorderColor = () => {
    const bgClass = theme.iconBg || theme.bg;
    const colorMap: Record<string, string> = {
      'bg-blue-400': 'rgba(96, 165, 250, 0.6)',
      'bg-pink-400': 'rgba(244, 114, 182, 0.6)',
      'bg-lime-400': 'rgba(163, 230, 53, 0.6)',
      'bg-orange-400': 'rgba(251, 146, 60, 0.6)',
      'bg-emerald-400': 'rgba(52, 211, 153, 0.6)',
      'bg-violet-400': 'rgba(167, 139, 250, 0.6)',
      'bg-cyan-400': 'rgba(34, 211, 238, 0.6)',
      'bg-rose-400': 'rgba(251, 113, 133, 0.6)',
      'bg-yellow-400': 'rgba(250, 204, 21, 0.6)',
      'bg-green-400': 'rgba(74, 222, 128, 0.6)',
    };
    return colorMap[bgClass] || 'rgba(96, 165, 250, 0.6)';
  };

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {question.preset_answers.map((answer: string, answerIdx: number) => {
        const isSelected = selectedAnswer === answer;
        
        return (
          <button
            key={answerIdx}
            onClick$={$(() => onAnswerSelect(questionIndex, answer, question))}
            class={`
              group relative
              rounded-xl p-4 text-left
              transition-all duration-300
              transform hover:scale-[1.02] active:scale-[0.98]
              backdrop-blur-sm border-2
              ${isSelected 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-white/10 hover:bg-white/15 hover:shadow-md'
              }
            `}
            style={{ borderColor: isSelected ? getBorderColor() : 'rgba(255, 255, 255, 0.2)' }}
            aria-label={`Option ${letters[answerIdx]}: ${answer}`}
            aria-pressed={isSelected}
            role="radio"
            aria-checked={isSelected}
          >
            <div class="flex items-center gap-3">
              {/* Letter Badge */}
              <div class={`
                flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm
                transition-all duration-300 shadow-sm
                ${isSelected 
                  ? `${theme.iconBg || theme.bg} text-black` 
                  : 'bg-white/20 text-white group-hover:bg-white/30'
                }
              `} aria-hidden="true">
                {isSelected ? (
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                ) : (
                  letters[answerIdx]
                )}
              </div>

              {/* Answer Text */}
              <span class={`
                text-sm sm:text-base font-medium flex-1
                transition-colors duration-300
                ${isSelected 
                  ? 'text-white font-semibold' 
                  : 'text-white/90 group-hover:text-white'
                }
              `}>
                {answer}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
});

