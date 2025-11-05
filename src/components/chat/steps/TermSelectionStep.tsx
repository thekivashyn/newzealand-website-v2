import { component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { uiActions } from '../../../store/ui';
import { agentGroups } from '../constants';
import { PILOT_MODE_MATH_ONLY } from '~/config/pilotMode';
import { EmptyHeaderCustom } from '../../EmptyHeaderCustom';

// Icon components - placeholder SVG
const SparklesIcon = component$(() => (
  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
));

const FireIcon = component$(() => (
  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
));

const AcademicCapIcon = component$(() => (
  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
));

const TERMS = [
  { 
    value: 'Term 1', 
    label: 'Term 1', 
    description: 'September - December',
    icon: SparklesIcon,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/60',
    hoverBg: 'hover:bg-blue-500/30',
    textColor: 'text-white'
  },
  { 
    value: 'Term 2', 
    label: 'Term 2', 
    description: 'January - April',
    icon: FireIcon,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/60',
    hoverBg: 'hover:bg-green-500/30',
    textColor: 'text-white'
  },
  { 
    value: 'Term 3', 
    label: 'Term 3', 
    description: 'May - August',
    icon: AcademicCapIcon,
    bgColor: 'bg-amber-600/25',
    borderColor: 'border-amber-400/60',
    hoverBg: 'hover:bg-amber-600/35',
    textColor: 'text-white'
  },
];

export const TermSelectionStep = component$(() => {
  // Add float animation styles
  useVisibleTask$(() => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.7;
          }
          75% { 
            transform: translateY(-20px) translateX(5px);
            opacity: 0.5;
          }
        }
      `;
      if (!document.querySelector('style[data-float-animation]')) {
        style.setAttribute('data-float-animation', 'true');
        document.head.appendChild(style);
      }
    }
  });

  const handleTermSelect$ = $((term: string) => {
    // PILOT MODE: Automatically set subject to Mathematics
    if (PILOT_MODE_MATH_ONLY) {
      const mathsAgent = agentGroups.find(group => group.key === 'mathematics');
      uiActions.setCurrentChatContext({
        term: term,
        subject: mathsAgent?.title || 'Mathematics',
        topic: null,
        subCategory: null
      });
    } else {
      // Normal mode: Update state with selected term only
      uiActions.setCurrentChatContext({
        term,
        subject: null,
        topic: null,
        subCategory: null,
      });
    }
  });

  return (
    <div 
      class="relative flex h-full flex-col is-selecting-agent min-h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/step-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Decorative background elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/5 rounded-full blur-3xl"></div>
        
        {/* SVG Background Pattern */}
        <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Animated gradients */}
            <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.3">
                <animate attributeName="stop-color" values="#60a5fa;#a78bfa;#60a5fa" dur="4s" repeat-count="indefinite" />
              </stop>
              <stop offset="100%" stop-color="#a78bfa" stop-opacity="0.2">
                <animate attributeName="stop-color" values="#a78bfa;#60a5fa;#a78bfa" dur="4s" repeat-count="indefinite" />
              </stop>
            </linearGradient>
            
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Floating Books */}
          <g style="animation: float 6s ease-in-out infinite">
            <path d="M80,120 L100,120 L100,140 L80,140 Z M82,122 L98,122 M82,126 L98,126 M82,130 L98,130" 
                  stroke="#60a5fa" stroke-width="1.5" fill="url(#bookGradient)" opacity="0.4">
              <animateTransform attributeName="transform" type="translate" values="0,0;10,-20;0,0" dur="6s" repeat-count="indefinite" />
            </path>
          </g>
          
          <g style="animation: float 7s ease-in-out infinite">
            <path d="M250,80 L270,80 L270,100 L250,100 Z M252,82 L268,82 M252,86 L268,86 M252,90 L268,90" 
                  stroke="#a78bfa" stroke-width="1.5" fill="url(#bookGradient)" opacity="0.3">
              <animateTransform attributeName="transform" type="translate" values="0,0;-15,25;0,0" dur="7s" repeat-count="indefinite" />
            </path>
          </g>
          
          {/* Floating Stars */}
          <g>
            <path d="M150,50 L155,60 L165,60 L157,67 L160,77 L150,70 L140,77 L143,67 L135,60 L145,60 Z" 
                  fill="url(#starGradient)" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" values="0 150 63.5;360 150 63.5" dur="20s" repeat-count="indefinite" />
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeat-count="indefinite" />
            </path>
          </g>
          
          <g>
            <path d="M350,150 L353,157 L360,157 L355,162 L357,169 L350,164 L343,169 L345,162 L340,157 L347,157 Z" 
                  fill="url(#starGradient)" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" values="0 350 163;-360 350 163" dur="15s" repeat-count="indefinite" />
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeat-count="indefinite" />
            </path>
          </g>
          
          {/* Pencils */}
          <g opacity="0.3">
            <line x1="500" y1="100" x2="520" y2="80" stroke="#fb923c" stroke-width="3" stroke-linecap="round">
              <animateTransform attributeName="transform" type="translate" values="0,0;20,10;0,0" dur="5s" repeat-count="indefinite" />
            </line>
            <polygon points="520,80 525,75 522,72" fill="#fbbf24">
              <animateTransform attributeName="transform" type="translate" values="0,0;20,10;0,0" dur="5s" repeat-count="indefinite" />
            </polygon>
          </g>
          
          {/* Calculator Keys Pattern */}
          <g opacity="0.2">
            <rect x="600" y="200" width="15" height="15" rx="2" fill="#10b981" />
            <rect x="620" y="200" width="15" height="15" rx="2" fill="#10b981" />
            <rect x="600" y="220" width="15" height="15" rx="2" fill="#10b981" />
            <rect x="620" y="220" width="15" height="15" rx="2" fill="#10b981" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-30,40;0,0" dur="8s" repeat-count="indefinite" />
          </g>
          
          {/* Light bulb - knowledge */}
          <g opacity="0.35">
            <circle cx="700" cy="150" r="12" fill="none" stroke="#fbbf24" stroke-width="2">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeat-count="indefinite" />
            </circle>
            <path d="M700,162 L700,168 M697,170 L703,170" stroke="#fbbf24" stroke-width="2" stroke-linecap="round">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeat-count="indefinite" />
            </path>
            <animateTransform attributeName="transform" type="translate" values="0,0;-10,-15;0,0" dur="4s" repeat-count="indefinite" />
          </g>
          
          {/* Compass circles */}
          <g opacity="0.25">
            <circle cx="180" cy="250" r="20" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="5,5">
              <animateTransform attributeName="transform" type="rotate" values="0 180 250;360 180 250" dur="10s" repeat-count="indefinite" />
            </circle>
            <line x1="180" y1="230" x2="180" y2="270" stroke="#60a5fa" stroke-width="1" opacity="0.5" />
          </g>
          
          {/* Ruler marks */}
          <g opacity="0.2">
            <line x1="450" y1="300" x2="550" y2="300" stroke="#94a3b8" stroke-width="2" />
            <line x1="460" y1="295" x2="460" y2="305" stroke="#94a3b8" stroke-width="1" />
            <line x1="480" y1="295" x2="480" y2="305" stroke="#94a3b8" stroke-width="1" />
            <line x1="500" y1="295" x2="500" y2="305" stroke="#94a3b8" stroke-width="1" />
            <line x1="520" y1="295" x2="520" y2="305" stroke="#94a3b8" stroke-width="1" />
            <line x1="540" y1="295" x2="540" y2="305" stroke="#94a3b8" stroke-width="1" />
            <animateTransform attributeName="transform" type="translate" values="0,0;30,-20;0,0" dur="6s" repeat-count="indefinite" />
          </g>
          
          {/* Mathematical symbols floating */}
          <text x="120" y="350" font-size="24" fill="#a78bfa" opacity="0.2" font-weight="bold">
            ∑
            <animateTransform attributeName="transform" type="translate" values="0,0;15,25;0,0" dur="5s" repeat-count="indefinite" />
            <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeat-count="indefinite" />
          </text>
          
          <text x="650" y="80" font-size="28" fill="#f59e0b" opacity="0.25" font-weight="bold">
            π
            <animateTransform attributeName="transform" type="translate" values="0,0;-20,30;0,0" dur="6s" repeat-count="indefinite" />
            <animate attributeName="opacity" values="0.2;0.35;0.2" dur="4s" repeat-count="indefinite" />
          </text>
          
          <text x="400" y="400" font-size="22" fill="#10b981" opacity="0.2" font-weight="bold">
            √
            <animateTransform attributeName="transform" type="translate" values="0,0;25,-15;0,0" dur="7s" repeat-count="indefinite" />
            <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3.5s" repeat-count="indefinite" />
          </text>
          
          {/* Geometric shapes */}
          <polygon points="750,250 770,250 760,235" fill="none" stroke="#ec4899" stroke-width="2" opacity="0.2">
            <animateTransform attributeName="transform" type="rotate" values="0 760 245;360 760 245" dur="12s" repeat-count="indefinite" />
          </polygon>
          
          <circle cx="50" cy="400" r="15" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.25">
            <animate attributeName="r" values="15;18;15" dur="3s" repeat-count="indefinite" />
            <animate attributeName="opacity" values="0.2;0.35;0.2" dur="3s" repeat-count="indefinite" />
          </circle>
          
          {/* Floating Bubbles */}
          <circle cx="300" cy="350" r="8" fill="#60a5fa" opacity="0.15">
            <animateTransform attributeName="transform" type="translate" values="0,0;30,-80;60,-160" dur="8s" repeat-count="indefinite" />
            <animate attributeName="opacity" values="0.15;0.05;0" dur="8s" repeat-count="indefinite" />
            <animate attributeName="r" values="8;12;15" dur="8s" repeat-count="indefinite" />
          </circle>
          
          <circle cx="550" cy="380" r="6" fill="#f59e0b" opacity="0.2">
            <animateTransform attributeName="transform" type="translate" values="0,0;-40,-100;-80,-200" dur="10s" repeat-count="indefinite" />
            <animate attributeName="opacity" values="0.2;0.08;0" dur="10s" repeat-count="indefinite" />
            <animate attributeName="r" values="6;10;13" dur="10s" repeat-count="indefinite" />
          </circle>
          
          <circle cx="700" cy="400" r="10" fill="#10b981" opacity="0.15">
            <animateTransform attributeName="transform" type="translate" values="0,0;20,-120;40,-240" dur="12s" repeat-count="indefinite" />
            <animate attributeName="opacity" values="0.15;0.06;0" dur="12s" repeat-count="indefinite" />
            <animate attributeName="r" values="10;14;18" dur="12s" repeat-count="indefinite" />
          </circle>
          
          {/* Paper Plane */}
          <g opacity="0.25">
            <path d="M100,300 L115,305 L100,310 L105,305 Z" fill="#60a5fa" stroke="#60a5fa" stroke-width="1">
              <animateTransform attributeName="transform" type="translate" values="-100,50;900,-100" dur="15s" repeat-count="indefinite" />
              <animateTransform attributeName="transform" type="rotate" values="0 107.5 305;20 107.5 305;0 107.5 305" dur="2s" repeat-count="indefinite" additive="sum" />
            </path>
          </g>
          
          <g opacity="0.2">
            <path d="M700,100 L715,105 L700,110 L705,105 Z" fill="#f59e0b" stroke="#f59e0b" stroke-width="1">
              <animateTransform attributeName="transform" type="translate" values="100,-50;-900,150" dur="18s" repeat-count="indefinite" />
              <animateTransform attributeName="transform" type="rotate" values="180 707.5 105;160 707.5 105;180 707.5 105" dur="2.5s" repeat-count="indefinite" additive="sum" />
            </path>
          </g>
          
          {/* Dotted Grid Pattern */}
          <g opacity="0.08">
            {[...Array(8)].map((_, i) => (
              <g key={`grid-${i}`}>
                <circle cx={100 + i * 100} cy="150" r="2" fill="#94a3b8" />
                <circle cx={100 + i * 100} cy="250" r="2" fill="#94a3b8" />
                <circle cx={100 + i * 100} cy="350" r="2" fill="#94a3b8" />
              </g>
            ))}
          </g>
          
          {/* Trophy/Achievement Icon */}
          <g opacity="0.2">
            <path d="M220,180 L220,190 M215,190 L225,190 M218,175 L222,175 L222,180 L218,180 Z M216,170 L224,170 L226,175 L214,175 Z" 
                  stroke="#fbbf24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <animateTransform attributeName="transform" type="translate" values="0,0;0,-10;0,0" dur="3s" repeat-count="indefinite" />
              <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeat-count="indefinite" />
            </path>
          </g>
          
          {/* Sparkle/Star bursts */}
          <g opacity="0.3">
            <path d="M450,120 L455,120 M452.5,117.5 L452.5,122.5" stroke="#fbbf24" stroke-width="2" stroke-linecap="round">
              <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeat-count="indefinite" />
              <animateTransform attributeName="transform" type="scale" values="0.5;1;0.5" dur="2s" repeat-count="indefinite" additive="sum" />
            </path>
          </g>
          
          <g opacity="0.25">
            <path d="M580,320 L585,320 M582.5,317.5 L582.5,322.5" stroke="#ec4899" stroke-width="2" stroke-linecap="round">
              <animate attributeName="opacity" values="0;0.4;0" dur="2.5s" repeat-count="indefinite" begin="0.5s" />
              <animateTransform attributeName="transform" type="scale" values="0.5;1;0.5" dur="2.5s" repeat-count="indefinite" begin="0.5s" additive="sum" />
            </path>
          </g>
          
          {/* Atom orbit pattern */}
          <g opacity="0.15">
            <circle cx="380" cy="220" r="5" fill="#a78bfa" />
            <ellipse cx="380" cy="220" rx="25" ry="12" fill="none" stroke="#a78bfa" stroke-width="1">
              <animateTransform attributeName="transform" type="rotate" values="0 380 220;360 380 220" dur="8s" repeat-count="indefinite" />
            </ellipse>
            <ellipse cx="380" cy="220" rx="25" ry="12" fill="none" stroke="#a78bfa" stroke-width="1">
              <animateTransform attributeName="transform" type="rotate" values="60 380 220;420 380 220" dur="8s" repeat-count="indefinite" />
            </ellipse>
          </g>
        </svg>
        
        {/* Animated floating particles overlay */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              class="absolute w-1 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <EmptyHeaderCustom />
      
      {/* Centered Content */}
      <div class="relative flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        <div class="container mx-auto max-w-2xl">
          {/* Header Section */}
          <div class="flex flex-col items-center justify-center w-full text-center mb-8 sm:mb-12">
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Which term are you studying?
            </h2>
            <p class="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl">
              Select your term to get tailored content.
            </p>
          </div>
          
          {/* Terms Stack */}
          <div class="flex flex-col gap-4 sm:gap-5 w-full max-w-md mx-auto">
            {TERMS.map((term, index) => {
              const termValue = term.value;
              return (
                <button
                  key={termValue}
                  onClick$={() => handleTermSelect$(termValue)}
                  style={{ animationDelay: `${index * 100}ms` }}
                  class={`
                    group relative px-8 py-5 sm:py-6 rounded-2xl border-2 transition-all duration-300
                    transform animate-in fade-in slide-in-from-bottom-2 touch-manipulation 
                    ${term.bgColor} ${term.borderColor} ${term.hoverBg}
                    hover:shadow-xl hover:scale-105 active:scale-100
                    flex items-center justify-center text-center
                  `}
                  aria-label={`Select ${term.label}: ${term.description}`}
                >
                  <span class={`font-bold text-2xl sm:text-3xl ${term.textColor} tracking-wide`}>
                    {term.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
