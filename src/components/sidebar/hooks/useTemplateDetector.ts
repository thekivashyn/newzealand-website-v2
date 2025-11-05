export type TemplateType = 'image_question' | 'multiple_choice' | 'answer_submission' | null;

export interface TemplateData {
  type: TemplateType;
  summary: string | null;
  rawData: any;
}

const TEMPLATE_MARKERS = {
  IMAGE_QUESTION: '<-Image Question Template->',
  MULTIPLE_CHOICE: '<-Multiple Choice Template->',
  ANSWER: '<-Answer Template->',
} as const;

/**
 * Function to detect and parse template data from chat titles
 * Supports: Image Questions, Multiple Choice, Answer Submissions
 */
export const useTemplateDetector = (title: string): TemplateData => {
  // Check for Image Question Template
  if (title.includes(TEMPLATE_MARKERS.IMAGE_QUESTION)) {
    const cleanedTitle = title.replace(TEMPLATE_MARKERS.IMAGE_QUESTION, '').trim();
    
    try {
      const parsed = JSON.parse(cleanedTitle) as {
        type?: string;
        questionData?: {
          context?: string;
          parts?: Array<{ part?: string; question?: string }>;
        };
      };

      const context = parsed?.questionData?.context?.trim() || '';
      const parts = Array.isArray(parsed?.questionData?.parts) ? parsed.questionData.parts : [];
      const firstQuestion = parts.find(
        (part) => part && typeof part.question === 'string' && part.question.trim().length > 0
      )?.question?.trim();

      const summary = (context || firstQuestion || null)?.replace(/\s+/g, ' ') || null;

      return {
        type: 'image_question',
        summary,
        rawData: parsed,
      };
    } catch {
      return {
        type: 'image_question',
        summary: cleanedTitle.startsWith('{') ? null : cleanedTitle,
        rawData: null,
      };
    }
  }

  // Check for Multiple Choice Template
  if (title.includes(TEMPLATE_MARKERS.MULTIPLE_CHOICE)) {
    const cleanedTitle = title.replace(TEMPLATE_MARKERS.MULTIPLE_CHOICE, '').trim();
    
    try {
      const parsed = JSON.parse(cleanedTitle) as {
        type?: string;
        questionData?: {
          question?: string;
          options?: string[];
          selectedAnswer?: string;
        };
      };

      const question = parsed?.questionData?.question?.trim() || null;
      const summary = question?.replace(/\s+/g, ' ') || null;

      return {
        type: 'multiple_choice',
        summary,
        rawData: parsed,
      };
    } catch {
      return {
        type: 'multiple_choice',
        summary: cleanedTitle.startsWith('{') ? null : cleanedTitle,
        rawData: null,
      };
    }
  }

  // Check for Answer Template
  if (title.includes(TEMPLATE_MARKERS.ANSWER)) {
    const cleanedTitle = title.replace(TEMPLATE_MARKERS.ANSWER, '').trim();
    
    try {
      const parsed = JSON.parse(cleanedTitle) as {
        type?: string;
        quizData?: {
          totalQuestions?: number;
          answeredQuestions?: number;
        };
      };

      const total = parsed?.quizData?.totalQuestions || 0;
      const answered = parsed?.quizData?.answeredQuestions || 0;
      const summary = `Quiz: ${answered}/${total} questions`;

      return {
        type: 'answer_submission',
        summary,
        rawData: parsed,
      };
    } catch {
      return {
        type: 'answer_submission',
        summary: 'Quiz Submission',
        rawData: null,
      };
    }
  }

  // No template detected
  return {
    type: null,
    summary: null,
    rawData: null,
  };
};

