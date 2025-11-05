import { component$, $ } from '@builder.io/qwik';
import type { PresetMessageItem, SubQuestion } from '../../types';

interface ImageQuestionCardProps {
  question: PresetMessageItem;
  index: number;
  theme: any;
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

export const ImageQuestionCard = component$<ImageQuestionCardProps>((props) => {
  const { question, index, theme, onQuestionClick } = props;

  return (
    <div 
      class="bg-teal-800/30 backdrop-blur-md w-full h-full rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col border-2"
      style={{ borderColor: getBorderColorValue(theme) }}
    >
      {/* Header with Question Number */}
      <div class="p-5 sm:p-6 border-b-2 border-white/10 flex-shrink-0">
        <div class="flex items-center gap-4">
          <span class={`inline-flex items-center justify-center w-12 h-12 ${theme.iconBg || theme.bg} rounded-full text-base font-bold text-black shadow-lg`}>
            {index + 1}
          </span>
          <div class="flex-1">
            <h3 class="text-white text-sm sm:text-base font-bold">
              Question {index + 1}
            </h3>
            <p class="text-white/70 text-xs">
              {question.questions?.length || 0} parts
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid: 2 columns on desktop */}
      <div class="px-5 sm:px-6 pt-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch flex-1">
        {/* Left Column: Diagram */}
        <div class="space-y-3 flex flex-col h-full">
          {/* Question Context */}
          {question.question_context && (
            <div class="bg-white/5 border border-white/20 rounded-xl p-3">
              <p class="text-white/90 text-xs sm:text-sm leading-relaxed">
                {question.question_context}
              </p>
            </div>
          )}

          {/* Compact Diagram Image - Click to zoom */}
          {question.img_question && (
            <div 
              onClick$={() => {
                if (question.img_question) {
                  window.open(question.img_question, '_blank');
                }
              }}
              onKeyDown$={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && question.img_question) {
                  e.preventDefault();
                  window.open(question.img_question, '_blank');
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="View diagram in full size (opens in new tab)"
              class="rounded-xl overflow-hidden bg-white shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-200 relative group"
              title="Click to view full size"
            >
              <img 
                src={question.img_question} 
                alt={`Diagram for Question ${index + 1}`}
                class="w-full h-auto max-h-56 object-contain p-2"
                loading="lazy"
                decoding="async"
                onError$={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent && !parent.querySelector('.placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder flex flex-col items-center justify-center h-48 bg-white/5 text-white/40';
                    placeholder.innerHTML = '<svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-xs font-medium">Diagram will be generated</p>';
                    parent.appendChild(placeholder);
                  }
                }}
              />
              {/* Zoom indicator */}
              <div class="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Click to enlarge
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sub-questions */}
        <div class="space-y-2 flex flex-col h-full">
          <h4 class="text-white text-xs sm:text-sm font-bold mb-3 uppercase tracking-wide">
            Questions to Solve:
          </h4>
          {question.questions?.map((subQ: SubQuestion, subIdx: number) => (
            <div 
              key={subIdx} 
              class="bg-white/5 border border-white/20 rounded-lg p-3 flex gap-3 items-start"
            >
              <span class="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                {subQ.part}
              </span>
              <p class="text-white text-xs sm:text-sm leading-relaxed font-medium flex-1">
                {subQ.question}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div class="px-5 sm:px-6 pb-5 flex-shrink-0">
        <button
          onClick$={$(() => onQuestionClick(question))}
          class="w-full bg-teal-700/30 text-white rounded-full px-7 py-3 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-98 border-2 border-teal-200/60 hover:bg-teal-700/40 shadow-sm relative overflow-hidden group"
          aria-label={`Work on Question ${index + 1}`}
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            Work on this question
            <svg class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
});

