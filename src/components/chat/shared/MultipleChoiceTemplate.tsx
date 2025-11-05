import { component$ } from '@builder.io/qwik';

interface MultipleChoiceData {
  type: string;
  questionData: {
    question: string;
    options: string[];
    selectedAnswer: string;
    correctAnswer?: string | null;
    timestamp?: string;
  };
}

interface MultipleChoiceTemplateProps {
  data: MultipleChoiceData;
}

export const MultipleChoiceTemplate = component$<MultipleChoiceTemplateProps>((props) => {
  const { questionData } = props.data;
  const { question, options, selectedAnswer, correctAnswer } = questionData;
  
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isCorrect = correctAnswer && selectedAnswer === correctAnswer;

  return (
    <div class="w-full max-w-3xl bg-amber-50 rounded-3xl overflow-hidden shadow-lg border border-amber-100 p-5">
      {/* Question Header */}
      <div class="flex items-start gap-3 mb-5">
        <h3 class="text-gray-900 font-semibold text-base sm:text-lg leading-tight flex-1">
          {question}
        </h3>
        {correctAnswer && (
          <span class={`ml-auto flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
            isCorrect 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isCorrect ? '✓' : '✗'}
          </span>
        )}
      </div>

      {/* Answer Options Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {options.map((option, index) => {
          const isSelected = option === selectedAnswer;
          const isCorrectOption = option === correctAnswer;

          return (
            <div
              key={index}
              class={`
                flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl transition-all
                ${isSelected 
                  ? isCorrect
                    ? 'bg-green-50 border-2 border-green-400 shadow-md'
                    : 'bg-red-50 border-2 border-red-400 shadow-md'
                  : isCorrectOption
                    ? 'bg-green-50 border-2 border-green-400 shadow-md'
                    : 'bg-gray-50 border-2 border-gray-200'
                }
              `}
            >
              {/* Letter Badge */}
              <div class={`
                flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-sm sm:text-base transition-all
                ${isSelected
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : isCorrectOption
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }
              `} aria-hidden="true">
                {(isSelected && isCorrect) || (!isSelected && isCorrectOption) ? (
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                ) : isSelected && !isCorrect ? (
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                ) : (
                  letters[index]
                )}
              </div>

              {/* Answer Text */}
              <span class={`
                flex-1 text-xs sm:text-sm font-medium leading-snug
                ${isSelected || isCorrectOption
                  ? 'text-gray-900'
                  : 'text-gray-700'
                }
              `}>
                {option}
              </span>

              {/* Status Badge */}
              {isSelected && !isCorrectOption && (
                <span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                  You
                </span>
              )}
              {isSelected && isCorrectOption && (
                <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                  You
                </span>
              )}
              {!isSelected && isCorrectOption && (
                <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                  Correct
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Feedback */}
      {correctAnswer && (
        <div class={`mt-5 p-3 rounded-2xl ${
          isCorrect
            ? 'bg-green-100 border border-green-300'
            : 'bg-red-100 border border-red-300'
        }`}>
          <p class={`text-xs font-medium ${
            isCorrect ? 'text-green-800' : 'text-red-800'
          }`}>
            {isCorrect
              ? '✓ Excellent! Your answer is correct.'
              : '✗ Not quite right. AI will help you understand the correct answer.'
            }
          </p>
        </div>
      )}
    </div>
  );
});

