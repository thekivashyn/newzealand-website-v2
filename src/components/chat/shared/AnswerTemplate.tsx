import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { getQuizTheme } from '../constants';
import { CustomMarkdown } from '../shared/CustomMarkdown';
import { uiStore } from '~/store/ui';

// Types for answer submission
export interface QuizAnswer {
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
  explanation?: string;
  isCorrect: boolean;
}

export interface AnswerSubmission {
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

interface AnswerTemplateProps {
  submission: AnswerSubmission;
  displayMode?: 'preview' | 'submitted' | 'graded';
  subject?: string;
}

export const AnswerTemplate = component$<AnswerTemplateProps>((props) => {
  const expandedQuestions = useSignal<Set<string>>(new Set());
  const quizTheme = getQuizTheme(props.subject || uiStore.currentChatSubject || 'default');
  
  const totalQuestions = props.submission.quizData.totalQuestions;
  const isSingleQuestion = totalQuestions === 1;
  
  // Auto-expand all questions if only 1 question
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (isSingleQuestion && expandedQuestions.value.size === 0) {
      expandedQuestions.value = new Set(props.submission.quizData.questions.map(q => q.questionId));
    }
  });
  
  const isCompact = props.displayMode === 'submitted';
  
  const toggleQuestion$ = $((questionId: string) => {
    const newExpanded = new Set(expandedQuestions.value);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    expandedQuestions.value = newExpanded;
  });

  // Only count correct answers if we have grading results
  const hasGradingResults = props.submission.quizData.questions.some(q => q.correctAnswer !== undefined);
  const correctAnswers = hasGradingResults ? props.submission.quizData.questions.filter(q => q.isCorrect).length : 0;
  const scorePercentage = hasGradingResults && totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-700 bg-green-100 border-green-300';
    if (percentage >= 60) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    return 'text-red-700 bg-red-100 border-red-300';
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const filteredAndSortedQuestions = props.submission.quizData.questions;

  return (
    <div class={`rounded-2xl ${quizTheme.quizContainer} overflow-hidden w-full shadow-2xl border border-gray-200/80 backdrop-blur-sm bg-gradient-to-br from-white to-gray-50/50`}>
      {/* Header */}
      <div class={`p-5 ${quizTheme.quizContainer} border-b border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/80`}>
        <div class="flex items-center justify-between gap-4">
          {/* Left: concise title */}
          <div class="flex items-center gap-3 min-w-0">
            <div class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-xs font-bold text-white shadow-lg">
              Quiz
            </div>
            <h3 class={`text-base font-bold ${quizTheme.questionTitle} truncate tracking-tight`}>
              {props.displayMode === 'submitted' ? 'Submitted' : props.displayMode === 'graded' ? 'Results' : 'Preview'}
            </h3>
            <div class={`hidden sm:flex items-center gap-2 text-xs ${quizTheme.progressText} font-medium px-3 py-1 bg-gray-100/80 rounded-lg`}>
              <span class="truncate font-semibold">{props.submission.quizData.answeredQuestions}/{props.submission.quizData.totalQuestions} answered</span>
              <span class="text-gray-400">•</span>
              <span class="font-semibold">{formatTime(props.submission.metadata.timeTaken)}</span>
            </div>
          </div>

          {/* Right: compact KPIs - only show if graded */}
          {props.displayMode !== 'preview' && hasGradingResults && (
            <div class="flex items-center gap-2.5">
              <div class={`px-4 py-1.5 rounded-xl font-bold text-xs shadow-lg ${getScoreColor(scorePercentage)}`} title="Score">
                {scorePercentage}%
              </div>
              <div class="px-4 py-1.5 rounded-xl text-xs bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold shadow-lg" title="Correct / Total">
                {correctAnswers}/{totalQuestions}
              </div>
            </div>
          )}
        </div>
        
        {/* Subject Breakdown + Quick Actions */}
        {isCompact ? (
          <div class="flex flex-col gap-3 mt-4">
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span class="font-bold text-sm">{props.submission.quizData.totalQuestions} {props.submission.quizData.totalQuestions === 1 ? 'question' : 'questions'}</span>
              </div>
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-bold text-sm">{formatTime(props.submission.metadata.timeTaken)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div class="grid grid-cols-2 gap-3 text-center mt-4">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-md">
              <svg class="h-5 w-5 text-gray-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Questions</div>
              <div class="text-gray-900 text-lg font-bold mt-1">{props.submission.quizData.totalQuestions}</div>
            </div>
            
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-md">
              <svg class="h-5 w-5 text-blue-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-xs text-blue-700 font-semibold uppercase tracking-wide">Time</div>
              <div class="text-blue-900 text-lg font-bold mt-1">{formatTime(props.submission.metadata.timeTaken)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div class={`p-5 ${quizTheme.quizContainer} bg-gradient-to-b from-white to-gray-50/30`}>
        <div class="space-y-4">
          {filteredAndSortedQuestions.map((question, index) => {
            const isExpanded = isSingleQuestion || expandedQuestions.value.has(question.questionId);
            
            const borderClass = 'border-gray-200/80 bg-white/90 backdrop-blur-sm';
            
            return (
              <div key={question.questionId} class={`rounded-2xl ${quizTheme.questionCard} border ${borderClass} shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm`}>
                {isSingleQuestion ? (
                  // Single question: Always expanded, no button
                  <div class="p-6">
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex items-center gap-2.5 flex-1 min-w-0">
                        <div class="flex items-center gap-2.5">
                          <span class={`text-sm px-3 py-1.5 rounded-xl ${quizTheme.questionNumber} shadow-md font-bold`}>
                            Q{index + 1}
                          </span>
                          <span class="text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold shadow-md">
                            {question.subject}
                          </span>
                        </div>
                        
                        {props.displayMode !== 'preview' && (
                          <div class="flex items-center gap-2">
                            <span class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md">
                              Your Answer: <span class="font-mono font-bold text-base">{question.userAnswer.letter}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div class={`mt-5 text-base ${quizTheme.questionText} font-semibold text-left leading-relaxed`}>
                      <CustomMarkdown content={question.question} />
                    </div>
                    
                    {/* Choices - Always visible for single question */}
                    <div class="mt-5 space-y-3">
                        {question.choices.map((choice, choiceIndex) => {
                          const isUserChoice = choiceIndex === question.userAnswer.selectedIndex;
                          
                          const bgColor = isUserChoice 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100/80' 
                            : 'bg-gradient-to-r from-gray-50 to-gray-100/50';
                          const borderColor = isUserChoice 
                            ? 'border-blue-500 border-2 shadow-md' 
                            : 'border-gray-200';
                          const textColor = isUserChoice ? 'text-gray-900' : 'text-gray-700';
                          const letterBg = isUserChoice 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-500';
                          const letterText = 'text-white';
                          
                          return (
                            <div
                              class={`relative p-4 rounded-xl border ${bgColor} ${borderColor} shadow-md cursor-default`}
                            >
                            <div class="flex items-center gap-4">
                              {/* Letter Badge */}
                              <div class={`flex-shrink-0 w-10 h-10 rounded-xl ${letterBg} ${letterText} flex items-center justify-center font-bold text-base shadow-lg`}>
                                {String.fromCharCode(65 + choiceIndex)}
                              </div>
                              
                              {/* Choice Text */}
                              <div class="flex-1 flex items-center min-h-[2.5rem]">
                                <span class={`text-base font-medium ${textColor} leading-relaxed`}>
                                  <CustomMarkdown content={choice} />
                                </span>
                              </div>
                              
                              {/* Show badge only for user's selected answer */}
                              {isUserChoice && (
                                <div class="flex items-center gap-1 flex-shrink-0">
                                  <div class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg">
                                    <span>✓ Selected</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Multiple questions: Collapsible
                  <>
                    <button
                      onClick$={() => toggleQuestion$(question.questionId)}
                      class={`w-full p-5 text-left ${quizTheme.questionCardHover}`}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} question ${index + 1}`}
                      aria-expanded={isExpanded}
                    >
                      <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-2.5 flex-1 min-w-0">
                          <div class="flex items-center gap-2.5">
                            <span class={`text-sm px-3 py-1.5 rounded-xl ${quizTheme.questionNumber} shadow-md font-bold`}>
                              Q{index + 1}
                            </span>
                            <span class="text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold shadow-md">
                              {question.subject}
                            </span>
                          </div>
                          
                          {props.displayMode !== 'preview' && (
                            <div class="flex items-center gap-2">
                              <span class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md">
                                Your Answer: <span class="font-mono font-bold text-base">{question.userAnswer.letter}</span>
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Chevron */}
                        <div class="flex-shrink-0">
                          {isExpanded ? (
                            <svg class={`h-5 w-5 ${quizTheme.questionText} opacity-70`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg class={`h-5 w-5 ${quizTheme.questionText} opacity-70`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <div class={`mt-4 text-base ${quizTheme.questionText} font-semibold text-left leading-relaxed`}>
                        <CustomMarkdown content={question.question} />
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div class="px-5 pb-5 pt-4 bg-gradient-to-b from-gray-50/60 to-white/80 border-t border-gray-200/60">
                        <div class="space-y-3">
                          {/* Choices */}
                          {question.choices.map((choice, choiceIndex) => {
                            const isUserChoice = choiceIndex === question.userAnswer.selectedIndex;
                            
                            const bgColor = isUserChoice 
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100/80' 
                              : 'bg-white';
                            const borderColor = isUserChoice 
                              ? 'border-blue-500 border-2 shadow-md' 
                              : 'border-gray-200';
                            const textColor = isUserChoice ? 'text-gray-900' : 'text-gray-700';
                            const letterBg = isUserChoice 
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                              : 'bg-gradient-to-br from-gray-400 to-gray-500';
                            const letterText = 'text-white';
                            
                            return (
                              <div
                                class={`relative p-4 rounded-xl border ${bgColor} ${borderColor} shadow-md`}
                              >
                                <div class="flex items-center gap-4">
                                  {/* Letter Badge */}
                                  <div class={`flex-shrink-0 w-10 h-10 rounded-xl ${letterBg} ${letterText} flex items-center justify-center font-bold text-base shadow-lg`}>
                                    {String.fromCharCode(65 + choiceIndex)}
                                  </div>
                                  
                                  {/* Choice Text */}
                                  <div class="flex-1 flex items-center min-h-[2.5rem]">
                                    <span class={`text-base font-medium ${textColor} leading-relaxed`}>
                                      <CustomMarkdown content={choice} />
                                    </span>
                                  </div>
                                  
                                  {/* Show badge only for user's selected answer */}
                                  {isUserChoice && (
                                    <div class="flex items-center gap-1 flex-shrink-0">
                                      <div class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg">
                                        <span>✓ Selected</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {props.displayMode === 'preview' && (
        <div class={`p-6 border-t border-gray-200/60 bg-gradient-to-br from-gray-50 to-white ${quizTheme.quizBg}`}>
          <div class="text-center">
            <p class="text-gray-700 text-sm mb-4 font-medium">
              Ready to submit your quiz for AI grading with contextual feedback?
            </p>
            <div class="flex justify-center gap-3">
              <button class="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold shadow-md">
                Edit Answers
              </button>
              <button class="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-semibold shadow-md">
                Submit for Grading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

