/**
 * Markdown renderer utilities for Qwik
 * Preprocesses LaTeX delimiters and prepares content for KaTeX rendering
 */

// Cache regex patterns for better performance
const DISPLAY_MATH_DELIMITER_REGEX = /\\\[([\s\S]*?)\\\]/g;
const INLINE_MATH_DELIMITER_REGEX = /\\\(([\s\S]*?)\\\)/g;

/**
 * Preprocess LaTeX delimiters:
 * - Convert \[...\] to $$...$$ (display math)
 * - Convert \(...\) to $...$ (inline math)
 */
export function preprocessMathDelimiters(content: string): string {
  if (!content) return '';
  
  let processed = content;
  
  // Step 1: Convert display math \[...\] to $$...$$
  DISPLAY_MATH_DELIMITER_REGEX.lastIndex = 0;
  processed = processed.replace(DISPLAY_MATH_DELIMITER_REGEX, (_match, mathContent) => {
    const trimmedContent = mathContent.trim();
    return `\n$$\n${trimmedContent}\n$$\n`;
  });
  
  // Step 2: Convert inline math \(...\) to $...$
  INLINE_MATH_DELIMITER_REGEX.lastIndex = 0;
  processed = processed.replace(INLINE_MATH_DELIMITER_REGEX, (_match, mathContent) => {
    const trimmedContent = mathContent.trim();
    return `$${trimmedContent}$`;
  });
  
  return processed;
}

