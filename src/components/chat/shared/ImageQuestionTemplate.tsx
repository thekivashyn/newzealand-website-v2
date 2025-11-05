import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface ImageQuestionData {
  type: 'image_question_submission';
  questionData: {
    context: string;
    diagram_url: string;
    parts: Array<{
      part: string;
      question: string;
    }>;
  };
}

interface ImageQuestionTemplateProps {
  data: ImageQuestionData;
}

export const ImageQuestionTemplate = component$<ImageQuestionTemplateProps>((props) => {
  const { context, diagram_url, parts } = props.data.questionData;
  const isImageModalOpen = useSignal(false);

  // ESC key to close modal
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => isImageModalOpen.value);
    
    if (typeof window === 'undefined') return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageModalOpen.value) {
        isImageModalOpen.value = false;
      }
    };

    if (isImageModalOpen.value) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  });

  return (
    <>
      {/* Image Preview Modal with Questions - Side by Side Layout */}
      {isImageModalOpen.value && diagram_url && (
        <div 
          class="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick$={() => isImageModalOpen.value = false}
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-modal-title"
        >
          <button
            onClick$={() => isImageModalOpen.value = false}
            class="fixed top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-xl z-10"
            aria-label="Close preview (ESC)"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            class="relative w-full max-w-7xl h-[90vh] flex"
            onClick$={(e) => e.stopPropagation()}
          >
            {/* Container with Image + Questions - 2 Column Layout */}
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-teal-400/60 w-full flex">
              {/* LEFT: Image Column - Full Height */}
              <div class="w-1/2 bg-white/5 backdrop-blur-sm flex items-center justify-center p-8 border-r border-teal-400/30">
                <div class="bg-white rounded-xl overflow-hidden border-2 border-teal-400/60 shadow-2xl w-full h-full flex items-center justify-center">
                  <img 
                    src={diagram_url} 
                    alt="Question diagram - Full size preview"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* RIGHT: Context + Questions Column - Scrollable */}
              <div class="w-1/2 overflow-y-auto">
                <div class="p-8 space-y-6">
                  {/* Context if exists */}
                  {context && (
                    <div class="bg-slate-700/50 border-2 border-teal-400/40 rounded-xl p-5">
                      <h4 class="text-teal-300 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        Context
                      </h4>
                      <p class="text-white text-base leading-relaxed">
                        {context}
                      </p>
                    </div>
                  )}

                  {/* Questions List */}
                  <div class="space-y-4">
                    <div class="flex items-center gap-2">
                      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" aria-hidden="true"></div>
                      <h4 id="image-modal-title" class="text-teal-300 text-base font-bold uppercase tracking-wider">
                        Questions to Solve
                      </h4>
                      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" aria-hidden="true"></div>
                    </div>
                    
                    {parts.map((part, idx) => (
                      <div 
                        key={idx} 
                        class="bg-slate-700/60 border-2 border-teal-400/50 rounded-xl p-5 flex gap-4 items-start shadow-md"
                      >
                        <span class="bg-gradient-to-br from-teal-500 to-teal-600 text-white min-w-[36px] h-9 rounded-lg flex items-center justify-center font-bold text-base flex-shrink-0 shadow-lg">
                          {part.part}
                        </span>
                        <p class="text-white text-base leading-relaxed flex-1 pt-1">
                          {part.question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Template */}
      <div class="w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-teal-500/60 hover:border-teal-400/80 transition-all duration-300">
        {/* Header - Professional with solid gradient */}
        <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 flex items-center gap-3 border-b border-teal-400/30 shadow-md">
          <div class="bg-white/25 rounded-lg p-1.5 shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white font-bold text-sm tracking-wide">Multi-Part Question</h3>
            <p class="text-white/90 text-xs">Solve all parts for complete solution</p>
          </div>
        </div>

        {/* Content - Enhanced spacing */}
        <div class="p-5 space-y-4">
          {/* Context - Enhanced readability */}
          {context && (
            <div class="bg-slate-700/50 border border-teal-400/40 rounded-xl p-4 shadow-inner">
              <p class="text-white text-sm leading-relaxed">
                {context}
              </p>
            </div>
          )}

          {/* Diagram - Enhanced presentation */}
          {diagram_url && (
            <div 
              onClick$={() => isImageModalOpen.value = true}
              onKeyDown$={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  isImageModalOpen.value = true;
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Click to preview full size image"
              class="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative group border-2 border-teal-400/60 shadow-lg"
              title="Click to preview full size"
            >
              <img 
                src={diagram_url} 
                alt="Question diagram" 
                class="w-full h-auto max-h-48 object-contain p-3"
                loading="lazy"
                decoding="async"
              />
              {/* Hover overlay with zoom indicator */}
              <div class="absolute inset-0 bg-teal-600/0 group-hover:bg-teal-600/10 transition-all duration-300 flex items-center justify-center">
                <div class="bg-teal-600 text-white px-3 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg flex items-center gap-2">
                  <span>🔍</span>
                  <span>Click to preview</span>
                </div>
              </div>
            </div>
          )}

          {/* Parts - Professional cards */}
          <div class="space-y-3">
            <div class="flex items-center gap-2 mb-3">
              <div class="h-px flex-1 bg-gradient-to-r from-transparent via-teal-400/70 to-transparent"></div>
              <h4 class="text-teal-300 text-sm font-bold uppercase tracking-wider">
                Questions
              </h4>
              <div class="h-px flex-1 bg-gradient-to-r from-transparent via-teal-400/70 to-transparent"></div>
            </div>
            
            {parts.map((part, idx) => (
              <div 
                key={idx} 
                class="bg-slate-700/60 border-2 border-teal-400/50 rounded-xl p-4 flex gap-3 items-start hover:bg-slate-700/80 hover:border-teal-300/70 transition-all duration-300 group shadow-md"
              >
                <span class="bg-gradient-to-br from-teal-500 to-teal-600 text-white min-w-[28px] h-7 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {part.part}
                </span>
                <p class="text-white text-sm leading-relaxed flex-1 pt-0.5">
                  {part.question}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note - Enhanced with icon */}
          <div class="bg-gradient-to-r from-teal-600/30 to-teal-500/30 border-2 border-teal-400/50 rounded-xl px-4 py-3 flex items-center gap-3 shadow-md">
            <div class="bg-teal-500/40 rounded-full p-2 shadow-sm">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-white text-sm font-medium">
              AI will provide step-by-step guidance for each part
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

