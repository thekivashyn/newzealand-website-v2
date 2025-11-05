import { component$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface EmptyHeaderCustomProps {
  onBack?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  backText?: string;
  logo?: string;
}

export const EmptyHeaderCustom = component$<EmptyHeaderCustomProps>((props) => {
  const navigate = useNavigate();
  const { onBack, breadcrumbs, backText, logo } = props;

  const handleBackClick$ = $(() => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  });


  const renderBackButton = () => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return (
        <nav class="flex items-center gap-2 sm:gap-3 text-sm whitespace-nowrap pointer-events-auto">
          {breadcrumbs.map((item, index) => {
            // For the first breadcrumb item, if it has onClick or we have onBack prop, make it clickable
            const isFirstItem = index === 0;
            const isClickable = isFirstItem && (item.onClick || onBack);
            const handlerToUse = item.onClick || (isFirstItem ? onBack : undefined);
            
            return (
              <>
                {isClickable && handlerToUse ? (
                  <button
                    type="button"
                    onClick$={$((event: MouseEvent) => {
                      event.preventDefault();
                      event.stopPropagation();
                      console.log('Breadcrumb button clicked:', item.label);
                      
                      // Call the handler
                      try {
                        // eslint-disable-next-line qwik/valid-lexical-scope
                        if (handlerToUse) {
                          console.log('Executing breadcrumb onClick handler');
                          handlerToUse();
                        }
                      } catch (error) {
                        console.error('Error executing breadcrumb handler:', error);
                      }
                    })}
                    class="group flex items-center gap-1.5 sm:gap-3 text-white hover:text-white/80 transition-all duration-300 cursor-pointer relative z-50 pointer-events-auto"
                    style={{ pointerEvents: 'auto' }}
                    aria-label={`Go back to ${item.label}`}
                  >
                    {index === 0 && (
                      <div class="w-7 h-7 sm:w-auto sm:h-auto flex items-center justify-center rounded-full bg-white/10 sm:bg-transparent" aria-hidden="true">
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:translate-x-[-2px]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </div>
                    )}
                    <span class="hidden sm:inline tracking-wide whitespace-nowrap">{item.label}</span>
                  </button>
                ) : (
                  <span class="text-white/80 text-sm whitespace-nowrap hidden sm:inline">{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span class="text-white/60 text-sm whitespace-nowrap hidden sm:inline">/</span>
                )}
              </>
            );
          })}
        </nav>
      );
    }
    
    if (backText && onBack) {
      return (
        <button
          onClick$={handleBackClick$}
          class="flex items-center gap-1.5 sm:gap-2 text-black hover:text-gray-800 transition-colors duration-200 cursor-pointer group px-2 py-2 sm:px-3"
          aria-label={backText}
        >
          <div class="w-7 h-7 sm:w-auto sm:h-auto flex items-center justify-center rounded-full bg-learning-primary/10 sm:bg-transparent" aria-hidden="true">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-[-2px] transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span class="text-sm font-medium hidden sm:inline">{backText}</span>
        </button>
      );
    }
    
    if (onBack) {
      return (
        <button
          onClick$={handleBackClick$}
          class="group text-white hover:text-white/80 font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 bg-transparent hover:bg-transparent active:bg-transparent hover:shadow-none px-2 py-2 sm:px-3 border-none cursor-pointer"
          aria-label="Back to Home"
        >
          <div class="w-7 h-7 sm:w-auto sm:h-auto flex items-center justify-center rounded-full bg-white/10 sm:bg-transparent" aria-hidden="true">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:translate-x-[-2px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span class="text-sm hidden sm:inline">Back to Home</span>
        </button>
      );
    }
    
    return null;
  };

  return (
    <header class="absolute top-0 left-0 right-0 z-[100] bg-transparent pointer-events-none">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Left side - Spacer on mobile (to center logo), Back button on desktop */}
          <div class="hidden sm:flex items-center -ml-4 -mt-2 pointer-events-auto">
            {renderBackButton()}
          </div>
          
          {/* Mobile: Spacer to push content */}
          <div class="flex sm:hidden w-8" />

          {/* Center/Right - Logo and Mobile Back Button */}
          <div class="flex items-center gap-2 sm:gap-0 pointer-events-auto">
            {/* Mobile back button - before logo */}
            <div class="flex sm:hidden items-center">
              {renderBackButton()}
            </div>
          </div>
          
          <a href="/" class="flex items-center absolute right-8 top-8">
            <img
              src={logo || '/logo-white.png'}
              alt="Logo"
              width={140}
              height={140}
              class="object-contain"
            />
          </a>
        </div>
      </div>
    </header>
  );
});

