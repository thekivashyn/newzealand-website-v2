import { component$ } from '@builder.io/qwik';

export type TemplateType = 'image_question' | 'multiple_choice' | 'answer_submission' | null;

interface TemplateBadgeProps {
  type: TemplateType;
  isActive: boolean;
  summary?: string | null;
}

/**
 * Badge component for displaying template types in chat history
 * Supports: Image Questions, Multiple Choice, Answer Submissions
 */
export const TemplateBadge = component$<TemplateBadgeProps>((props) => {
  if (!props.type) return null;

  const getBadgeConfig = () => {
    switch (props.type) {
      case 'image_question':
        return {
          label: 'Image Question',
          activeStyle: 'bg-white text-[#1B7A7A]',
          inactiveStyle: 'bg-amber-500/20 text-amber-200 group-hover:bg-amber-500/30',
        };
      
      case 'multiple_choice':
        return {
          label: 'Multiple Choice',
          activeStyle: 'bg-gray-900 text-green-400',
          inactiveStyle: 'bg-green-500/20 text-green-200 group-hover:bg-green-500/30',
        };
      
      case 'answer_submission':
        return {
          label: 'Quiz',
          activeStyle: 'bg-gray-900 text-blue-400',
          inactiveStyle: 'bg-blue-500/20 text-blue-200 group-hover:bg-blue-500/30',
        };
      
      default:
        return {
          label: 'Template',
          activeStyle: 'bg-gray-900 text-gray-400',
          inactiveStyle: 'bg-gray-500/20 text-gray-200 group-hover:bg-gray-500/30',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div class="flex items-center gap-1 min-w-0 flex-1">
      {/* Badge */}
      <span
        class={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide flex-shrink-0
          transition-all duration-300
          ${props.isActive ? config.activeStyle : config.inactiveStyle}
        `}
      >
        {config.label}
      </span>
      
      {/* Summary Text */}
      {props.summary && (
        <span class="truncate flex-1 min-w-0">
          {props.summary}
        </span>
      )}
    </div>
  );
});

