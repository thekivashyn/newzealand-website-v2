import { component$, $ } from '@builder.io/qwik';
import { EmptyHeaderCustom } from '../../EmptyHeaderCustom';
import { EmptyState } from '../shared/EmptyState';
import { getPatternByTopic } from '../patterns/NZPatterns';

interface Breadcrumb {
  label: string;
  onClick?: () => void;
}

interface SelectionItem {
  key: string;
  title: string;
  description?: string;
  icon?: any; // SVG component
  disabled?: boolean;
}

interface Theme {
  bg: string;
  borderColor: string;
  shadow: string;
  text?: string;
  iconBg?: string;
  borderColorLight?: string;
}

interface GenericSelectionStepProps {
  title: string;
  subtitle: string;
  items: SelectionItem[];
  onSelect: (key: string) => void;
  onBack?: () => void;
  breadcrumbs: Breadcrumb[];
  getTheme: (key: string) => Theme;
  parentTopicKey?: string;
  emptyState?: {
    title: string;
    message: string;
    icon?: any;
  };
}

export const GenericSelectionStep = component$<GenericSelectionStepProps>((props) => {
  const {
    title,
    subtitle,
    items,
    onSelect,
    breadcrumbs,
    getTheme,
    parentTopicKey,
    emptyState
  } = props;

  const hasItems = items && items.length > 0;

  // Create a serializable handler that captures onSelect
  const handleItemClick$ = $((itemKey: string, disabled?: boolean) => {
    if (!disabled) {
      // eslint-disable-next-line qwik/valid-lexical-scope
      // Call onSelect directly - it's passed as a prop which is serializable
      onSelect(itemKey);
    }
  });

  // Map theme icon background colors to border colors with opacity
  const getBorderColor = (theme: Theme) => {
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
      'bg-red-400': 'rgba(248, 113, 113, 0.6)',
      'bg-purple-400': 'rgba(192, 132, 252, 0.6)',
      'bg-indigo-400': 'rgba(129, 140, 248, 0.6)',
      'bg-teal-400': 'rgba(45, 212, 191, 0.6)',
      'bg-fuchsia-400': 'rgba(232, 121, 249, 0.6)',
      'bg-amber-400': 'rgba(251, 191, 36, 0.6)',
      'bg-sky-400': 'rgba(56, 189, 248, 0.6)',
    };
    return colorMap[bgClass] || 'rgba(96, 165, 250, 0.6)';
  };

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
      <EmptyHeaderCustom breadcrumbs={breadcrumbs} onBack={props.onBack} />
      
      {/* Fixed Header Section */}
      <div class="flex-shrink-0 pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 lg:px-12">
        <div class="container mx-auto">
          <div class="flex flex-col items-center justify-center w-full text-center">
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              {title}
            </h2>
            <p class="text-white/90 text-base sm:text-lg md:text-xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div class="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-8">
        <div class="container mx-auto">
          {!hasItems && emptyState ? (
            <EmptyState 
              title={emptyState.title}
              message={emptyState.message}
              icon={emptyState.icon}
            />
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full max-w-6xl mx-auto">
              {items.map((item) => {
                const theme = getTheme(item.key);
                const isDisabled = item.disabled || false;
                const borderColor = getBorderColor(theme);
                
                // Use parent topic pattern for sub-categories, otherwise use item's own pattern
                const PatternComponent = getPatternByTopic(parentTopicKey || item.key);
                
                return (
                  <div
                    key={item.key}
                    class={`
                      relative bg-teal-800/30 backdrop-blur-md
                      rounded-[28px] p-6 sm:p-7 group
                      border-2
                      transition-all duration-300
                      flex flex-col min-h-[200px] overflow-hidden
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-teal-800/40'}
                    `}
                    style={{ borderColor: borderColor }}
                    onClick$={() => handleItemClick$(item.key, isDisabled)}
                    tabIndex={isDisabled ? -1 : 0}
                    role="button"
                    aria-label={`Select ${item.title}: ${item.description || ''}`}
                    aria-disabled={isDisabled}
                  >
                    {/* NZ Cultural Pattern Background */}
                    <PatternComponent color="white" opacity={0.08} />
                    
                    {/* Card Content */}
                    <div class="flex items-start gap-4 mb-6 flex-1 relative z-10">
                      {/* Icon (if provided) */}
                      {item.icon && (
                        <div class={`
                          w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center 
                          ${theme.iconBg || theme.bg}
                          flex-shrink-0
                          shadow-lg
                        `}>
                          <item.icon class="w-8 h-8 sm:w-9 sm:h-9 text-black" />
                        </div>
                      )}
                      
                      {/* Text Content */}
                      <div class="flex-1 min-w-0 pt-1">
                        <h3 class="font-bold text-xl sm:text-2xl mb-2.5 text-white leading-tight">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p class="text-sm sm:text-base text-white/90 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Select Button or Status Badge */}
                    <div class="flex justify-end items-end relative z-10 mt-auto">
                      {isDisabled ? (
                        <span class="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm border-2 border-white/40">
                          Coming Soon
                        </span>
                      ) : (
                        <button
                          class="inline-flex items-center gap-2.5 px-7 py-2.5 rounded-full border-2 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300 shadow-sm"
                          style={{ borderColor: borderColor }}
                          onClick$={(e) => {
                            e.stopPropagation();
                            handleItemClick$(item.key, isDisabled);
                          }}
                        >
                          Select
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      )}
                    </div>
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

