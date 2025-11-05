// Icons are defined inline as SVG components (Qwik doesn't use heroicons directly)
// Import types and constants
import { component$ } from '@builder.io/qwik';
import type { AgentGroup, ModeCard, PresetMessages, SubjectTopics } from '../types';
import { presetMessagesGrade10, presetMessagesGrade11 } from '~/constants';

// Icon components - SVG implementations
const CalculatorIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
});

const BookOpenIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
});

const BeakerIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
});

const AcademicCapIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
});

const ChatBubbleLeftRightIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
});

const LanguageIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
});

const ComputerDesktopIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );
});

const GlobeAltIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
});

const HashtagIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  );
});

const RectangleStackIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
});

const Squares2X2Icon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
});

const ChartBarIcon = component$(() => {
  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
});

/**
 * 📚 PRESET MESSAGES FORMAT GUIDE
 * ================================
 * 
 * All preset messages now use object format for consistency and future extensibility.
 * 
 * 🎯 CURRENT FORMAT (single_ask):
 * --------------------------------
 * {
 *   type: 'single_ask' as const,
 *   value: "Your question text here"
 * }
 * 
 * This is the standard format for all questions. When clicked, the question 
 * is sent directly to AI without any template or preset answers.
 * 
 * 
 * 🚀 FUTURE FORMATS (for development):
 * -------------------------------------
 * 
 * 1️⃣ MULTIPLE CHOICE (with preset answers):
 * {
 *   type: 'multiple_choice' as const,
 *   value: "What is 2 + 2?",
 *   preset_answers: ["3", "4", "5", "6"],
 *   correct_answer: "4"  // Optional: for validation
 * }
 * → Shows question with answer buttons
 * → User selects answer → Auto-submit "Question + My answer: X"
 * 
 * 
 * 2️⃣ IMAGE QUESTION (with visual content):
 * {
 *   type: 'image_question' as const,
 *   value: "What geometric shape is shown in the image?",
 *   img_question: "/images/math/triangle-example.png",
 *   preset_answers: ["Triangle", "Square", "Circle", "Pentagon"],
 *   correct_answer: "Triangle"  // Optional
 * }
 * → Renders image above the question
 * → Can combine with preset_answers for multiple choice
 * 
 * 
 * 3️⃣ TEXT QUESTION (no preset answers, just object format):
 * {
 *   type: 'text' as const,
 *   value: "Explain the Pythagorean theorem in your own words.",
 *   img_question: "/images/math/right-triangle.png"  // Optional
 * }
 * → Works like single_ask but can include image
 * 
 * 
 * 📁 STRUCTURE:
 * --------------
 * gradePresetMessages = {
 *   "10": {
 *     term1: { mathematics: {...}, english: {...}, ... },
 *     term2: { ... },
 *     term3: { ... }
 *   },
 *   "11": { ... },
 *   "12": { ... }  // Add more grades as needed
 * }
 * 
 * 
 * 🎓 USAGE:
 * ---------
 * - User's grade is from: user.grade_meta.grade
 * - Use helper: getPresetMessagesByTermAndGrade(term, grade)
 * - Auto-converts old strings to objects for backward compatibility
 * 
 * 
 * ⚠️ IMPORTANT:
 * -------------
 * - Always use 'as const' for type field
 * - Escape special characters in value strings
 * - preset_answers is optional (only for multiple_choice)
 * - img_question is optional (for visual questions)
 */

// Subject Theme System - Reusable color themes for consistent styling
export const subjectThemes = {
  mathematics: {
    // Golden yellow for logical thinking and problem solving
    bg: 'bg-yellow-500',
    border: 'border-yellow-500/20 hover:border-yellow-400/30',
    borderColor: 'border-yellow-500',
    borderColorLight: 'border-yellow-400',
    shadow: 'hover:shadow-yellow-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-yellow-500/20',
    iconBg: 'bg-yellow-400',
    buttonBg: 'bg-yellow-500/20 hover:bg-yellow-400/30',
    number: 'bg-yellow-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black'
  },
  english: {
    // Dark blue for literature and communication
    bg: 'bg-slate-800',
    border: 'border-slate-600/20 hover:border-slate-500/30',
    borderColor: 'border-slate-600',
    borderColorLight: 'border-slate-500',
    shadow: 'hover:shadow-slate-800/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-slate-800/20',
    iconBg: 'bg-blue-500',
    buttonBg: 'bg-slate-700/30 hover:bg-slate-600/40',
    number: 'bg-blue-500',
    textColor: 'text-white',
    textColorSecondary: 'text-white/85',
    textColorMuted: 'text-white/60',
    numberText: 'text-white',
    chevron: 'group-hover:text-white'
  },
  science: {
    // Dark green for nature and discovery
    bg: 'bg-green-800',
    border: 'border-green-600/20 hover:border-green-500/30',
    borderColor: 'border-green-600',
    borderColorLight: 'border-green-500',
    shadow: 'hover:shadow-green-800/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-green-800/20',
    iconBg: 'bg-green-400',
    buttonBg: 'bg-green-700/30 hover:bg-green-600/40',
    number: 'bg-green-400',
    textColor: 'text-white',
    textColorSecondary: 'text-white/85',
    textColorMuted: 'text-white/60',
    numberText: 'text-white',
    chevron: 'group-hover:text-white'
  },
  socialstudies: {
    // Rich purple for history and culture
    bg: 'bg-purple-800',
    border: 'border-purple-600/20 hover:border-purple-500/30',
    borderColor: 'border-purple-600',
    borderColorLight: 'border-purple-500',
    shadow: 'hover:shadow-purple-800/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-purple-800/20',
    iconBg: 'bg-purple-400',
    buttonBg: 'bg-purple-700/30 hover:bg-purple-600/40',
    number: 'bg-purple-400',
    textColor: 'text-white',
    textColorSecondary: 'text-white/85',
    textColorMuted: 'text-white/60',
    numberText: 'text-white',
    chevron: 'group-hover:text-white'
  },
  spanish: {
    // Warm red for passion and culture
    bg: 'bg-red-700',
    border: 'border-red-500/20 hover:border-red-400/30',
    borderColor: 'border-red-500',
    borderColorLight: 'border-red-400',
    shadow: 'hover:shadow-red-700/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-red-700/20',
    iconBg: 'bg-red-400',
    buttonBg: 'bg-red-600/30 hover:bg-red-500/40',
    number: 'bg-red-400',
    textColor: 'text-white',
    textColorSecondary: 'text-white/85',
    textColorMuted: 'text-white/60',
    numberText: 'text-white',
    chevron: 'group-hover:text-white'
  },
  informationtechnology: {
    // Blue for technology and innovation
    bg: 'bg-blue-800',
    border: 'border-blue-600/20 hover:border-blue-500/30',
    borderColor: 'border-blue-600',
    borderColorLight: 'border-blue-500',
    shadow: 'hover:shadow-blue-800/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-blue-800/20',
    iconBg: 'bg-blue-400',
    buttonBg: 'bg-blue-700/30 hover:bg-blue-600/40',
    number: 'bg-blue-400',
    textColor: 'text-white',
    textColorSecondary: 'text-white/85',
    textColorMuted: 'text-white/60',
    numberText: 'text-white',
    chevron: 'group-hover:text-white'
  },
  default: {
    bg: 'bg-gray-800',
    border: 'border-gray-600/20 hover:border-gray-500/30',
    borderColor: 'border-gray-600',
    borderColorLight: 'border-gray-500',
    shadow: 'hover:shadow-gray-800/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-gray-800/20',
    iconBg: 'bg-gray-400',
    buttonBg: 'bg-gray-700/30 hover:bg-gray-600/40',
    number: 'bg-gray-400',
    textColor: 'text-white',
    textColorSecondary: 'text-white/85',
    textColorMuted: 'text-white/60',
    numberText: 'text-white',
    chevron: 'group-hover:text-white'
  }
} as const;

// 🎨 TOPIC-SPECIFIC THEME SYSTEM
// Each math topic gets its own unique color theme for visual distinction
// These themes are used consistently across topic cards, sub-categories, and question screens
export const topicThemes = {
  // TERM 1 TOPICS
  numbertheorycomputation: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-orange-500/20 hover:border-orange-400/30',
    borderColor: 'border-orange-500',
    borderColorLight: 'border-orange-400',
    shadow: 'hover:shadow-orange-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-orange-500/20',
    iconBg: 'bg-orange-400',
    buttonBg: 'bg-orange-500/20 hover:bg-orange-400/30',
    number: 'bg-orange-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-orange-400',
    quizBgSolid: 'bg-orange-400'
  },
  consumerarithmetic: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-emerald-500/20 hover:border-emerald-400/30',
    borderColor: 'border-emerald-500',
    borderColorLight: 'border-emerald-400',
    shadow: 'hover:shadow-emerald-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-emerald-500/20',
    iconBg: 'bg-emerald-400',
    buttonBg: 'bg-emerald-500/20 hover:bg-emerald-400/30',
    number: 'bg-emerald-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-emerald-400',
    quizBgSolid: 'bg-emerald-400'
  },
  sets: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-violet-500/20 hover:border-violet-400/30',
    borderColor: 'border-violet-500',
    borderColorLight: 'border-violet-400',
    shadow: 'hover:shadow-yellow-400/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-yellow-400/20',
    iconBg: 'bg-violet-400',
    buttonBg: 'bg-violet-500/20 hover:bg-violet-400/30',
    number: 'bg-violet-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-violet-400',
    quizBgSolid: 'bg-violet-400'
  },
  // TERM 2 TOPICS
  measurement: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-cyan-500/20 hover:border-cyan-400/30',
    borderColor: 'border-cyan-500',
    borderColorLight: 'border-cyan-400',
    shadow: 'hover:shadow-cyan-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-cyan-500/20',
    iconBg: 'bg-cyan-400',
    buttonBg: 'bg-cyan-500/20 hover:bg-cyan-400/30',
    number: 'bg-cyan-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-cyan-400',
    quizBgSolid: 'bg-cyan-400'
  },
  statistics: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-pink-500/20 hover:border-pink-400/30',
    borderColor: 'border-pink-500',
    borderColorLight: 'border-pink-400',
    shadow: 'hover:shadow-pink-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-pink-500/20',
    iconBg: 'bg-pink-400',
    buttonBg: 'bg-pink-500/20 hover:bg-pink-400/30',
    number: 'bg-pink-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-pink-400',
    quizBgSolid: 'bg-pink-400'
  },
  algebra1: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-indigo-500/20 hover:border-indigo-400/30',
    borderColor: 'border-indigo-500',
    borderColorLight: 'border-indigo-400',
    shadow: 'hover:shadow-indigo-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-indigo-500/20',
    iconBg: 'bg-indigo-400',
    buttonBg: 'bg-indigo-500/20 hover:bg-indigo-400/30',
    number: 'bg-indigo-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-indigo-400',
    quizBgSolid: 'bg-indigo-400'
  },
  // TERM 3 TOPICS
  relationsfunctionsgraphs1: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-teal-500/20 hover:border-teal-400/30',
    borderColor: 'border-teal-500',
    borderColorLight: 'border-teal-400',
    shadow: 'hover:shadow-teal-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-teal-500/20',
    iconBg: 'bg-teal-400',
    buttonBg: 'bg-teal-500/20 hover:bg-teal-400/30',
    number: 'bg-teal-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-teal-400',
    quizBgSolid: 'bg-teal-400'
  },
  geometrytrigonometry1: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-amber-500/20 hover:border-amber-400/30',
    borderColor: 'border-amber-500',
    borderColorLight: 'border-amber-400',
    shadow: 'hover:shadow-amber-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-amber-500/20',
    iconBg: 'bg-amber-400',
    buttonBg: 'bg-amber-500/20 hover:bg-amber-400/30',
    number: 'bg-amber-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-amber-400',
    quizBgSolid: 'bg-amber-400'
  },
  // GRADE 11 TOPICS
  algebra2: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-blue-500/20 hover:border-blue-400/30',
    borderColor: 'border-blue-500',
    borderColorLight: 'border-blue-400',
    shadow: 'hover:shadow-blue-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-blue-500/20',
    iconBg: 'bg-blue-400',
    buttonBg: 'bg-blue-500/20 hover:bg-blue-400/30',
    number: 'bg-blue-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-blue-400',
    quizBgSolid: 'bg-blue-400'
  },
  relationsfunctionsgraphs2: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-fuchsia-500/20 hover:border-fuchsia-400/30',
    borderColor: 'border-fuchsia-500',
    borderColorLight: 'border-fuchsia-400',
    shadow: 'hover:shadow-fuchsia-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-fuchsia-500/20',
    iconBg: 'bg-fuchsia-400',
    buttonBg: 'bg-fuchsia-500/20 hover:bg-fuchsia-400/30',
    number: 'bg-fuchsia-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-fuchsia-400',
    quizBgSolid: 'bg-fuchsia-400'
  },
  geometrytrigonometry2: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-lime-500/20 hover:border-lime-400/30',
    borderColor: 'border-lime-500',
    borderColorLight: 'border-lime-400',
    shadow: 'hover:shadow-lime-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-lime-500/20',
    iconBg: 'bg-lime-400',
    buttonBg: 'bg-lime-500/20 hover:bg-lime-400/30',
    number: 'bg-lime-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-lime-400',
    quizBgSolid: 'bg-lime-400'
  },
  vectors: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-rose-500/20 hover:border-rose-400/30',
    borderColor: 'border-rose-500',
    borderColorLight: 'border-rose-400',
    shadow: 'hover:shadow-rose-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-rose-500/20',
    iconBg: 'bg-rose-400',
    buttonBg: 'bg-rose-500/20 hover:bg-rose-400/30',
    number: 'bg-rose-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-rose-400',
    quizBgSolid: 'bg-rose-400'
  },
  vectorsmatrices: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-red-500/60 hover:border-red-400/70',
    borderColor: 'border-red-500',
    borderColorLight: 'border-red-400',
    shadow: 'hover:shadow-red-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-red-500/20',
    iconBg: 'bg-red-400',
    buttonBg: 'bg-red-500/20 hover:bg-red-400/30',
    number: 'bg-red-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-red-400',
    quizBgSolid: 'bg-red-400'
  },
  transformationgeometry: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-green-500/60 hover:border-green-400/70',
    borderColor: 'border-green-500',
    borderColorLight: 'border-green-400',
    shadow: 'hover:shadow-green-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-green-500/20',
    iconBg: 'bg-green-400',
    buttonBg: 'bg-green-500/20 hover:bg-green-400/30',
    number: 'bg-green-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-green-400',
    quizBgSolid: 'bg-green-400'
  },
  // DEFAULT FALLBACK
  default: {
    bg: 'bg-[oklch(0.95_0.05_88.4/1)]',
    border: 'border-yellow-500/20 hover:border-yellow-400/30',
    borderColor: 'border-yellow-500',
    borderColorLight: 'border-yellow-400',
    shadow: 'hover:shadow-yellow-500/30 hover:shadow-2xl',
    glow: 'group-hover:shadow-yellow-500/20',
    iconBg: 'bg-yellow-400',
    buttonBg: 'bg-yellow-500/20 hover:bg-yellow-400/30',
    number: 'bg-yellow-400',
    textColor: 'text-black',
    textColorSecondary: 'text-black/85',
    textColorMuted: 'text-black/60',
    numberText: 'text-black',
    chevron: 'group-hover:text-black',
    quizBg: 'bg-yellow-400',
    quizBgSolid: 'bg-yellow-400'
  }
} as const;

// Quiz Theme System - Extended themes specifically for quiz UI components
export const quizThemes = {
  mathematics: {
    // Main quiz container - Clean white background
    quizBg: 'bg-white',
    quizBgSolid: 'bg-white',
    quizContainer: 'bg-white text-gray-900',
    
    // Progress bar - Clean modern design
    progressTrack: 'bg-gray-200 rounded-full shadow-inner',
    progressFill: 'bg-green-600 rounded-full shadow-sm',
    progressText: 'text-gray-900 font-semibold',
    
    // Question card - Subtle card design
    questionCard: 'bg-gray-50',
    questionCardHover: 'bg-gray-100',
    questionTitle: 'text-gray-900 font-bold text-lg',
    questionText: 'text-gray-800 font-medium',
    questionNumber: 'bg-green-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md',
    
    // Answer options - Clean white cards with borders
    optionDefault: 'bg-white border-2 border-gray-300 text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md rounded-xl transition-all duration-200 relative',
    optionSelected: 'bg-green-50 border-2 border-green-600 text-gray-900 font-semibold rounded-xl relative shadow-lg ring-4 ring-green-500/20',
    optionCorrect: 'bg-green-600 border-2 border-green-700 text-white font-semibold rounded-xl shadow-lg',
    optionIncorrect: 'bg-red-600 border-2 border-red-700 text-white font-semibold rounded-xl shadow-lg',
    optionDisabled: 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed rounded-xl',
    
    // Text color for answers
    textColor: 'text-gray-900',
    
    // Selected indicator
    selectedIndicator: 'text-green-600 absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold',
    
    // Buttons - Modern clean design
    submitBtn: 'bg-green-600 text-white font-bold shadow-lg hover:shadow-xl hover:bg-green-700 transform hover:scale-105 rounded-xl border-2 border-green-700 transition-all duration-200',
    nextBtn: 'bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md',
    skipBtn: 'bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-colors',
    
    // Status badges - Clean and clear
    answeredBadge: 'bg-green-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm',
    correctIndicator: 'text-green-800 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 font-semibold shadow-sm',
    incorrectIndicator: 'text-red-800 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-2 font-semibold shadow-sm',
    warningIndicator: 'text-amber-900 bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-2 font-semibold shadow-sm',
    
    // Focus states
    focusRing: 'focus:ring-4 focus:ring-green-500/30 focus:outline-none',
    activeFocus: 'ring-4 ring-green-500/30'
  },
  
  english: {
    // Main quiz container - Clean white background
    quizBg: 'bg-white',
    quizBgSolid: 'bg-white',
    quizContainer: 'bg-white text-gray-900',
    
    // Progress bar
    progressTrack: 'bg-gray-200 rounded-full shadow-inner',
    progressFill: 'bg-blue-600 rounded-full shadow-sm',
    progressText: 'text-gray-900 font-semibold',
    
    // Question card
    questionCard: 'bg-gray-50',
    questionCardHover: 'bg-gray-100',
    questionTitle: 'text-gray-900 font-bold text-lg',
    questionText: 'text-gray-800 font-medium',
    questionNumber: 'bg-blue-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md',
    
    // Answer options - Clean white cards
    optionDefault: 'bg-white border-2 border-gray-300 text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md rounded-xl transition-all duration-200',
    optionSelected: 'bg-blue-50 border-2 border-blue-600 text-gray-900 font-semibold shadow-lg ring-4 ring-blue-500/20 rounded-xl',
    optionCorrect: 'bg-green-600 border-2 border-green-700 text-white font-semibold shadow-lg rounded-xl',
    optionIncorrect: 'bg-red-600 border-2 border-red-700 text-white font-semibold shadow-lg rounded-xl',
    optionDisabled: 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed rounded-xl',
    
    // Text color for answers
    textColor: 'text-gray-900',
    
    // Selected indicator
    selectedIndicator: 'text-blue-600 absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold',
    
    // Buttons
    submitBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl border-2 border-blue-700',
    nextBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md',
    skipBtn: 'bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl',
    
    // Status badges
    answeredBadge: 'bg-blue-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm',
    correctIndicator: 'text-green-800 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 font-semibold',
    incorrectIndicator: 'text-red-800 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-2 font-semibold',
    warningIndicator: 'text-amber-900 bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-2 font-semibold',
    
    // Focus states
    focusRing: 'focus:ring-4 focus:ring-blue-500/30 focus:outline-none',
    activeFocus: 'ring-4 ring-blue-500/30'
  },
  
  science: {
    // Main quiz container - Clean white background
    quizBg: 'bg-white',
    quizBgSolid: 'bg-white',
    quizContainer: 'bg-white text-gray-900',
    
    // Progress bar
    progressTrack: 'bg-gray-200 rounded-full shadow-inner',
    progressFill: 'bg-emerald-600 rounded-full shadow-sm',
    progressText: 'text-gray-900 font-semibold',
    
    // Question card
    questionCard: 'bg-gray-50',
    questionCardHover: 'bg-gray-100',
    questionTitle: 'text-gray-900 font-bold text-lg',
    questionText: 'text-gray-800 font-medium',
    questionNumber: 'bg-emerald-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md',
    
    // Answer options - Clean white cards
    optionDefault: 'bg-white border-2 border-gray-300 text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md rounded-xl transition-all duration-200',
    optionSelected: 'bg-emerald-50 border-2 border-emerald-600 text-gray-900 font-semibold shadow-lg ring-4 ring-emerald-500/20 rounded-xl',
    optionCorrect: 'bg-emerald-600 border-2 border-emerald-700 text-white font-semibold shadow-lg rounded-xl',
    optionIncorrect: 'bg-red-600 border-2 border-red-700 text-white font-semibold shadow-lg rounded-xl',
    optionDisabled: 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed rounded-xl',
    
    // Text color for answers
    textColor: 'text-gray-900',
    
    // Selected indicator
    selectedIndicator: 'text-emerald-600 absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold',
    
    // Buttons
    submitBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl border-2 border-emerald-700',
    nextBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md',
    skipBtn: 'bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl',
    
    // Status badges
    answeredBadge: 'bg-emerald-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm',
    correctIndicator: 'text-green-800 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 font-semibold',
    incorrectIndicator: 'text-red-800 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-2 font-semibold',
    warningIndicator: 'text-amber-900 bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-2 font-semibold',
    
    // Focus states
    focusRing: 'focus:ring-4 focus:ring-emerald-500/30 focus:outline-none',
    activeFocus: 'ring-4 ring-emerald-500/30'
  },
  
  socialstudies: {
    // Main quiz container - Clean white background
    quizBg: 'bg-white',
    quizBgSolid: 'bg-white',
    quizContainer: 'bg-white text-gray-900',
    
    // Progress bar
    progressTrack: 'bg-gray-200 rounded-full shadow-inner',
    progressFill: 'bg-purple-600 rounded-full shadow-sm',
    progressText: 'text-gray-900 font-semibold',
    
    // Question card
    questionCard: 'bg-gray-50',
    questionCardHover: 'bg-gray-100',
    questionTitle: 'text-gray-900 font-bold text-lg',
    questionText: 'text-gray-800 font-medium',
    questionNumber: 'bg-purple-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md',
    
    // Answer options - Clean white cards
    optionDefault: 'bg-white border-2 border-gray-300 text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md rounded-xl transition-all duration-200',
    optionSelected: 'bg-purple-50 border-2 border-purple-600 text-gray-900 font-semibold shadow-lg ring-4 ring-purple-500/20 rounded-xl',
    optionCorrect: 'bg-green-600 border-2 border-green-700 text-white font-semibold shadow-lg rounded-xl',
    optionIncorrect: 'bg-red-600 border-2 border-red-700 text-white font-semibold shadow-lg rounded-xl',
    optionDisabled: 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed rounded-xl',
    
    // Text color for answers
    textColor: 'text-gray-900',
    
    // Selected indicator
    selectedIndicator: 'text-purple-600 absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold',
    
    // Buttons
    submitBtn: 'bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl border-2 border-purple-700',
    nextBtn: 'bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md',
    skipBtn: 'bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl',
    
    // Status badges
    answeredBadge: 'bg-purple-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm',
    correctIndicator: 'text-green-800 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 font-semibold',
    incorrectIndicator: 'text-red-800 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-2 font-semibold',
    warningIndicator: 'text-amber-900 bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-2 font-semibold',
    
    // Focus states
    focusRing: 'focus:ring-4 focus:ring-purple-500/30 focus:outline-none',
    activeFocus: 'ring-4 ring-purple-500/30'
  },
  
  spanish: {
    // Main quiz container - Clean white background
    quizBg: 'bg-white',
    quizBgSolid: 'bg-white',
    quizContainer: 'bg-white text-gray-900',
    
    // Progress bar
    progressTrack: 'bg-gray-200 rounded-full shadow-inner',
    progressFill: 'bg-rose-600 rounded-full shadow-sm',
    progressText: 'text-gray-900 font-semibold',
    
    // Question card
    questionCard: 'bg-gray-50',
    questionCardHover: 'bg-gray-100',
    questionTitle: 'text-gray-900 font-bold text-lg',
    questionText: 'text-gray-800 font-medium',
    questionNumber: 'bg-rose-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md',
    
    // Answer options - Clean white cards
    optionDefault: 'bg-white border-2 border-gray-300 text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md rounded-xl transition-all duration-200',
    optionSelected: 'bg-rose-50 border-2 border-rose-600 text-gray-900 font-semibold shadow-lg ring-4 ring-rose-500/20 rounded-xl',
    optionCorrect: 'bg-green-600 border-2 border-green-700 text-white font-semibold shadow-lg rounded-xl',
    optionIncorrect: 'bg-rose-600 border-2 border-rose-700 text-white font-semibold shadow-lg rounded-xl',
    optionDisabled: 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed rounded-xl',
    
    // Text color for answers
    textColor: 'text-gray-900',
    
    // Selected indicator
    selectedIndicator: 'text-rose-600 absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold',
    
    // Buttons
    submitBtn: 'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl border-2 border-rose-700',
    nextBtn: 'bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md',
    skipBtn: 'bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl',
    
    // Status badges
    answeredBadge: 'bg-rose-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm',
    correctIndicator: 'text-green-800 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 font-semibold',
    incorrectIndicator: 'text-red-800 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-2 font-semibold',
    warningIndicator: 'text-amber-900 bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-2 font-semibold',
    
    // Focus states
    focusRing: 'focus:ring-4 focus:ring-rose-500/30 focus:outline-none',
    activeFocus: 'ring-4 ring-rose-500/30'
  },
  
  informationtechnology: {
    // Main quiz container - Clean white background
    quizBg: 'bg-white',
    quizBgSolid: 'bg-white',
    quizContainer: 'bg-white text-gray-900',
    
    // Progress bar
    progressTrack: 'bg-gray-200 rounded-full shadow-inner',
    progressFill: 'bg-cyan-600 rounded-full shadow-sm',
    progressText: 'text-gray-900 font-semibold',
    
    // Question card
    questionCard: 'bg-gray-50',
    questionCardHover: 'bg-gray-100',
    questionTitle: 'text-gray-900 font-bold text-lg',
    questionText: 'text-gray-800 font-medium',
    questionNumber: 'bg-cyan-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md',
    
    // Answer options - Clean white cards
    optionDefault: 'bg-white border-2 border-gray-300 text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md rounded-xl transition-all duration-200',
    optionSelected: 'bg-cyan-50 border-2 border-cyan-600 text-gray-900 font-semibold shadow-lg ring-4 ring-cyan-500/20 rounded-xl',
    optionCorrect: 'bg-green-600 border-2 border-green-700 text-white font-semibold shadow-lg rounded-xl',
    optionIncorrect: 'bg-red-600 border-2 border-red-700 text-white font-semibold shadow-lg rounded-xl',
    optionDisabled: 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed rounded-xl',
    
    // Text color for answers
    textColor: 'text-gray-900',
    
    // Selected indicator
    selectedIndicator: 'text-cyan-600 absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold',
    
    // Buttons
    submitBtn: 'bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl border-2 border-cyan-700',
    nextBtn: 'bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md',
    skipBtn: 'bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl',
    
    // Status badges
    answeredBadge: 'bg-cyan-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm',
    correctIndicator: 'text-green-800 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 font-semibold',
    incorrectIndicator: 'text-red-800 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-2 font-semibold',
    warningIndicator: 'text-amber-900 bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-2 font-semibold',
    
    // Focus states
    focusRing: 'focus:ring-4 focus:ring-cyan-500/30 focus:outline-none',
    activeFocus: 'ring-4 ring-cyan-500/30'
  },
  
  default: {
    // Main quiz container - Clean white background
    quizBg: 'bg-white',
    quizBgSolid: 'bg-white',
    quizContainer: 'bg-white text-gray-900',
    
    // Progress bar
    progressTrack: 'bg-gray-200 rounded-full shadow-inner',
    progressFill: 'bg-gray-600 rounded-full shadow-sm',
    progressText: 'text-gray-900 font-semibold',
    
    // Question card
    questionCard: 'bg-gray-50',
    questionCardHover: 'bg-gray-100',
    questionTitle: 'text-gray-900 font-bold text-lg',
    questionText: 'text-gray-800 font-medium',
    questionNumber: 'bg-gray-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md',
    
    // Answer options - Clean white cards
    optionDefault: 'bg-white border-2 border-gray-300 text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md rounded-xl transition-all duration-200',
    optionSelected: 'bg-gray-100 border-2 border-gray-600 text-gray-900 font-semibold shadow-lg ring-4 ring-gray-500/20 rounded-xl',
    optionCorrect: 'bg-green-600 border-2 border-green-700 text-white font-semibold shadow-lg rounded-xl',
    optionIncorrect: 'bg-red-600 border-2 border-red-700 text-white font-semibold shadow-lg rounded-xl',
    optionDisabled: 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed rounded-xl',
    
    // Text color for answers
    textColor: 'text-gray-900',
    
    // Selected indicator
    selectedIndicator: 'text-gray-600 absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold',
    
    // Buttons
    submitBtn: 'bg-gray-600 hover:bg-gray-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl border-2 border-gray-700',
    nextBtn: 'bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-md',
    skipBtn: 'bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl',
    
    // Status badges
    answeredBadge: 'bg-gray-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm',
    correctIndicator: 'text-green-800 bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 font-semibold',
    incorrectIndicator: 'text-red-800 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-2 font-semibold',
    warningIndicator: 'text-amber-900 bg-amber-50 border-2 border-amber-400 rounded-xl px-4 py-2 font-semibold',
    
    // Focus states
    focusRing: 'focus:ring-4 focus:ring-gray-500/30 focus:outline-none',
    activeFocus: 'ring-4 ring-gray-500/30'
  }
} as const;

// Helper function to get quiz theme
export const getQuizTheme = (subjectKey: keyof typeof quizThemes | string) => {
  // Map the subject name to theme key first
  const themeKey = mapSubjectToThemeKey(subjectKey);
  return quizThemes[themeKey as keyof typeof quizThemes] || quizThemes.default;
};

// Subject name to theme key mapping
export const mapSubjectToThemeKey = (subjectName: string | null | undefined): string => {
  if (!subjectName) return 'default';
  
  const subjectLower = subjectName.toLowerCase();
  
  // Map various subject names to our theme keys
  const subjectMapping: { [key: string]: string } = {
    // Mathematics variations
    'mathematics': 'mathematics',
    'math': 'mathematics',
    'maths': 'mathematics',
    
    // English variations  
    'english': 'english',
    'english language': 'english',
    'language arts': 'english',
    
    // Science variations
    'science': 'science',
    'environmental science': 'science',
    'biology': 'science',
    'chemistry': 'science', 
    'physics': 'science',
    'general science': 'science',
    
    // Social Studies variations
    'social studies': 'socialstudies',
    'socialstudies': 'socialstudies',
    'history': 'socialstudies',
    'geography': 'socialstudies',
    'civics': 'socialstudies',
    
    // Spanish variations
    'spanish': 'spanish',
    'español': 'spanish',
    
    // Information Technology variations
    'information technology': 'informationtechnology',
    'informationtechnology': 'informationtechnology',
    'it': 'informationtechnology',
    'ict': 'informationtechnology',
    'computer science': 'informationtechnology',
    'computing': 'informationtechnology',
  };
  
  return subjectMapping[subjectLower] || 'default';
};

// Helper function to get subject theme
export const getSubjectTheme = (subjectKey: keyof typeof subjectThemes | string) => {
  // Map the subject name to theme key first
  const themeKey = mapSubjectToThemeKey(subjectKey);
  return subjectThemes[themeKey as keyof typeof subjectThemes] || subjectThemes.default;
};

// Helper function to get topic theme by topic key
export const getTopicTheme = (topicKey: string | null | undefined) => {
  if (!topicKey) return topicThemes.default;
  const themeKey = topicKey as keyof typeof topicThemes;
  return topicThemes[themeKey] || topicThemes.default;
};

export const modeSelectionCards: ModeCard[] = [
  {
    key: "study-guide",
    icon: AcademicCapIcon,
    title: "Study Guide",
    description: "Learn with lessons, quizzes & practice activities.",
    color: "from-green-500 to-emerald-600",
  }
];

export const agentGroups: AgentGroup[] = [
  {
    key: "mathematics",
    icon: CalculatorIcon,
    title: "Mathematics",
    description: "Master numbers, calculations, and problem-solving skills with step-by-step guidance.",
    color: "from-orange-500 to-orange-500",
    bgColor: "bg-orange-500",
    tags: ["Fractions", "Geometry", "Algebra"]
  },
  {
    key: "english",
    icon: BookOpenIcon,
    title: "English",
    description: "Improve reading, writing, grammar, and communication skills for academic success.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500",
    tags: ["Grammar", "Writing", "Reading"]
  },
  {
    key: "science",
    icon: BeakerIcon,
    title: "Science",
    description: "Explore the natural world through biology, chemistry, and physics concepts.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500",
    tags: ["Biology", "Chemistry", "Physics"]
  },
  {
    key: "socialstudies",
    icon: GlobeAltIcon,
    title: "Social Studies",
    description: "Learn about New Zealand's history, geography, government, and culture.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500",
    tags: ["History", "Geography", "Government"]
  },
  {
    key: "spanish",
    icon: ChatBubbleLeftRightIcon,
    title: "Spanish",
    description: "Build Spanish language skills through conversation, grammar, and cultural understanding.",
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-700",
    tags: ["Conversation", "Grammar", "Culture"]
  },
  {
    key: "informationtechnology",
    icon: ComputerDesktopIcon,
    title: "Information Technology",
    description: "Develop digital literacy, coding basics, and safe internet practices.",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500",
    tags: ["Digital Skills", "Safety", "Programming"]
  },
];

// 📚 TERM-BASED CURRICULUM STRUCTURE
// Each term has different topics per subject
// 🎓 GRADE-BASED TERM DATA STRUCTURE
// Each grade has its own set of terms and subjects
const termDataGrade10 = {
  term1: {
    mathematics: [
      {
        key: "numbertheorycomputation",
        title: "Number Theory & Computation",
        description: "These questions will test your core calculation skills.",
        icon: HashtagIcon,
        color: "from-orange-500 to-red-500",
        subCategories: [
          {
            key: "buildingblocks",
            title: "The Building Blocks of Numbers",
            description: "Sets of numbers, Properties, HCF/LCM",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          },
          {
            key: "numberforms",
            title: "Working with Different Number Forms",
            description: "Fractions, Decimals, Squares/Roots",
            icon: CalculatorIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "practicalapplication",
            title: "Practical Application & Measurement",
            description: "Percentages, Ratios, Metric Conversions",
            icon: RectangleStackIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "scientificabstract",
            title: "Scientific and Abstract Concepts",
            description: "Significant Figures, Scientific Notation, Sequences",
            icon: Squares2X2Icon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      },
      {
        key: "consumerarithmetic",
        title: "Consumer Arithmetic",
        description: "Time to see how math works with money. These are very practical for everyday life in New Zealand!",
        icon: CalculatorIcon,
        color: "from-blue-500 to-cyan-500",
        subCategories: [
          {
            key: "businessretail",
            title: "Business & Retail",
            description: "Profit/Loss, Discount, Sales Tax/VAT",
            icon: ChartBarIcon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "bankingfinance",
            title: "Banking & Finance",
            description: "Simple Interest, Compound Interest, Depreciation",
            icon: CalculatorIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "earningpaying",
            title: "Earning & Paying",
            description: "Salaries/Wages, Hire Purchase",
            icon: HashtagIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "householdtravel",
            title: "Household & Travel",
            description: "Utilities, Currency Conversion",
            icon: RectangleStackIcon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      },
      {
        key: "sets",
        title: "Sets",
        description: "This section is all about logic and how we group things.",
        icon: RectangleStackIcon,
        color: "from-purple-500 to-indigo-500",
        subCategories: [
          {
            key: "languagesets",
            title: "The Language of Sets",
            description: "Set Theory Concepts, Types of Sets",
            icon: LanguageIcon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "relationships",
            title: "Relationships Between Sets",
            description: "Universal Set, Complement, Subsets",
            icon: Squares2X2Icon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "operations",
            title: "Operations with Sets",
            description: "Intersection, Union",
            icon: CalculatorIcon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "solvingproblems",
            title: "Solving Problems",
            description: "Word problems involving set concepts",
            icon: ChartBarIcon,
            color: "from-orange-500 to-red-500"
          }
        ]
      }
    ],
    english: [
      // TODO: Add English topics for Term 1
    ],
    science: [
      // TODO: Add Science topics for Term 1
    ],
    socialstudies: [
      // TODO: Add Social Studies topics for Term 1
    ],
    spanish: [
      // TODO: Add Spanish topics for Term 1
    ],
    informationtechnology: [
      // TODO: Add IT topics for Term 1
    ]
  },
  term2: {
    mathematics: [
      {
        key: "measurement",
        title: "Measurement",
        description: "Calculate areas, volumes, and solve real-world measurement problems.",
        icon: RectangleStackIcon,
        color: "from-green-500 to-emerald-500",
        subCategories: [
          {
            key: "perimeter2dshapes",
            title: "Perimeter & Area of 2D Shapes",
            description: "Perimeter and area of polygons, circles, and sectors",
            icon: Squares2X2Icon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "surfacevolume3d",
            title: "Surface Area & Volume of 3D Solids",
            description: "Surface area and volume of prisms, cylinders, cones, etc.",
            icon: RectangleStackIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "motiontime",
            title: "Motion & Time",
            description: "Speed, distance, and time",
            icon: HashtagIcon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "scalerepresentation",
            title: "Scale & Representation",
            description: "Scale drawings",
            icon: ChartBarIcon,
            color: "from-orange-500 to-red-500"
          }
        ]
      },
      {
        key: "statistics",
        title: "Statistics",
        description: "Learn to collect, organize, and analyze data to make informed decisions.",
        icon: ChartBarIcon,
        color: "from-blue-500 to-cyan-500",
        subCategories: [
          {
            key: "datafundamentals",
            title: "Data Fundamentals & Organisation",
            description: "Data types, frequency tables",
            icon: RectangleStackIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "datarepresentation",
            title: "Data Representation",
            description: "Interpreting statistical diagrams",
            icon: ChartBarIcon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "dataanalysis",
            title: "Data Analysis (Ungrouped & Grouped)",
            description: "Measures of central tendency and dispersion",
            icon: CalculatorIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "introprobability",
            title: "Introduction to Probability",
            description: "Probability",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          }
        ]
      },
      {
        key: "algebra1",
        title: "Algebra 1",
        description: "Master the language of math with variables, expressions, and equations.",
        icon: CalculatorIcon,
        color: "from-purple-500 to-indigo-500",
        subCategories: [
          {
            key: "fundamentalsalgebra",
            title: "Fundamentals of Algebraic Expressions",
            description: "Symbolic representation, algebraic expressions, substitution",
            icon: LanguageIcon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "manipulatingexpressions",
            title: "Manipulating Expressions",
            description: "Distributive law, binary operations",
            icon: CalculatorIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "workingformulas",
            title: "Working with Formulas",
            description: "Changing the subject of a formula",
            icon: Squares2X2Icon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "solvingequations",
            title: "Solving Equations",
            description: "Solving linear and simultaneous linear equations",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          }
        ]
      }
    ],
    english: [],
    science: [],
    socialstudies: [],
    spanish: [],
    informationtechnology: []
  },
  term3: {
    mathematics: [
      {
        key: "relationsfunctionsgraphs1",
        title: "Relations, Functions & Graphs 1",
        description: "Explore mathematical relationships and their graphical representations.",
        icon: ChartBarIcon,
        color: "from-blue-500 to-cyan-500",
        subCategories: [
          {
            key: "fundamentalsrelations",
            title: "Fundamentals of Relations and Functions",
            description: "Introduction to relations and functions, domain, range, and function notation",
            icon: HashtagIcon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "gradientequation",
            title: "The Gradient and Equation of a Line",
            description: "Gradient, equation of a line, intercepts",
            icon: ChartBarIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "parallelperpendicular",
            title: "Parallel and Perpendicular Lines",
            description: "Properties of parallel and perpendicular lines",
            icon: Squares2X2Icon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "graphicalsolutions",
            title: "Graphical Solutions and Coordinates",
            description: "Graphical solution of simultaneous equations, midpoint, length of a line",
            icon: CalculatorIcon,
            color: "from-orange-500 to-red-500"
          }
        ]
      },
      {
        key: "geometrytrigonometry1",
        title: "Geometry & Trigonometry 1",
        description: "Master shapes, angles, and the basics of trigonometry.",
        icon: Squares2X2Icon,
        color: "from-purple-500 to-indigo-500",
        subCategories: [
          {
            key: "propertiesangles",
            title: "Properties of Lines, Angles, and Polygons",
            description: "Angle properties, parallel lines, and polygon rules",
            icon: Squares2X2Icon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "congruencesimilarity",
            title: "Congruence and Similarity",
            description: "Conditions for congruence and properties of similar shapes",
            icon: RectangleStackIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "pythagorastheorem",
            title: "Pythagoras' Theorem",
            description: "Calculations involving right-angled triangles",
            icon: CalculatorIcon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "trigratios",
            title: "Basic Trigonometric Ratios",
            description: "Sine, Cosine, and Tangent in right-angled triangles",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          }
        ]
      }
    ],
    english: [],
    science: [],
    socialstudies: [],
    spanish: [],
    informationtechnology: []
  }
};

// 📘 GRADE 11 TERM DATA (can be customized for Grade 11 curriculum)
const termDataGrade11 = {
  term1: {
    mathematics: [
      {
        key: "algebra2",
        title: "Algebra 2",
        description: "Advanced algebraic techniques including indices and quadratics",
        icon: CalculatorIcon,
        color: "from-blue-500 to-cyan-500",
        subCategories: [
          {
            key: "lawsindices",
            title: "Laws of Indices & Applications",
            description: "Simplifying expressions and solving equations with powers",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          },
          {
            key: "advancedfactorization",
            title: "Advanced Factorization Techniques",
            description: "Difference of two squares, perfect squares, and grouping",
            icon: Squares2X2Icon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "quadraticexpressions",
            title: "Quadratic Expressions & Algebraic Fractions",
            description: "Factorizing quadratics and simplifying algebraic fractions",
            icon: CalculatorIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "solvingquadratics",
            title: "Solving Quadratic Equations",
            description: "Using factorization, the formula, and completing the square",
            icon: RectangleStackIcon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      },
      {
        key: "relationsfunctionsgraphs2",
        title: "Relations, Functions & Graphs 2",
        description: "Advanced functions, quadratic graphs, and real-world applications",
        icon: ChartBarIcon,
        color: "from-purple-500 to-indigo-500",
        subCategories: [
          {
            key: "compositeinverse",
            title: "Composite and Inverse Functions",
            description: "Combining functions and finding their inverses",
            icon: HashtagIcon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "quadraticgraphs",
            title: "Analysis of Quadratic Graphs",
            description: "Finding axis of symmetry, minimum/maximum points, and roots",
            icon: ChartBarIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "nonlineargraphs",
            title: "Interpreting Non-Linear Graphs",
            description: "Distance-time and speed-time graphs",
            icon: RectangleStackIcon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "linearprogramming",
            title: "Linear Programming",
            description: "Forming inequalities and finding optimal solutions",
            icon: Squares2X2Icon,
            color: "from-orange-500 to-red-500"
          }
        ]
      },
      {
        key: "geometrytrigonometry2",
        title: "Geometry & Trigonometry 2",
        description: "Advanced geometric and trigonometric concepts",
        icon: RectangleStackIcon,
        color: "from-green-500 to-emerald-500",
        subCategories: [
          {
            key: "sinerule",
            title: "The Sine Rule",
            description: "Finding unknown sides and angles in non-right-angled triangles",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          },
          {
            key: "bearings",
            title: "Bearings",
            description: "Solving navigation problems using trigonometry",
            icon: GlobeAltIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "circletheorems",
            title: "Circle Theorems",
            description: "Solving for angles using circle properties",
            icon: Squares2X2Icon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      }
    ],
    english: [],
    science: [],
    socialstudies: [],
    spanish: [],
    informationtechnology: []
  },
  term2: {
    mathematics: [
      {
        key: "algebra2",
        title: "Algebra 2",
        description: "Advanced algebraic techniques including indices and quadratics",
        icon: CalculatorIcon,
        color: "from-blue-500 to-cyan-500",
        subCategories: [
          {
            key: "lawsindices",
            title: "Laws of Indices & Applications",
            description: "Simplifying expressions and solving equations with powers",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          },
          {
            key: "advancedfactorization",
            title: "Advanced Factorization Techniques",
            description: "Difference of two squares, perfect squares, and grouping",
            icon: Squares2X2Icon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "quadraticexpressions",
            title: "Quadratic Expressions & Algebraic Fractions",
            description: "Factorizing quadratics and simplifying algebraic fractions",
            icon: CalculatorIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "solvingquadratics",
            title: "Solving Quadratic Equations",
            description: "Using factorization, the formula, and completing the square",
            icon: RectangleStackIcon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      },
      {
        key: "relationsfunctionsgraphs2",
        title: "Relations, Functions & Graphs 2",
        description: "Advanced functions, quadratic graphs, and real-world applications",
        icon: ChartBarIcon,
        color: "from-purple-500 to-indigo-500",
        subCategories: [
          {
            key: "compositeinverse",
            title: "Composite and Inverse Functions",
            description: "Combining functions and finding their inverses",
            icon: HashtagIcon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "quadraticgraphs",
            title: "Analysis of Quadratic Graphs",
            description: "Finding axis of symmetry, minimum/maximum points, and roots",
            icon: ChartBarIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "nonlineargraphs",
            title: "Interpreting Non-Linear Graphs",
            description: "Distance-time and speed-time graphs",
            icon: RectangleStackIcon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "linearprogramming",
            title: "Linear Programming",
            description: "Forming inequalities and finding optimal solutions",
            icon: Squares2X2Icon,
            color: "from-orange-500 to-red-500"
          }
        ]
      },
      {
        key: "geometrytrigonometry2",
        title: "Geometry & Trigonometry 2",
        description: "Advanced geometric and trigonometric concepts",
        icon: RectangleStackIcon,
        color: "from-green-500 to-emerald-500",
        subCategories: [
          {
            key: "sinerule",
            title: "The Sine Rule",
            description: "Finding unknown sides and angles in non-right-angled triangles",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          },
          {
            key: "cosinerulearea",
            title: "The Cosine Rule & Area of a Triangle",
            description: "Finding sides, angles, and area in non-right-angled triangles",
            icon: CalculatorIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "bearings",
            title: "Bearings",
            description: "Solving navigation problems using trigonometry",
            icon: GlobeAltIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "circletheorems",
            title: "Circle Theorems",
            description: "Solving for angles using circle properties",
            icon: Squares2X2Icon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      },
      {
        key: "vectorsmatrices",
        title: "Vectors and Matrices",
        description: "Vector algebra, matrix operations, and geometric applications",
        icon: HashtagIcon,
        color: "from-blue-500 to-cyan-500",
        subCategories: [
          {
            key: "vectoralgebrageometric",
            title: "Vector Algebra and Geometric Applications",
            description: "Visual problems with vectors in geometric contexts",
            icon: RectangleStackIcon,
            color: "from-orange-500 to-red-500"
          },
          {
            key: "matrixoperationsproperties",
            title: "Matrix Operations and Properties",
            description: "Addition, multiplication, and algebraic properties",
            icon: CalculatorIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "determinantinverse",
            title: "Determinant, Inverse, and Solving Equations",
            description: "Finding determinants, inverses, and solving systems",
            icon: Squares2X2Icon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "matricestransformations",
            title: "Matrices Representing Transformations",
            description: "Visual problems connecting matrices to geometric transformations",
            icon: HashtagIcon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      },
      {
        key: "transformationgeometry",
        title: "Transformation Geometry",
        description: "Translation, reflection, rotation, enlargement, and combined transformations",
        icon: RectangleStackIcon,
        color: "from-purple-500 to-indigo-500",
        subCategories: [
          {
            key: "translationreflection",
            title: "Translation and Reflection",
            description: "Moving and mirroring shapes on coordinate grids",
            icon: Squares2X2Icon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "rotation",
            title: "Rotation",
            description: "Rotating shapes about different centres",
            icon: HashtagIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "enlargement",
            title: "Enlargement",
            description: "Scaling shapes with different centres and scale factors",
            icon: RectangleStackIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "combinedinverse",
            title: "Combined and Inverse Transformations",
            description: "Applying multiple transformations and finding inverses",
            icon: CalculatorIcon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      }
    ],
    english: [],
    science: [],
    socialstudies: [],
    spanish: [],
    informationtechnology: []
  },
  term3: {
    mathematics: [
      {
        key: "revisionarea1",
        title: "Revision Area 1: Algebra and Functions",
        description: "Comprehensive review of algebra from basics to advanced functions",
        icon: CalculatorIcon,
        color: "from-blue-500 to-cyan-500",
        subCategories: [
          {
            key: "algebraicmanipulation",
            title: "Algebraic Manipulation & Equations",
            description: "Simplification, factorization, indices, algebraic fractions, equations",
            icon: HashtagIcon,
            color: "from-orange-500 to-red-500"
          },
          {
            key: "quadraticequationsfunctions",
            title: "Quadratic Equations & Functions",
            description: "Solving quadratics, completing the square, analyzing graphs",
            icon: Squares2X2Icon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "functionslineargraphs",
            title: "Functions & Linear Graphs",
            description: "Function notation, composite/inverse functions, gradient, equations",
            icon: ChartBarIcon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "advancedgraphsapplications",
            title: "Advanced Graphs & Applications",
            description: "Non-linear graphs, distance-time/speed-time, linear programming",
            icon: RectangleStackIcon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      },
      {
        key: "revisionarea2",
        title: "Revision Area 2: Geometry and Trigonometry",
        description: "Complete review of shapes, area, volume, and trigonometry",
        icon: RectangleStackIcon,
        color: "from-green-500 to-emerald-500",
        subCategories: [
          {
            key: "foundationalgeometry",
            title: "Foundational Geometry & Measurement",
            description: "Perimeter, area, volume, surface area, properties of polygons",
            icon: Squares2X2Icon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "pythagorasrighttrig",
            title: "Pythagoras & Right-Angled Trigonometry",
            description: "Pythagoras' theorem, SOHCAHTOA, angles of elevation/depression",
            icon: HashtagIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "nonrightangledtrig",
            title: "Non-Right-Angled Trigonometry & Bearings",
            description: "Sine Rule, Cosine Rule, Area = 1/2 ab sin C, Bearings",
            icon: GlobeAltIcon,
            color: "from-purple-500 to-indigo-500"
          },
          {
            key: "circletransformation",
            title: "Circle Theorems & Transformation Geometry",
            description: "Circle theorems, Translation, Reflection, Rotation, Enlargement",
            icon: RectangleStackIcon,
            color: "from-orange-500 to-red-500"
          }
        ]
      },
      {
        key: "revisionarea3",
        title: "Revision Area 3: Statistics, Vectors, and Other Topics",
        description: "Statistics, vectors, matrices, consumer arithmetic, and sets review",
        icon: ChartBarIcon,
        color: "from-purple-500 to-indigo-500",
        subCategories: [
          {
            key: "statisticsprobability",
            title: "Statistical Analysis & Probability",
            description: "Mean, median, mode, range, IQR, probability",
            icon: ChartBarIcon,
            color: "from-amber-500 to-orange-500"
          },
          {
            key: "vectoralgebra",
            title: "Vector Algebra & Geometry",
            description: "Vector notation, magnitude, addition/subtraction, geometric proofs",
            icon: HashtagIcon,
            color: "from-blue-500 to-cyan-500"
          },
          {
            key: "matrixoperations",
            title: "Matrix Operations & Equations",
            description: "Addition, multiplication, determinant, inverse, solving equations",
            icon: Squares2X2Icon,
            color: "from-green-500 to-emerald-500"
          },
          {
            key: "consumersets",
            title: "Consumer Arithmetic & Sets Review",
            description: "Key topics for Paper 1: money, interest, sets, Venn diagrams",
            icon: CalculatorIcon,
            color: "from-purple-500 to-indigo-500"
          }
        ]
      }
    ],
    english: [],
    science: [],
    socialstudies: [],
    spanish: [],
    informationtechnology: []
  }
};

// 🎓 MAIN GRADE TERM DATA - Maps grade to their curriculum
export const gradeTermData: Record<string, typeof termDataGrade10> = {
  "10": termDataGrade10,
  "11": termDataGrade11,
};

// Backward compatibility - default to grade 10
export const termData = termDataGrade10;

// 🎯 HELPER: Get topics by term, subject, and grade
export const getTopicsByTermAndSubject = (term: string | null, subject: string | null, grade?: string | null) => {
  if (!term || !subject) return [];
  
  // Default to grade 10 if not specified
  const userGrade = grade || "10";
  
  // Get the term data for the specified grade
  const gradeData = gradeTermData[userGrade] || gradeTermData["10"];
  
  // Map term to termData key
  const termKey = term.toLowerCase().replace(/\s+/g, '') as 'term1' | 'term2' | 'term3';
  
  // Map subject to subject key
  const subjectKey = mapSubjectToThemeKey(subject) as keyof typeof gradeData.term1;
  
  // Get topics from gradeData
  const topics = gradeData[termKey]?.[subjectKey] || [];
  
  // 🔄 FALLBACK LOGIC: Only for Term 1 subjects that don't have termData yet
  // Term 2 and Term 3 will show empty if no data available
  if (topics.length === 0 && termKey === 'term1' && subjectKey !== 'mathematics') {
    return subjectTopics[subjectKey] || [];
  }
  
  return topics;
};

// 🔄 DYNAMIC SUBJECT TOPICS: Use term-based data when available
export const subjectTopics: SubjectTopics = {
  // Mathematics now uses Term 1 data by default (will be overridden by getTopicsByTermAndSubject)
  mathematics: [
    {
      key: "numberoperations",
      title: "Number & Operations",
      description: "Master arithmetic, fractions, decimals, and basic operations with step-by-step guidance.",
      icon: HashtagIcon,
      color: "from-orange-500 to-red-500",
      subCategories: [
        {
          key: "basicoperations",
          title: "Basic Operations",
          description: "Addition, subtraction, multiplication, and division with whole numbers and integers.",
          icon: CalculatorIcon,
          color: "from-orange-500 to-red-500"
        },
        {
          key: "fractionsdecimals",
          title: "Fractions & Decimals",
          description: "Work with fractions, decimals, and conversions between them.",
          icon: HashtagIcon,
          color: "from-blue-500 to-cyan-500"
        },
        {
          key: "ratiospercentages",
          title: "Ratios & Percentages",
          description: "Understand ratios, proportions, and percentage calculations.",
          icon: ChartBarIcon,
          color: "from-purple-500 to-indigo-500"
        }
      ]
    },
    {
      key: "measurement",
      title: "Measurement",
      description: "Learn units, conversions, area, perimeter, and time calculations.",
      icon: RectangleStackIcon,
      color: "from-blue-500 to-cyan-500",
      subCategories: [
        {
          key: "lengtharea",
          title: "Length & Area",
          description: "Calculate perimeter, area of rectangles, triangles, and composite shapes.",
          icon: Squares2X2Icon,
          color: "from-amber-500 to-orange-500"
        },
        {
          key: "timevolume",
          title: "Time & Volume",
          description: "Work with time calculations and volume measurements.",
          icon: RectangleStackIcon,
          color: "from-blue-500 to-cyan-500"
        },
        {
          key: "unitconversions",
          title: "Unit Conversions",
          description: "Convert between different units of measurement.",
          icon: CalculatorIcon,
          color: "from-green-500 to-emerald-500"
        }
      ]
    },
    {
      key: "geometry",
      title: "Geometry",
      description: "Explore shapes, angles, coordinates, and spatial relationships.",
      icon: Squares2X2Icon,
      color: "from-amber-500 to-orange-500",
      subCategories: [
        {
          key: "anglesshapes",
          title: "Angles & Shapes",
          description: "Identify and classify angles, triangles, and quadrilaterals.",
          icon: Squares2X2Icon,
          color: "from-amber-500 to-orange-500"
        },
        {
          key: "coordinateslines",
          title: "Coordinates & Lines",
          description: "Work with coordinate grids and understand parallel and perpendicular lines.",
          icon: HashtagIcon,
          color: "from-purple-500 to-indigo-500"
        },
        {
          key: "symmetrytransformations",
          title: "Symmetry & Transformations",
          description: "Explore symmetry, rotations, reflections, and translations.",
          icon: Squares2X2Icon,
          color: "from-blue-500 to-cyan-500"
        }
      ]
    },
    {
      key: "datahandling",
      title: "Data Handling (Statistics)",
      description: "Understand graphs, charts, averages, and data interpretation.",
      icon: ChartBarIcon,
      color: "from-purple-500 to-indigo-500",
      subCategories: [
        {
          key: "statistics",
          title: "Statistics",
          description: "Calculate mean, median, mode, and range from data sets.",
          icon: ChartBarIcon,
          color: "from-purple-500 to-indigo-500"
        },
        {
          key: "graphscharts",
          title: "Graphs & Charts",
          description: "Interpret and create bar charts, line graphs, and pictographs.",
          icon: ChartBarIcon,
          color: "from-amber-500 to-orange-500"
        },
        {
          key: "probability",
          title: "Probability",
          description: "Understand simple probability and predict outcomes.",
          icon: HashtagIcon,
          color: "from-blue-500 to-cyan-500"
        }
      ]
    }
  ],
  english: [
    {
      key: "readingcomprehension",
      title: "Reading Comprehension",
      description: "Develop critical thinking skills through main ideas, supporting details, and text analysis.",
      icon: BookOpenIcon,
      color: "from-blue-500 to-indigo-500"
    },
    {
      key: "grammarpunctuation",
      title: "Grammar & Punctuation",
      description: "Master sentence structure, verb agreement, dialogue punctuation, and writing mechanics.",
      icon: LanguageIcon,
      color: "from-amber-500 to-orange-500"
    },
    {
      key: "writingparagraphs",
      title: "Writing: Paragraphs & Summaries",
      description: "Create clear topic sentences, supporting details, and well-organized paragraphs.",
      icon: RectangleStackIcon,
      color: "from-purple-500 to-indigo-500"
    },
    {
      key: "vocabularyliterary",
      title: "Vocabulary & Literary Devices",
      description: "Expand word knowledge and understand similes, metaphors, and figurative language.",
      icon: ChatBubbleLeftRightIcon,
      color: "from-orange-500 to-red-500"
    }
  ],
  science: [
    {
      key: "biology",
      title: "Biology",
      description: "Explore living organisms, ecosystems, and life processes through local examples.",
      icon: BeakerIcon,
      color: "from-amber-500 to-orange-500"
    },
    {
      key: "chemistry",
      title: "Chemistry",
      description: "Understand matter, chemical changes, and everyday chemical processes.",
      icon: RectangleStackIcon,
      color: "from-blue-500 to-cyan-500"
    },
    {
      key: "physics",
      title: "Physics",
      description: "Discover forces, energy, motion, and physical properties of matter.",
      icon: HashtagIcon,
      color: "from-purple-500 to-indigo-500"
    },
    {
      key: "scientificinquiry",
      title: "Scientific Inquiry/Measurement & Safety",
      description: "Learn scientific method, measurement skills, and laboratory safety practices.",
      icon: ChartBarIcon,
      color: "from-orange-500 to-red-500"
    }
  ],
  socialstudies: [
    {
      key: "civicsgovernment",
      title: "Civics & Government",
      description: "Understand New Zealand's government structure, citizenship rights, and democratic processes.",
      icon: AcademicCapIcon,
      color: "from-purple-500 to-indigo-500"
    },
    {
      key: "geographymapskills",
      title: "Geography & Map Skills",
      description: "Explore New Zealand's physical features, climate, and develop map reading skills.",
      icon: GlobeAltIcon,
      color: "from-amber-500 to-orange-500"
    },
    {
      key: "economyresources",
      title: "Economy & Resources",
      description: "Learn about New Zealand's industries, trade, resources, and economic development.",
      icon: ChartBarIcon,
      color: "from-blue-500 to-cyan-500"
    },
    {
      key: "cultureheritage",
      title: "Culture, Heritage & Regional Integration",
      description: "Celebrate New Zealand's diversity and understand Caribbean regional connections.",
      icon: BookOpenIcon,
      color: "from-orange-500 to-red-500"
    }
  ],
  spanish: [
    {
      key: "greetingspersonal",
      title: "Greetings & Personal Information",
      description: "Learn basic introductions, personal details, and polite expressions in Spanish.",
      icon: ChatBubbleLeftRightIcon,
      color: "from-yellow-500 to-orange-500"
    },
    {
      key: "numberstimedates",
      title: "Numbers, Time & Dates",
      description: "Master counting, telling time, and expressing dates in Spanish.",
      icon: HashtagIcon,
      color: "from-amber-500 to-orange-500"
    },
    {
      key: "classroomschool",
      title: "Classroom & School Life",
      description: "Build vocabulary for school objects, subjects, and classroom interactions.",
      icon: AcademicCapIcon,
      color: "from-blue-500 to-indigo-500"
    },
    {
      key: "likesdislikes",
      title: "Likes/Dislikes & Basic Descriptions",
      description: "Express preferences, describe people and things using basic Spanish structures.",
      icon: BookOpenIcon,
      color: "from-purple-500 to-indigo-500"
    }
  ],
  informationtechnology: [
    {
      key: "computersystems",
      title: "Computer Systems (Hardware & Software)",
      description: "Understand computer components, input/output devices, and basic system operations.",
      icon: ComputerDesktopIcon,
      color: "from-cyan-500 to-blue-500"
    },
    {
      key: "digitalsafety",
      title: "Digital Safety & Responsible Use",
      description: "Learn online safety, password security, and responsible digital citizenship.",
      icon: Squares2X2Icon,
      color: "from-red-500 to-orange-500"
    },
    {
      key: "filesproductivity",
      title: "Files & Productivity Tools",
      description: "Master file management, document formats, and productivity applications.",
      icon: RectangleStackIcon,
      color: "from-amber-500 to-orange-500"
    },
    {
      key: "dataspreadsheets",
      title: "Data & Spreadsheets",
      description: "Work with data entry, formulas, charts, and basic statistical analysis.",
      icon: ChartBarIcon,
      color: "from-purple-500 to-indigo-500"
    }
  ]
};

/**
 * 📚 PRESET MESSAGES - QUICK REFERENCE
 * =====================================
 * 
 * 🎯 CURRENT FORMAT (all questions use this):
 * {
 *   type: 'single_ask' as const,
 *   value: "Your question here"
 * }
 * 
 * 🚀 FUTURE FORMATS (for multiple choice - implement later):
 * {
 *   type: 'multiple_choice' as const,
 *   value: "Question?",
 *   preset_answers: ["A", "B", "C", "D"],
 *   correct_answer: "B"
 * }
 * 
 * See types.ts for full documentation and examples.
 */


// 🎓 MAIN GRADE PRESET MESSAGES - Maps grade to their preset messages
export const gradePresetMessages: Record<string, any> = {
  "10": presetMessagesGrade10,
  "11": presetMessagesGrade11,
};

// Backward compatibility - default to grade 10 term 1
export const presetMessages: PresetMessages = presetMessagesGrade10.term1;

// 🎯 HELPER: Get preset messages by term and grade
export const getPresetMessagesByTermAndGrade = (term: string | null, grade?: string | null) => {
  // Default to grade 10 if not specified
  const userGrade = grade || "10";
  
  // Get the preset messages for the specified grade
  const gradeMessages = gradePresetMessages[userGrade] || gradePresetMessages["10"];
  
  // Map term to termData key
  const termKey = term?.toLowerCase().replace(/\s+/g, '') as 'term1' | 'term2' | 'term3';
  
  // Get messages for the specific term, fallback to term1
  return gradeMessages[termKey] || gradeMessages.term1;
};