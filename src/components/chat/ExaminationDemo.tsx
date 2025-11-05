import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { ChatMessage } from '~/store/types';
import { extractExaminationStream, extractTopicsFromHistory, type ExamQuestion, type ConversationMessage } from '~/services/examination.service';
import { uiStore } from '~/store/ui';
import { CustomMarkdown } from './shared/CustomMarkdown';
import { AnswerChoice } from './shared/AnswerChoice';
import { getQuizTheme } from './constants';

// Types for answer submission
interface QuizAnswer {
  questionId: string;
  question: string;
  subject: string;
  choices: string[];
  userAnswer: {
    selectedIndex: number;
    selectedChoice: string;
    letter: string;
  };
  correctAnswer?: {
    index: number;
    choice: string;
    letter: string;
  };
  isCorrect: boolean;
}

interface AnswerSubmission {
  type: 'quiz_answer_submission';
  timestamp: string;
  sessionContext: {
    aiMessageContent: string;
    contextLength: number;
  };
  quizData: {
    totalQuestions: number;
    answeredQuestions: number;
    questions: QuizAnswer[];
  };
  gradingRequest: {
    requireDetailedFeedback: boolean;
    requireScoreCalculation: boolean;
    requireStudySuggestions: boolean;
    requireContextualConnection: boolean;
  };
  metadata: {
    submittedAt: string;
    completionPercentage: number;
    timeTaken?: number;
  };
}

interface ExaminationDemoProps {
  latestAIMessage: ChatMessage;
  conversationHistory?: ChatMessage[];
  forceRegenerate?: boolean;
  onClose$?: () => void;
  onPromptSelect$?: (prompt: string, options?: { mode?: string; subject?: string; topic?: string }) => void;
}

/**
 * ExaminationDemo Component - Optimized for Qwik
 * 
 * Features:
 * - Streaming examination generation
 * - Progressive question rendering
 * - Answer selection and submission
 * - Optimized with Qwik signals and reactivity
 */
export const ExaminationDemo = component$<ExaminationDemoProps>((props) => {
  const questions = useSignal<ExamQuestion[]>([]);
  const answers = useSignal<Record<string, number>>({});
  const submitted = useSignal(false);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const isStreaming = useSignal(false);
  const partialQuestions = useSignal<ExamQuestion[]>([]);
  const aiResponse = useSignal<string>('');
  const aiResponseComplete = useSignal(false);
  const showCelebration = useSignal(false);
  const lastProcessedMessageId = useSignal<string>('');
  const startTime = useSignal<number>(Date.now());

  // Get theme based on subject
  const currentSubject = uiStore.currentChatSubject || 'default';
  const theme = getQuizTheme(currentSubject);

  // Convert ChatMessage[] to ConversationMessage[]
  const convertToConversationHistory = $((messages: ChatMessage[]): ConversationMessage[] => {
    const now = new Date().toISOString();
    return messages
      .slice(-3) // Only take last 3 messages
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: now
      }));
  });

  // Generate questions when component mounts or message changes
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => props.latestAIMessage.id);
    track(() => props.forceRegenerate);

    // Reset if force regenerate
    if (props.forceRegenerate) {
      lastProcessedMessageId.value = '';
    }

    // Prevent duplicate calls
    if (!props.forceRegenerate && props.latestAIMessage.id === lastProcessedMessageId.value) {
      return;
    }

    // Skip if message too short
    if (!props.latestAIMessage.content || props.latestAIMessage.content.trim().length < 50) {
      return;
    }

    const generateQuestions = async () => {
      loading.value = true;
      error.value = null;
      isStreaming.value = true;
      aiResponse.value = '';
      aiResponseComplete.value = false;
      showCelebration.value = false;
      
      try {
        const historyForContext = await convertToConversationHistory(
          props.conversationHistory || []
        );

        await extractExaminationStream(
          {
            context: props.latestAIMessage.content,
            conversationHistory: historyForContext,
            previousTopics: extractTopicsFromHistory(historyForContext),
            subject: uiStore.currentChatSubject,
            topic: uiStore.currentChatTopic,
          },
          {
            onChunk: (chunk: string) => {
              // Parse and extract questions progressively
              try {
                const match = chunk.match(/"questions"\s*:\s*\[([\s\S]*)\]/);
                if (match) {
                  const questionsStr = match[1];
                  const questionMatches = questionsStr.match(/\{[^}]*"id"\s*:\s*"[^"]+"\s*,[^}]*"question"\s*:\s*"[^"]*"[^}]*\}/g);
                  
                  if (questionMatches) {
                    const parsed: ExamQuestion[] = [];
                    questionMatches.forEach(qStr => {
                      try {
                        const q = JSON.parse(qStr);
                        if (q.id && q.question && q.choices && Array.isArray(q.choices) && q.choices.length === 3) {
                          parsed.push(q);
                        }
                      } catch {
                        // Skip incomplete questions
                      }
                    });
                    if (parsed.length > 0) {
                      partialQuestions.value = parsed;
                      // Show celebration when first question appears
                      if (parsed.length === 1) {
                        showCelebration.value = true;
                        setTimeout(() => {
                          showCelebration.value = false;
                        }, 2000);
                      }
                    }
                  }
                }
              } catch {
                // Continue accumulating
              }
            },
            onAiResponseChunk: (chunk: string) => {
              aiResponse.value += chunk;
            },
            onAiResponseComplete: () => {
              aiResponseComplete.value = true;
            },
            onComplete: (receivedQuestions: ExamQuestion[]) => {
              questions.value = receivedQuestions;
              answers.value = {};
              submitted.value = false;
              startTime.value = Date.now();
              lastProcessedMessageId.value = props.latestAIMessage.id;
              isStreaming.value = false;
              partialQuestions.value = [];
              loading.value = false;
            },
            onError: (errorMessage: string) => {
              error.value = errorMessage;
              isStreaming.value = false;
              partialQuestions.value = [];
              aiResponse.value = '';
              aiResponseComplete.value = false;
              loading.value = false;
            }
          }
        );
      } catch (err: any) {
        error.value = err.message || 'Failed to extract examination questions';
        isStreaming.value = false;
        loading.value = false;
      }
    };

    // Debounce API call
    const timeoutId = setTimeout(() => {
      generateQuestions();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  const handleAnswerSubmit$ = $((questionId: string, selectedChoice: number) => {
    answers.value = { ...answers.value, [questionId]: selectedChoice };
  });

  const generateSubmissionPrompt$ = $((): string | null => {
    const answeredQuestions = questions.value.filter(q => answers.value[q.id] !== undefined);
    
    if (answeredQuestions.length === 0) return null;

    // Calculate timing
    const timeTaken = Math.floor((Date.now() - startTime.value) / 1000);
    
    // Build quiz answers array - without correctAnswer or explanation
    const quizAnswers: QuizAnswer[] = answeredQuestions.map(question => {
      const selectedIndex = answers.value[question.id];
      
      return {
        questionId: question.id,
        question: question.question,
        subject: question.subject,
        choices: question.choices,
        userAnswer: {
          selectedIndex,
          selectedChoice: question.choices[selectedIndex],
          letter: String.fromCharCode(65 + selectedIndex)
        },
        // No correctAnswer field - AI will determine this
        correctAnswer: undefined,
        // isCorrect will be determined by AI
        isCorrect: false
      };
    });

    // Create submission object
    const submission: AnswerSubmission = {
      type: 'quiz_answer_submission',
      timestamp: new Date().toISOString(),
      sessionContext: {
        aiMessageContent: props.latestAIMessage.content,
        contextLength: props.latestAIMessage.content.length
      },
      quizData: {
        totalQuestions: questions.value.length,
        answeredQuestions: answeredQuestions.length,
        questions: quizAnswers
      },
      gradingRequest: {
        requireDetailedFeedback: true,
        requireScoreCalculation: true,
        requireStudySuggestions: true,
        requireContextualConnection: true
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        completionPercentage: Math.round((answeredQuestions.length / questions.value.length) * 100),
        timeTaken
      }
    };

    // Return JSON with special prefix for UserMessage to detect
    return `<-Answer Template-> ${JSON.stringify(submission, null, 2)}`;
  });

  const handleSubmit$ = $(async () => {
    if (Object.keys(answers.value).length === 0 || !props.onPromptSelect$) return;
    
    const prompt = await generateSubmissionPrompt$();
    if (prompt) {
      // Always use STUDY mode (project only has study-guide)
      props.onPromptSelect$(prompt, {
        mode: 'STUDY',
        subject: uiStore.currentChatSubject || undefined,
        topic: uiStore.currentChatTopic || undefined,
      });
      submitted.value = true;
      
      // Close examination demo after submission
      if (props.onClose$) {
        setTimeout(() => {
          props.onClose$!();
        }, 1000);
      }
    }
  });

  const handleRetry$ = $(() => {
    error.value = null;
    loading.value = false;
    questions.value = [];
    answers.value = {};
    submitted.value = false;
    partialQuestions.value = [];
    lastProcessedMessageId.value = '';
    // Trigger re-generation by updating forceRegenerate
    if (props.onClose$) {
      props.onClose$();
    }
  });

  const canSubmit = Object.keys(answers.value).length > 0 && !loading.value;
  const currentChatSubject = uiStore.currentChatSubject;
  const currentChatTopic = uiStore.currentChatTopic;

  // Calculate progress
  const answeredCount = Object.keys(answers.value).length;
  const totalQuestions = questions.value.length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div 
      class={`p-5 pt-5 pb-4 rounded-xl ${theme.quizContainer} shadow-xl border-2 border-black/10 transition-all duration-300 hover:shadow-2xl`}
      role="region"
      aria-labelledby="quiz-title"
      aria-describedby="quiz-description"
    >
      {/* Enhanced Header with Subject/Topic Context and Progress */}
      <div class="flex items-start gap-4 mb-6 pb-5 border-b-2 border-black/10">
        <div class="p-3 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md shadow-lg ring-1 ring-white/20">
          <svg class={`h-6 w-6 ${theme.questionTitle}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2 flex-wrap">
            <h3 id="quiz-title" class={`text-xl font-bold ${theme.questionTitle} leading-tight`}>
              {currentChatSubject && currentChatTopic 
                ? `${currentChatSubject} Quiz - ${currentChatTopic}`
                : currentChatSubject 
                ? `${currentChatSubject} Practice Quiz`
                : 'Practice Quiz'}
            </h3>
            {/* Progress Badge */}
            {!loading.value && !error.value && totalQuestions > 0 && (
              <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
                <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs font-bold text-blue-700">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
            )}
          </div>
          <p id="quiz-description" class={`text-sm ${theme.questionText} mb-2 leading-relaxed`}>
            {loading.value ? 'Extracting questions from our discussion...' : 
             error.value ? 'Failed to extract questions' :
             currentChatSubject && currentChatTopic 
               ? `Focused on ${currentChatTopic} - answer and submit for contextual AI grading`
               : `Based on our discussion above - answer and submit for contextual AI grading`}
          </p>
          
          {/* Progress Bar */}
          {!loading.value && !error.value && totalQuestions > 0 && (
            <div class="mt-3">
              <div class="flex items-center justify-between mb-1.5">
                <span class={`text-xs font-semibold ${theme.questionText}`}>
                  Progress: {progressPercentage}%
                </span>
                <span class={`text-xs font-medium ${theme.questionText} opacity-70`}>
                  {answeredCount === totalQuestions ? 'All answered!' : `${totalQuestions - answeredCount} remaining`}
                </span>
              </div>
              <div class={`h-2 ${theme.progressTrack} rounded-full overflow-hidden shadow-inner`}>
                <div 
                  class={`h-full ${theme.progressFill} transition-all duration-500 ease-out rounded-full`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {currentChatSubject && currentChatTopic && !loading.value && !error.value && (
            <div class="flex items-center gap-2 mt-2 pt-2 border-t border-black/5">
              <span class={`${theme.questionTitle} font-semibold text-xs px-2 py-0.5 rounded-md bg-white/50`}>{currentChatSubject}</span>
              <div class={`h-1 w-1 rounded-full ${theme.questionText} opacity-50`}></div>
              <span class={`${theme.questionText} text-xs`}>{currentChatTopic}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error State - Enhanced */}
      {error.value && (
        <div 
          class={`mb-5 p-4 ${theme.incorrectIndicator} rounded-xl shadow-lg border-2 border-red-400 relative overflow-hidden`}
          role="alert"
          aria-labelledby="error-title"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-2.5 mb-3">
              <div class="p-2 rounded-lg bg-red-100">
            <svg class="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
              </div>
            <span id="error-title" class="text-red-800 font-bold text-base">Error Generating Quiz</span>
          </div>
            <p class="text-red-800 text-sm mb-4 leading-relaxed">{error.value}</p>
          <button 
            onClick$={handleRetry$}
              class={`${theme.skipBtn} px-5 py-2.5 text-sm font-semibold ${theme.focusRing} shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 rounded-lg hover:scale-105 active:scale-95`}
            aria-label="Retry generating quiz questions"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Generation
          </button>
          </div>
        </div>
      )}

      {/* Loading State - Enhanced */}
      {loading.value && !isStreaming.value && (
        <div role="status" aria-live="polite" aria-label="Loading quiz questions">
          <div class="flex flex-col items-center justify-center py-8">
            <div class="relative mb-4">
              <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p class={`text-sm font-medium ${theme.questionText} mb-2`}>Preparing your quiz...</p>
            <div class="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse" style="width: 60%"></div>
            </div>
          </div>
        </div>
      )}

      {/* AI Response Message - Natural text flow like document, no box/border */}
      {aiResponse.value && (
        <div class="group/message relative flex gap-x-2 sm:gap-x-3 md:gap-x-4 mb-6">
          <div class="relative flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full sm:flex">
            <img
              src="/flag.png"
              alt="AI Avatar"
              width={28}
              height={28}
              class="rounded-full"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="prose prose-invert prose-p:!my-2 prose-headings:!mt-4 prose-headings:!mb-2 prose-pre:!my-0 prose-pre:!bg-transparent prose-pre:!p-0 max-w-none text-black">
              <CustomMarkdown content={aiResponse.value} />
              {!aiResponseComplete.value && (
                <span class="inline-block w-0.5 h-4 bg-blue-500 ml-1 align-middle animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtle separator after AI response when complete */}
      {aiResponseComplete.value && aiResponse.value && !isStreaming.value && (
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
        </div>
      )}

      {/* Loading indicator when streaming but no AI response yet */}
      {isStreaming.value && !aiResponse.value && (
        <div class="group/message relative flex gap-x-2 sm:gap-x-3 md:gap-x-4 mb-6">
          <div class="relative flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full sm:flex">
            <img
              src="/flag.png"
              alt="AI Avatar"
              width={28}
              height={28}
              class="rounded-full opacity-70"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 text-gray-600 animate-pulse">
              <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span class="text-sm">Thinking and crafting your practice question...</span>
            </div>
          </div>
        </div>
      )}

      {/* Streaming State - Show generating questions progressively - Enhanced */}
      {(isStreaming.value || partialQuestions.value.length > 0) && (
        <div 
          class="mb-5"
          role="status" 
          aria-live="polite" 
          aria-label="Generating quiz questions"
        >
          <div class="space-y-5">
            {partialQuestions.value.length > 0 && partialQuestions.value.map((question, index) => (
              <div 
                key={question.id}
                class={`${theme.questionCard} p-5 rounded-xl border-2 border-blue-400 shadow-xl relative overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl animate-fadeIn`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                }}
              >
                {/* Enhanced sparkle effect on new question */}
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300/50 via-blue-300/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
                <div class="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div class="absolute top-4 right-6 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
                
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-4 flex-wrap">
                    <span class={`${theme.questionNumber} px-3 py-1.5 text-xs rounded-lg shadow-lg font-bold flex items-center gap-1.5`}>
                      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/30 text-xs font-black animate-pulse">
                        {index + 1}
                      </span>
                      {question.subject}
                    </span>
                    <span class="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold shadow-lg animate-pulse flex items-center gap-2">
                      <span class="w-2 h-2 bg-white rounded-full animate-ping"></span>
                      Ready!
                    </span>
                  </div>
                  
                  <div class="mb-4">
                    <h4 class={`${theme.questionText} text-base font-bold leading-relaxed`}>
                      <CustomMarkdown content={question.question} />
                    </h4>
                  </div>
                  
                  {question.choices && question.choices.length === 3 && (
                    <div class="space-y-2.5">
                      {question.choices.map((choice, idx) => (
                        <div 
                          key={idx}
                          class="p-3.5 rounded-xl border-2 border-gray-300 bg-gradient-to-r from-gray-50 via-white to-gray-50 text-gray-700 text-sm font-medium transform transition-all duration-300 hover:shadow-lg hover:border-blue-400 hover:scale-[1.02] hover:bg-blue-50/50 cursor-pointer"
                          style={{ 
                            animationDelay: `${(index * 300) + (idx * 100) + 200}ms`,
                          }}
                        >
                          <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs mr-3 shadow-md">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <CustomMarkdown content={choice} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Skeleton loaders - ONLY show when streaming AND absolutely no questions parsed from JSON yet */}
            {partialQuestions.value.length === 0 && questions.value.length === 0 && isStreaming.value && aiResponseComplete.value && (
              <div class="p-4 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 animate-pulse">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-24 h-6 bg-blue-200 rounded-lg"></div>
                  <div class="w-16 h-5 bg-blue-100 rounded-full"></div>
                </div>
                <div class="mb-3">
                  <div class="w-full h-5 bg-blue-200 rounded mb-2"></div>
                  <div class="w-3/4 h-5 bg-blue-200 rounded"></div>
                </div>
                <div class="space-y-2">
                  <div class="w-full h-10 bg-blue-100 rounded-lg"></div>
                  <div class="w-full h-10 bg-blue-100 rounded-lg"></div>
                  <div class="w-full h-10 bg-blue-100 rounded-lg"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Celebration Effect when question is ready */}
          {showCelebration.value && partialQuestions.value.length === 1 && (
            <div class="mt-5 p-5 rounded-xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-400 shadow-2xl relative overflow-hidden animate-fadeIn">
              {/* Animated background glow */}
              <div class="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 animate-pulse"></div>
              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  class="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1000}ms`,
                    animationDuration: `${1.5 + Math.random()}s`
                  }}
                ></div>
              ))}
              
              <div class="flex items-center justify-center gap-4 relative z-10">
                <div class="text-4xl animate-bounce flex items-center justify-center" style={{ animationDelay: '0ms' }}>
                  <svg class="h-12 w-12 text-green-600 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div class="text-center">
                  <p class="text-xl font-bold text-green-800 mb-1.5 animate-fadeIn">
                    Question Ready! ✨
                  </p>
                  <p class="text-sm text-green-700 font-semibold">
                    {currentChatSubject ? `Your ${currentChatSubject} practice question is ready` : 'Your practice question is ready'}
                  </p>
                </div>
                <div class="text-4xl animate-bounce flex items-center justify-center" style={{ animationDelay: '150ms' }}>
                  <svg class="h-12 w-12 text-green-600 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submitted State - Enhanced */}
      {submitted.value && (
        <div class={`mb-5 p-4 ${theme.correctIndicator} rounded-xl shadow-lg border-2 border-green-400 relative overflow-hidden`}>
          <div class="absolute inset-0 bg-gradient-to-r from-green-50/50 to-transparent"></div>
          <div class="relative z-10">
          <div class="text-center">
              <div class="flex items-center justify-center gap-2.5 mb-3">
                <div class="p-2 rounded-lg bg-green-100">
                  <svg class="h-5 w-5 text-green-700 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
                </div>
                <span class="text-green-800 font-bold text-lg">
                {currentChatSubject ? `${currentChatSubject} Quiz Submitted!` : 'Quiz Submitted!'}
              </span>
            </div>
              <p class="text-green-800 text-sm font-medium leading-relaxed mb-2">
              {currentChatSubject && currentChatTopic 
                ? `Your ${currentChatTopic} answers have been sent for contextual AI grading based on our ${currentChatSubject} discussion.`
                : 'Quiz submitted for contextual AI grading! Check the chat above for detailed feedback based on our discussion.'}
            </p>
            {currentChatSubject && (
                <div class="mt-3 text-xs text-green-700 font-medium bg-green-50/50 rounded-lg px-3 py-2 inline-block">
                AI will provide personalized feedback for your {currentChatSubject} study session
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Questions - Only show when loaded - Enhanced */}
      {!loading.value && !error.value && questions.value.length > 0 && (
        <div class="space-y-5 mb-0">
          {questions.value.map((question, index) => {
            const isAnswered = answers.value[question.id] !== undefined;
            return (
            <div 
              key={question.id} 
                class={`${theme.questionCard} p-5 rounded-xl border-2 transition-all duration-300 ${
                  isAnswered 
                    ? 'border-blue-300 shadow-lg ring-2 ring-blue-100' 
                    : 'border-black/10 shadow-sm hover:shadow-md hover:border-blue-200'
                }`}
            >
                <div class="flex items-center gap-2 mb-4 flex-wrap">
                  <span class={`${theme.questionNumber} px-3 py-1.5 text-xs rounded-lg shadow-md font-bold flex items-center gap-1.5`}>
                    <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/30 text-xs font-black">
                      {index + 1}
                </span>
                    {question.subject}
                  </span>
                  {isAnswered && (
                    <span class={`${theme.answeredBadge} px-3 py-1 text-xs rounded-lg shadow-md flex items-center gap-1.5 animate-fadeIn`}>
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Answered
                  </span>
                )}
              </div>
              
                <div class="mb-4">
                  <h4 class={`${theme.questionText} text-base font-semibold leading-relaxed`}>
                  <CustomMarkdown content={question.question} />
                </h4>
              </div>
              
              <AnswerChoice
                questionText=""
                choices={question.choices}
                subject={currentChatSubject || 'default'}
                onAnswerSubmit$={(selectedChoice: number) => handleAnswerSubmit$(question.id, selectedChoice)}
              />
            </div>
            );
          })}
        </div>
      )}

      {/* Submit Button at Bottom - Enhanced */}
      {!loading.value && !error.value && questions.value.length > 0 && (
        <div class="border-t-2 border-black/10 pt-5 mt-6">
          {!submitted.value ? (
            <div class="text-center">
              <button
                onClick$={handleSubmit$}
                disabled={!canSubmit}
                class={`inline-flex items-center gap-2.5 px-8 py-3.5 text-sm rounded-xl font-bold transition-all duration-300 ${theme.focusRing} relative overflow-hidden group ${
                  canSubmit 
                    ? `${theme.submitBtn} shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95`
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300 shadow-sm'
                }`}
                aria-label={`Submit ${currentChatSubject ? currentChatSubject + ' quiz' : 'quiz'} with ${Object.keys(answers.value).length} of ${questions.value.length} answers`}
              >
                {canSubmit && (
                  <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <svg class={`h-5 w-5 relative z-10 ${canSubmit ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span class="relative z-10">
                {canSubmit 
                  ? currentChatSubject 
                    ? `Submit ${currentChatSubject} Quiz`
                    : 'Submit Quiz'
                    : `Answer ${totalQuestions - answeredCount} more question${totalQuestions - answeredCount === 1 ? '' : 's'}`}
                </span>
                {canSubmit && answeredCount < totalQuestions && (
                  <span class="relative z-10 px-2 py-0.5 text-xs bg-white/30 rounded-full font-semibold">
                    ({answeredCount}/{totalQuestions})
                  </span>
                )}
              </button>
              {canSubmit && (
                <div class="mt-3 space-y-1">
                  <p class={`text-xs ${theme.questionText} opacity-80 max-w-md mx-auto font-medium`}>
                  {currentChatSubject && currentChatTopic 
                    ? `AI will grade your ${currentChatTopic} answers with context from our ${currentChatSubject} discussion`
                    : 'AI will grade your answers with context from our discussion and provide detailed feedback'}
                </p>
                  {answeredCount < totalQuestions && (
                    <p class={`text-xs ${theme.questionText} opacity-60 max-w-md mx-auto`}>
                      You can submit partial answers, but consider answering all questions for better feedback
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div class="text-center">
              <div 
                class={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl ${theme.answeredBadge} font-bold shadow-lg animate-fadeIn`}
                role="status"
                aria-live="polite"
              >
                <svg class="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentChatSubject ? `${currentChatSubject} Quiz Submitted` : 'Submitted Successfully'}
              </div>
              <p class={`text-xs ${theme.questionText} opacity-80 mt-3 max-w-md mx-auto leading-relaxed`}>
                {currentChatSubject && currentChatTopic 
                  ? `Your ${currentChatTopic} quiz has been sent to AI for contextual ${currentChatSubject} grading and personalized feedback`
                  : 'Your quiz has been sent to AI for contextual grading and personalized feedback'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
