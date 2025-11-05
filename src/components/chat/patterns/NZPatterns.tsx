import { component$ } from '@builder.io/qwik';

/**
 * New Zealand Cultural SVG Patterns
 * Inspired by Māori art and New Zealand symbols
 */

interface PatternProps {
  color?: string;
  opacity?: number;
}

// Koru Pattern (Māori spiral symbolizing new life and growth)
export const KoruPattern = component$<PatternProps>((props) => {
  const { color = "currentColor", opacity = 0.1 } = props;
  return (
  <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id="koru-pattern" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
        {/* Large Koru */}
        <path
          d="M40,70 Q40,45 58,38 Q75,32 78,48 Q80,62 70,66 Q62,69 60,62 Q58,56 62,54"
          fill="none"
          stroke={color}
          stroke-width="2.5"
          opacity={opacity * 1.2}
          stroke-linecap="round"
        />
        {/* Inner spiral detail */}
        <path
          d="M62,54 Q64,52 66,53 Q68,54 67,56"
          fill="none"
          stroke={color}
          stroke-width="1.5"
          opacity={opacity}
        />
        {/* Small Koru */}
        <path
          d="M100,25 Q100,12 112,9 Q123,7 124,17 Q125,25 118,27 Q113,28 112,23 Q111,19 114,18"
          fill="none"
          stroke={color}
          stroke-width="2"
          opacity={opacity}
          stroke-linecap="round"
        />
        {/* Decorative small koru */}
        <path
          d="M20,110 Q20,103 26,101 Q32,99 33,105 Q33,109 29,110"
          fill="none"
          stroke={color}
          stroke-width="1.5"
          opacity={opacity * 0.8}
          stroke-linecap="round"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#koru-pattern)" />
  </svg>
  );
});

// Silver Fern Pattern (New Zealand's national symbol)
export const FernPattern = component$<PatternProps>((props) => {
  const { color = "currentColor", opacity = 0.08 } = props;
  return (
  <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id="fern-pattern" x="0" y="0" width="120" height="140" patternUnits="userSpaceOnUse">
        {/* Main stem */}
        <path
          d="M60,10 Q62,50 60,90 Q59,110 60,130"
          fill="none"
          stroke={color}
          stroke-width="2"
          opacity={opacity * 1.1}
          stroke-linecap="round"
        />
        {/* Left fronds - getting progressively larger */}
        <path d="M60,25 Q48,24 42,28 Q38,32 36,36" fill="none" stroke={color} stroke-width="1.8" opacity={opacity} stroke-linecap="round" />
        <path d="M60,35 Q46,34 38,39 Q33,43 30,48" fill="none" stroke={color} stroke-width="2" opacity={opacity} stroke-linecap="round" />
        <path d="M60,45 Q44,44 34,51 Q28,56 24,62" fill="none" stroke={color} stroke-width="2.2" opacity={opacity * 1.1} stroke-linecap="round" />
        <path d="M60,55 Q42,54 30,63 Q23,70 18,78" fill="none" stroke={color} stroke-width="2.3" opacity={opacity * 1.1} stroke-linecap="round" />
        <path d="M60,67 Q43,66 32,76 Q25,84 20,93" fill="none" stroke={color} stroke-width="2.2" opacity={opacity} stroke-linecap="round" />
        <path d="M60,80 Q46,79 38,87 Q32,93 28,100" fill="none" stroke={color} stroke-width="2" opacity={opacity} stroke-linecap="round" />
        <path d="M60,95 Q50,94 44,99 Q40,103 37,108" fill="none" stroke={color} stroke-width="1.8" opacity={opacity * 0.9} stroke-linecap="round" />
        
        {/* Right fronds - mirror of left */}
        <path d="M60,25 Q72,24 78,28 Q82,32 84,36" fill="none" stroke={color} stroke-width="1.8" opacity={opacity} stroke-linecap="round" />
        <path d="M60,35 Q74,34 82,39 Q87,43 90,48" fill="none" stroke={color} stroke-width="2" opacity={opacity} stroke-linecap="round" />
        <path d="M60,45 Q76,44 86,51 Q92,56 96,62" fill="none" stroke={color} stroke-width="2.2" opacity={opacity * 1.1} stroke-linecap="round" />
        <path d="M60,55 Q78,54 90,63 Q97,70 102,78" fill="none" stroke={color} stroke-width="2.3" opacity={opacity * 1.1} stroke-linecap="round" />
        <path d="M60,67 Q77,66 88,76 Q95,84 100,93" fill="none" stroke={color} stroke-width="2.2" opacity={opacity} stroke-linecap="round" />
        <path d="M60,80 Q74,79 82,87 Q88,93 92,100" fill="none" stroke={color} stroke-width="2" opacity={opacity} stroke-linecap="round" />
        <path d="M60,95 Q70,94 76,99 Q80,103 83,108" fill="none" stroke={color} stroke-width="1.8" opacity={opacity * 0.9} stroke-linecap="round" />
        
        {/* Koru at tip (unfurling fern) */}
        <path
          d="M60,10 Q60,5 65,5 Q70,5 70,10 Q70,13 67,13"
          fill="none"
          stroke={color}
          stroke-width="1.5"
          opacity={opacity * 1.2}
          stroke-linecap="round"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fern-pattern)" />
  </svg>
  );
});

// Tukutuku Pattern (Traditional Māori geometric weaving pattern - Pātikitiki style)
export const TukutukuPattern = component$<PatternProps>((props) => {
  const { color = "currentColor", opacity = 0.12 } = props;
  return (
  <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id="tukutuku-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {/* Diagonal cross-hatch base */}
        <path d="M0,0 L20,20 M20,0 L40,20 M40,0 L60,20 M60,0 L80,20" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        <path d="M0,20 L20,40 M20,20 L40,40 M40,20 L60,40 M60,20 L80,40" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        <path d="M0,40 L20,60 M20,40 L40,60 M40,40 L60,60 M60,40 L80,60" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        <path d="M0,60 L20,80 M20,60 L40,80 M40,60 L60,80 M60,60 L80,80" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        
        {/* Reverse diagonal */}
        <path d="M80,0 L60,20 M60,0 L40,20 M40,0 L20,20 M20,0 L0,20" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        <path d="M80,20 L60,40 M60,20 L40,40 M40,20 L20,40 M20,20 L0,40" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        <path d="M80,40 L60,60 M60,40 L40,60 M40,40 L20,60 M20,40 L0,60" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        <path d="M80,60 L60,80 M60,60 L40,80 M40,60 L20,80 M20,60 L0,80" 
          stroke={color} 
          stroke-width="1" 
          opacity={opacity * 0.6} 
        />
        
        {/* Central diamond pattern */}
        <path d="M40,20 L60,40 L40,60 L20,40 Z" 
          fill="none"
          stroke={color} 
          stroke-width="2" 
          opacity={opacity * 1.3} 
        />
        
        {/* Inner diamond */}
        <path d="M40,30 L50,40 L40,50 L30,40 Z" 
          fill="none"
          stroke={color} 
          stroke-width="1.5" 
          opacity={opacity * 1.1} 
        />
        
        {/* Corner accent diamonds */}
        <path d="M10,10 L15,15 L10,20 L5,15 Z" 
          fill={color}
          opacity={opacity * 0.8} 
        />
        <path d="M70,10 L75,15 L70,20 L65,15 Z" 
          fill={color}
          opacity={opacity * 0.8} 
        />
        <path d="M10,70 L15,75 L10,80 L5,75 Z" 
          fill={color}
          opacity={opacity * 0.8} 
        />
        <path d="M70,70 L75,75 L70,80 L65,75 Z" 
          fill={color}
          opacity={opacity * 0.8} 
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#tukutuku-pattern)" />
  </svg>
  );
});

// Māori Triangle Pattern (Niho Taniwha - Monster's teeth pattern)
export const TrianglePattern = component$<PatternProps>((props) => {
  const { color = "currentColor", opacity = 0.1 } = props;
  return (
  <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id="triangle-pattern" x="0" y="0" width="100" height="60" patternUnits="userSpaceOnUse">
        {/* Top row of triangles */}
        <path d="M0,50 L25,5 L50,50" 
          fill="none"
          stroke={color} 
          stroke-width="2.5" 
          opacity={opacity * 1.2}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M50,50 L75,5 L100,50" 
          fill="none"
          stroke={color} 
          stroke-width="2.5" 
          opacity={opacity * 1.2}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        {/* Inner detail lines */}
        <path d="M12.5,27.5 L25,5 L37.5,27.5" 
          fill="none"
          stroke={color} 
          stroke-width="1.5" 
          opacity={opacity * 0.8}
        />
        <path d="M62.5,27.5 L75,5 L87.5,27.5" 
          fill="none"
          stroke={color} 
          stroke-width="1.5" 
          opacity={opacity * 0.8}
        />
        
        {/* Small accent triangles at base */}
        <path d="M15,50 L20,42 L25,50" 
          fill={color}
          opacity={opacity * 0.6}
        />
        <path d="M65,50 L70,42 L75,50" 
          fill={color}
          opacity={opacity * 0.6}
        />
        
        {/* Decorative dots at peaks */}
        <circle cx="25" cy="5" r="2" fill={color} opacity={opacity * 1.3} />
        <circle cx="75" cy="5" r="2" fill={color} opacity={opacity * 1.3} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#triangle-pattern)" />
  </svg>
  );
});

// Wave Pattern (Representing the Pacific Ocean - Ngaru pattern)
export const WavePattern = component$<PatternProps>((props) => {
  const { color = "currentColor", opacity = 0.1 } = props;
  return (
  <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id="wave-pattern" x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
        {/* Top wave - strongest */}
        <path 
          d="M0,15 Q20,8 30,15 Q40,22 50,15 Q60,8 70,15 Q80,22 90,15 Q100,8 120,15" 
          fill="none"
          stroke={color} 
          stroke-width="2.5" 
          opacity={opacity * 1.2}
          stroke-linecap="round"
        />
        
        {/* Middle wave */}
        <path 
          d="M0,28 Q20,21 30,28 Q40,35 50,28 Q60,21 70,28 Q80,35 90,28 Q100,21 120,28" 
          fill="none"
          stroke={color} 
          stroke-width="2" 
          opacity={opacity}
          stroke-linecap="round"
        />
        
        {/* Bottom wave - lighter */}
        <path 
          d="M0,41 Q20,34 30,41 Q40,48 50,41 Q60,34 70,41 Q80,48 90,41 Q100,34 120,41" 
          fill="none"
          stroke={color} 
          stroke-width="1.5" 
          opacity={opacity * 0.7}
          stroke-linecap="round"
        />
        
        {/* Wave foam/spray dots */}
        <circle cx="30" cy="13" r="1.5" fill={color} opacity={opacity * 0.8} />
        <circle cx="50" cy="13" r="1.5" fill={color} opacity={opacity * 0.8} />
        <circle cx="70" cy="13" r="1.5" fill={color} opacity={opacity * 0.8} />
        <circle cx="90" cy="13" r="1.5" fill={color} opacity={opacity * 0.8} />
        
        {/* Subtle foam detail */}
        <circle cx="40" cy="17" r="1" fill={color} opacity={opacity * 0.5} />
        <circle cx="60" cy="17" r="1" fill={color} opacity={opacity * 0.5} />
        <circle cx="80" cy="17" r="1" fill={color} opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#wave-pattern)" />
  </svg>
  );
});

// Kiwi Bird Silhouette Pattern
export const KiwiPattern = component$<PatternProps>((props) => {
  const { color = "currentColor", opacity = 0.06 } = props;
  return (
  <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id="kiwi-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
        {/* Simplified Kiwi silhouette */}
        <path
          d="M60,70 Q50,60 45,65 L40,75 Q35,75 32,72 L30,70 Q30,80 40,90 Q50,95 60,90 Q70,85 70,75 Q65,70 60,70 Z"
          fill={color}
          opacity={opacity}
        />
        <ellipse cx="42" cy="68" rx="1.5" ry="1.5" fill={color} opacity={opacity * 1.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kiwi-pattern)" />
  </svg>
  );
});

// Manaia Pattern (Spiritual guardian in Māori culture)
export const ManaiaPattern = component$<PatternProps>((props) => {
  const { color = "currentColor", opacity = 0.08 } = props;
  return (
  <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id="manaia-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
        {/* Main Manaia body with spiral */}
        <path
          d="M70,50 Q70,30 85,28 Q98,27 100,38 Q102,55 85,62 Q72,68 68,82 Q66,92 70,100"
          fill="none"
          stroke={color}
          stroke-width="3"
          opacity={opacity * 1.2}
          stroke-linecap="round"
        />
        
        {/* Head detail */}
        <circle cx="85" cy="33" r="3" fill={color} opacity={opacity * 1.5} />
        
        {/* Beak/mouth */}
        <path
          d="M88,35 Q95,36 98,40"
          fill="none"
          stroke={color}
          stroke-width="2"
          opacity={opacity * 1.1}
          stroke-linecap="round"
        />
        
        {/* Wing detail */}
        <path
          d="M75,60 Q72,62 68,62 Q65,62 64,59"
          fill="none"
          stroke={color}
          stroke-width="2"
          opacity={opacity}
          stroke-linecap="round"
        />
        
        {/* Inner spiral detail */}
        <path
          d="M85,38 Q90,38 92,43 Q93,48 88,50"
          fill="none"
          stroke={color}
          stroke-width="1.5"
          opacity={opacity * 0.9}
        />
        
        {/* Tail koru */}
        <path
          d="M70,100 Q68,108 72,112 Q78,115 82,111 Q84,108 83,105"
          fill="none"
          stroke={color}
          stroke-width="2"
          opacity={opacity}
          stroke-linecap="round"
        />
        
        {/* Small decorative koru */}
        <path
          d="M30,30 Q30,22 36,20 Q42,19 43,25 Q43,29 39,30"
          fill="none"
          stroke={color}
          stroke-width="1.8"
          opacity={opacity * 0.8}
          stroke-linecap="round"
        />
        
        {/* Another small accent */}
        <path
          d="M110,100 Q110,94 115,92 Q120,91 121,96 Q121,99 118,100"
          fill="none"
          stroke={color}
          stroke-width="1.5"
          opacity={opacity * 0.7}
          stroke-linecap="round"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#manaia-pattern)" />
  </svg>
  );
});

// Export all patterns as a collection
export const NZPatterns = {
  Koru: KoruPattern,
  Fern: FernPattern,
  Tukutuku: TukutukuPattern,
  Triangle: TrianglePattern,
  Wave: WavePattern,
  Kiwi: KiwiPattern,
  Manaia: ManaiaPattern,
};

// Helper function to get random pattern
export const getRandomNZPattern = () => {
  const patterns = Object.values(NZPatterns);
  return patterns[Math.floor(Math.random() * patterns.length)];
};

// Helper function to get pattern by topic theme
export const getPatternByTopic = (topicKey: string): any => {
  const patternMap: Record<string, any> = {
    // Mathematics topics
    'numbertheorycomputation': TukutukuPattern,
    'consumerarithmetic': WavePattern,
    'sets': ManaiaPattern,
    'measurement': FernPattern,
    'statistics': TrianglePattern,
    'algebra1': KoruPattern,
    'algebra2': KoruPattern,
    'relationsfunctionsgraphs1': WavePattern,
    'relationsfunctionsgraphs2': WavePattern,
    'geometrytrigonometry1': TukutukuPattern,
    'geometrytrigonometry2': TukutukuPattern,
    'vectorsmatrices': TrianglePattern,
    'transformationgeometry': ManaiaPattern,
  };
  
  return patternMap[topicKey] || KoruPattern;
};

