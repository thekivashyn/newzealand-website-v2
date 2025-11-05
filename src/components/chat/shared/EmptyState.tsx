import { component$ } from '@builder.io/qwik';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: any; // SVG component
}

export const EmptyState = component$<EmptyStateProps>((props) => {
  const { 
    title = "No Content Available",
    message = "This section is currently being prepared. Please check back later or select a different option.",
    icon: Icon
  } = props;

  return (
    <div class="flex flex-col items-center justify-center min-h-[500px] px-4 py-12 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orb 1 */}
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }}></div>
        
        {/* Gradient Orb 2 */}
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"></div>
      </div>

      {/* Main Content */}
      <div class="relative z-10">
        {/* Icon Container with Floating Animation */}
        {Icon && (
          <div class="relative mb-8">
            {/* Outer Glow Ring - Animated */}
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse"></div>
            </div>
            
            {/* Middle Ring - Spinning */}
            <div class="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
              <div class="w-24 h-24 rounded-full border-2 border-dashed border-learning-primary/20"></div>
            </div>
            
            {/* Inner Icon Container */}
            <div class="relative flex items-center justify-center w-20 h-20 mx-auto">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl rotate-6 animate-pulse"></div>
              <div class="relative bg-learning-bg/80 backdrop-blur-xl rounded-2xl p-5 border border-learning-primary/10 shadow-2xl">
                <Icon class="h-10 w-10 text-learning-primary" />
              </div>
            </div>
            
            {/* Floating Sparkles */}
            <div class="absolute -top-2 -right-2 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
              <svg class="h-5 w-5 text-yellow-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div class="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDuration: '2.5s' }}>
              <svg class="h-4 w-4 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        )}

        {/* Text Content with Fade-in Effect */}
        <div class="text-center space-y-4 max-w-lg mx-auto animate-fadeIn">
          <h3 class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-learning-primary via-blue-400 to-purple-400">
            {title}
          </h3>
          
          <div class="relative">
            <p class="text-lg text-learning-primary/70 leading-relaxed px-4">
              {message}
            </p>
            {/* Underline decoration */}
            <div class="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-learning-primary/30 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div class="mt-12 flex items-center justify-center gap-3">
          {/* Animated Dots */}
          <div class="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                class="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-bounce shadow-lg shadow-blue-500/50"
                style={{ 
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
          
          {/* Pulse Circle */}
          <div class="relative w-2 h-2">
            <div class="absolute inset-0 rounded-full bg-purple-400 animate-ping"></div>
            <div class="relative rounded-full w-2 h-2 bg-purple-500"></div>
          </div>
          
          {/* Animated Dots (reverse) */}
          <div class="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                class="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-bounce shadow-lg shadow-purple-500/50"
                style={{ 
                  animationDelay: `${(2 - i) * 150}ms`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Bottom Decorative Wave */}
        <div class="mt-8 flex justify-center">
          <svg width="200" height="20" viewBox="0 0 200 20" fill="none" class="opacity-30">
            <path 
              d="M0 10C20 10 20 0 40 0C60 0 60 10 80 10C100 10 100 0 120 0C140 0 140 10 160 10C180 10 180 0 200 0" 
              stroke="url(#gradient)" 
              stroke-width="2"
              class="animate-pulse"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="rgb(59, 130, 246)" stop-opacity="0.5" />
                <stop offset="50%" stop-color="rgb(168, 85, 247)" stop-opacity="0.8" />
                <stop offset="100%" stop-color="rgb(236, 72, 153)" stop-opacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
});

