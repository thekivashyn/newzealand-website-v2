import { component$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useNewChat } from '~/composables/useNewChat';
import { uiActions } from '~/store/ui';

export const WelcomeStep = component$(() => {
  const navigate = useNavigate();
  const { startNewStudyMode } = useNewChat();
  
  const handleGetStarted$ = $(async () => {
    const newChatId = await startNewStudyMode();
    
    // Close mobile sidebar when navigating
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      uiActions.setMobileSidebarOpen(false);
    }
    
    // Collapse desktop sidebar when navigating
    uiActions.setDesktopSidebarCollapsed(true);
    
    // Navigate with chatId in URL
    navigate(`/?id=${newChatId}`, false);
  });

  return (
    <div
      class="relative flex flex-col items-center justify-center text-center is-selecting-agent h-full w-full overflow-hidden"
      style={{
        backgroundImage: 'url(/welcome-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo */}
      <div class="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <img
          src="/logo-white.png"
          alt="Ministry of Education"
          class="w-[140px] h-auto object-contain"
        />
      </div>

      {/* Main Content */}
      <div class="relative z-10 flex flex-col items-center justify-center px-6 max-w-5xl">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
          Kia ora
        </h1>
        
        <p class="text-2xl md:text-4xl lg:text-5xl text-white/95 font-light mb-12 md:mb-16 leading-relaxed max-w-4xl">
          Your maths learning journey starts here.
        </p>
        
        <button
          onClick$={handleGetStarted$}
          class="group flex items-center justify-center gap-3 px-16 py-4 md:px-24 md:py-5 bg-teal-800/40 backdrop-blur-sm border-2 border-teal-200/60 text-white font-semibold text-xl md:text-2xl rounded-2xl hover:bg-teal-700/50 hover:border-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-300/30 transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-lg min-w-[320px] md:min-w-[400px]"
        >
          Get started
          <svg 
            class="w-7 h-7 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
});
