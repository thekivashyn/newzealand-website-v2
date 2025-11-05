import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
        'shimmer-slow': 'shimmer 4s infinite',
        'flow-down': 'flow-down 2.5s ease-in-out infinite',
        'pulse-glow-cyan': 'pulse-glow-cyan 4s ease-in-out infinite',
        'pulse-glow-amber': 'pulse-glow-amber 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        'typing-ellipsis': 'typing-ellipsis 1.5s steps(4, end) infinite',
        'spin-slow': 'spin 3s linear infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-down": "slide-in-down 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "breathing": "breathing 5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'flow-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'pulse-glow-cyan': {
          '0%, 100%': {
            boxShadow:
              '0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.4)',
          },
          '50%': {
            boxShadow:
              '0 0 15px rgba(0, 255, 255, 0.7), 0 0 25px rgba(0, 255, 255, 0.6)',
          },
        },
        'pulse-glow-amber': {
          '0%, 100%': {
            boxShadow:
              '0 0 5px rgba(255, 191, 0, 0.5), 0 0 10px rgba(255, 191, 0, 0.4)',
          },
          '50%': {
            boxShadow:
              '0 0 15px rgba(255, 191, 0, 0.7), 0 0 25px rgba(255, 191, 0, 0.6)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 6px rgba(255, 255, 255, 0.4), 0 0 12px rgba(255, 255, 255, 0.3)',
          },
          '50%': {
            boxShadow:
              '0 0 18px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.5)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.5) rotate(15deg)', opacity: '0.5' },
        },
        pan: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'typing-ellipsis': {
          '0%': { content: "''" },
          '25%': { content: "'.'" },
          '50%': { content: "'..'" },
          '75%': { content: "'...'" },
          '100%': { content: "''" },
        },
        "slide-in-down": {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '60%': { transform: 'translateY(5%)', opacity: '1' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        "breathing": {
          '0%, 100%': { transform: 'scale(1)', 'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'scale(1.02)', 'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)' },
        }
      },
      backgroundImage: {
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        neumorphic:
          'inset 6px 6px 12px #e6e6e6, inset -6px -6px 12px #ffffff',
        'neumorphic-dark':
          'inset 6px 6px 12px #1a1a1a, inset -6px -6px 12px #2a2a2a',
        'neumorphic-light':
          '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.8)',
      },
      colors: {
        'nz-red': '#C8102E',
        'nz-gold': '#FFD700',
        'nz-black': '#000000',
        'nz-white': '#FFFFFF',
        'nz-red-light': '#EF4444',
        'nz-red-dark': '#991B1B',
        
        // Learning Journey Color Palette
        'learning': {
          // Background Colors
          'cream': '#F5F5F0',
          'sidebar': '#292524', // Dark stone color for sidebar
          
          // Primary Cards Colors
          'study-guide': '#F6AD55',      // Màu vàng card Study Guide
          'study-guide-dark': '#ED8936', // Vàng đậm hơn cho hover
          'ai-assistant': '#E53E3E',     // Màu đỏ card AI Assistant
          'ai-assistant-dark': '#C53030',// Đỏ đậm hơn cho hover
          
          // Button Colors
          'start-learning': '#1A202C',   // Button đen "Start Learning"
          'ask-anything': '#B91C1C',     // Button đỏ đậm "Ask Anything"
          
          // Text Colors
          'text-primary': '#1A202C',     // Text chính màu đen
          'text-secondary': '#6B7280',   // Text phụ màu xám
          'text-light': '#FFFFFF',       // Text trắng trên button
          
          // Accent Colors
          'accent-gold': '#F59E0B',      // Màu vàng cho star
          'accent-amber': '#FBB040',     // Màu amber
          
          // Character Colors (để dành cho tương lai)
          'skin-light': '#D2691E',
          'skin-medium': '#CD853F', 
          'skin-dark': '#8B4513',
          'shirt-yellow': '#FDD835',
          'book-green': '#22C55E',
          'laptop-black': '#000000',
        }
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
export default config;

