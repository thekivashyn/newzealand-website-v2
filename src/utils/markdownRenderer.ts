/**
 * Markdown renderer utilities for Qwik
 * Preprocesses LaTeX delimiters and prepares content for KaTeX rendering
 */

/**
 * Preprocess LaTeX delimiters:
 * - Convert \[...\] to $$...$$ (display math)
 * - Convert \(...\) to $...$ (inline math)
 */
export function preprocessMathDelimiters(content: string): string {
  if (!content) return '';
  
  let processed = content;
  
  // Step 1: Convert display math \[...\] to $$...$$
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_match, mathContent) => {
    const trimmedContent = mathContent.trim();
    return `\n$$\n${trimmedContent}\n$$\n`;
  });
  
  // Step 2: Convert inline math \(...\) to $...$
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_match, mathContent) => {
    const trimmedContent = mathContent.trim();
    return `$${trimmedContent}$`;
  });
  
  return processed;
}

