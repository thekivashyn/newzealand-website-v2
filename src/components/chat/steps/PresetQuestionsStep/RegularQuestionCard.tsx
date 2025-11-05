import { component$, $ } from '@builder.io/qwik';
import type { PresetMessageItem } from '../../types';

interface RegularQuestionCardProps {
  question: PresetMessageItem;
  index: number;
  theme: any;
  hasMultipleChoice: boolean;
  onQuestionClick: (question: PresetMessageItem) => void;
}

// Helper function to get actual color values for borders with opacity
const getBorderColorValue = (theme: any) => {
  const bgClass = theme.iconBg || theme.bg;
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

export const RegularQuestionCard = component$<RegularQuestionCardProps>((props) => {
  const { question, index, theme, hasMultipleChoice, onQuestionClick } = props;
  const questionText = question.value || '';

  if (hasMultipleChoice) {
    // Multiple choice question - use cream/beige background style
    return (
      <button
        onClick$={$(() => onQuestionClick(question))}
        disabled={true}
        class="bg-teal-800/30 backdrop-blur-md w-full rounded-t-[24px] p-5 sm:p-6 text-left border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 group relative overflow-hidden flex flex-col cursor-default"
        style={{ borderColor: getBorderColorValue(theme), borderBottom: 'none' }}
      >
        <div class="relative flex items-start gap-3 sm:gap-4 z-10">
          <span class={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${theme.iconBg || theme.bg} rounded-full text-sm font-bold text-black shadow-lg transition-all duration-300 flex-shrink-0 relative overflow-hidden`}>
            <span class="relative z-10">{index + 1}</span>
          </span>
          
          <div class="flex-1 min-w-0 relative z-10 pt-1">
            <p class="text-white text-sm sm:text-base leading-relaxed font-medium transition-all duration-300">
              {questionText}
            </p>
          </div>
        </div>
      </button>
    );
  }

  // Regular question without multiple choice - same style as topic cards
  return (
    <button
      onClick$={$(() => onQuestionClick(question))}
      class="bg-teal-800/30 backdrop-blur-md w-full rounded-[24px] h-full p-5 sm:p-6 text-left border-2 transition-all duration-300 hover:bg-teal-800/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 group relative overflow-hidden flex flex-col"
      style={{ borderColor: getBorderColorValue(theme) }}
      aria-label={`Question ${index + 1}: ${questionText}`}
    >
      <div class="relative flex items-start gap-3 sm:gap-4 z-10 flex-1">
        <span class={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${theme.iconBg || theme.bg} rounded-full text-sm font-bold text-black shadow-lg transition-all duration-300 flex-shrink-0 transform group-hover:scale-105 relative overflow-hidden`}>
          <span class="relative z-10">{index + 1}</span>
        </span>
        
        <div class="flex-1 min-w-0 relative z-10 pt-1">
          <p class="text-white text-sm sm:text-base leading-relaxed font-medium transition-all duration-300">
            {questionText}
          </p>
        </div>
        
        <div class="flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mt-2 transform group-hover:scale-110 relative z-10" aria-hidden="true">
          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
});

