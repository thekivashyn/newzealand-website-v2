import { useSignal, $ } from '@builder.io/qwik';
import type { PresetMessageItem, SubQuestion } from '../../types';
import { chatActions, chatStore } from '~/store/chat';
import { storeMessageOnlyClient } from '~/services/chat.service';
import type { ChatMessage } from '~/store/types';

interface UseQuestionHandlerProps {
  onSendMessage?: (message: string) => void;
  chatId?: string;
  subject?: string | null;
  topic?: string | null;
}

/**
 * Helper: Ensure chatId exists and is valid UUID
 */
function ensureValidChatId(providedChatId?: string | null): string {
  let chatId = providedChatId || chatStore.currentChatId;
  
  if (!chatId || chatId.trim() === '') {
    chatId = crypto.randomUUID();
    chatActions.setCurrentChatId(chatId);
    return chatId;
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(chatId)) {
    chatId = crypto.randomUUID();
    chatActions.setCurrentChatId(chatId);
  }
  
  return chatId;
}

export const useQuestionHandler = (props: UseQuestionHandlerProps) => {
  const selectedAnswers = useSignal<Record<number, string>>({});

  const handlePresetClick$ = $(async (message: PresetMessageItem) => {
    // If it has preset_answers, don't send yet (wait for answer selection)
    if (message.preset_answers && message.preset_answers.length > 0) {
      return;
    }
    
    // Format the question text
    let questionToSend = '';
    
    if (message.questions && message.questions.length > 0 && message.type === 'image_question') {
      // Multi-part image question: Send as JSON template for beautiful rendering
      const questionData = {
        type: 'image_question_submission',
        questionData: {
          context: message.question_context || '',
          diagram_url: message.img_question || '',
          parts: message.questions.map((q: SubQuestion) => ({
            part: q.part,
            question: q.question
          }))
        }
      };
      
      // Send with template prefix (like quiz submission)
      questionToSend = '<-Image Question Template-> ' + JSON.stringify(questionData);
    } else if (message.questions && message.questions.length > 0) {
      // Multi-part question without image: Format as text
      const parts = [];
      
      if (message.question_context) {
        parts.push(message.question_context);
        parts.push('');
      }
      
      parts.push('Please help me solve these parts step by step:');
      parts.push('');
      
      message.questions.forEach((q: SubQuestion) => {
        parts.push(`${q.part}) ${q.question}`);
      });
      
      parts.push('');
      parts.push("Let's work through this together!");
      
      questionToSend = parts.join('\n');
    } else if (message.value) {
      // Single question
      questionToSend = message.value;
    }
    
    // Add message to chat store
    if (questionToSend) {
      chatActions.addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content: questionToSend,
        timestamp: new Date().toISOString(),
      });
      
      // Ensure chatId exists and is valid
      ensureValidChatId(props.chatId);
      
      // NOTE: Do NOT call store-message here
      // For single_ask and image_question types, API /chat will handle storage
      // Only multiple_choice type calls store-message (in handleAnswerSelect$)
    }
    
    props.onSendMessage?.(questionToSend);
  });
  
  const handleAnswerSelect$ = $(async (questionIndex: number, answer: string, question: PresetMessageItem) => {
    // Update selected answers
    const current = selectedAnswers.value;
    selectedAnswers.value = { ...current, [questionIndex]: answer };
    
    // Check if there's a preset response for this answer
    const answerIndex = question.preset_answers?.indexOf(answer);
    const hasPresetResponse = question.response_ai_preset && answerIndex !== undefined && answerIndex !== -1;
    const presetResponse = hasPresetResponse ? question.response_ai_preset?.[answerIndex.toString()] : null;
    
    // Format as JSON with full context for multiple choice submission
    const multipleChoiceData = {
      type: 'multiple_choice_submission',
      questionData: {
        question: question.value,
        options: question.preset_answers || [],
        selectedAnswer: answer,
        selectedAnswerIndex: answerIndex,
        correctAnswer: question.correct_answer || null,
        timestamp: new Date().toISOString()
      },
      presetResponse: presetResponse || null,
      hasPresetResponse: !!presetResponse
    };
    
    // Format message content
    const formattedMessage = '<-Multiple Choice Template-> ' + JSON.stringify(multipleChoiceData, null, 2);
    
    // Create user message with consistent ID
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: formattedMessage,
      timestamp: new Date().toISOString(),
    };
    
    // Add message to chat store
    chatActions.addMessage(userMessage);
    
    // Ensure chatId exists and is valid
    const chatId = ensureValidChatId(props.chatId);
    
    // 🚀 STEP 1: Render message immediately (don't wait for API)
    props.onSendMessage?.(formattedMessage);
    
    // 🚀 STEP 2: Store user message for multiple_choice type
    // Multiple choice ALWAYS calls store-message (preset response flow will add AI message later)
    storeMessageOnlyClient({
      messages: [userMessage],
      chatId,
      subject: props.subject || null,
      topic: props.topic || null,
      title: question.value?.substring(0, 50) || 'Multiple Choice Question',
    }).catch((error) => {
      console.error('Failed to store multiple choice message:', error);
    });
    
    // If has preset response, it will be handled by usePresetResponse composable
    // which will add AI message to store-message after fake streaming completes
  });

  return {
    selectedAnswers,
    handlePresetClick$,
    handleAnswerSelect$
  };
};

