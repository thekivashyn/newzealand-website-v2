import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { marked } from 'marked';
import katex from 'katex';
import { preprocessMathDelimiters } from '~/utils/markdownRenderer';

// Configure marked globally
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Cache regex patterns for better performance
const BR_TAG_REGEX = /<\s*br\s*\/?\s*>/gi;
const BR_ENTITY_REGEX = /&lt;\s*br\s*\/?\s*&gt;/gi;
const NBSP_REGEX = /&nbsp;/g;
const AMP_REGEX = /&amp;/g;
const LT_REGEX = /&lt;/g;
const GT_REGEX = /&gt;/g;
const DISPLAY_MATH_REGEX = /\$\$([\s\S]*?)\$\$/g;
const INLINE_MATH_REGEX = /\$([^$\n]+?)\$/g;
const PRE_TAG_REGEX = /<pre[\s\S]*?<\/pre>/gi;
const CODE_TAG_REGEX = /<code[\s\S]*?<\/code>/gi;

interface CustomMarkdownProps {
  content: string;
}

/**
 * CustomMarkdown component with KaTeX support for mathematics
 * Optimized for Qwik framework - matches frontend implementation
 * 
 * Flow:
 * 1. Preprocess LaTeX delimiters (\[...\] and \(...\) to $$...$$ and $...$)
 * 2. Parse markdown to HTML using marked
 * 3. Render KaTeX math expressions (display math first, then inline math)
 */
export const CustomMarkdown = component$<CustomMarkdownProps>((props) => {
  const htmlContent = useSignal('');
  const lastProcessedContent = useSignal('');

  // Process markdown and render KaTeX
  useVisibleTask$(async ({ track }) => {
    track(() => props.content);
    
    if (!props.content) {
      htmlContent.value = '';
      lastProcessedContent.value = '';
      return;
    }

    // Skip re-processing if content hasn't changed (optimization for stable blocks)
    if (props.content === lastProcessedContent.value && htmlContent.value) {
      return;
    }

    lastProcessedContent.value = props.content;

    // Step 1: Preprocess LaTeX delimiters (\[...\] and \(...\) to $$...$$ and $...$)
    // This matches frontend's useMarkdownRenderer hook
    let processedContent = preprocessMathDelimiters(props.content);

    // Step 1.5: Decode HTML entities and handle HTML tags (after math preprocessing)
    // This ensures math expressions are preserved while cleaning up HTML artifacts
    // Order matters: decode <br> first, then other entities
    // Use cached regex patterns for better performance
    BR_TAG_REGEX.lastIndex = 0;
    BR_ENTITY_REGEX.lastIndex = 0;
    processedContent = processedContent
      .replace(BR_TAG_REGEX, '\n') // Handle plain HTML <br>, <br/>, < br >
      .replace(BR_ENTITY_REGEX, '\n') // Decode <br>, <br/>, < br >, < br/ > from HTML entities
      .replace(NBSP_REGEX, ' ')              // Non-breaking spaces
      .replace(AMP_REGEX, '&');               // Ampersands (must be after <br> to avoid conflicts)

    // Step 2: Parse markdown to HTML
    let html = '';
    try {
      html = await marked.parse(processedContent) as string;
    } catch (error) {
      console.warn('Markdown parse error:', error);
      html = processedContent; // Fallback to raw content
    }

    // Preserve code blocks and inline code to prevent math processing within code snippets
    const codePlaceholders: string[] = [];
    // Use timestamp-based prefix only, no need for random (timestamp is unique enough per render)
    const CODE_PLACEHOLDER_PREFIX = `__CODE_BLOCK_${Date.now()}_`;

    PRE_TAG_REGEX.lastIndex = 0;
    CODE_TAG_REGEX.lastIndex = 0;
    html = html
      .replace(PRE_TAG_REGEX, (match) => {
        const placeholder = `${CODE_PLACEHOLDER_PREFIX}${codePlaceholders.length}__`;
        codePlaceholders.push(match);
        return placeholder;
      })
      .replace(CODE_TAG_REGEX, (match) => {
        const placeholder = `${CODE_PLACEHOLDER_PREFIX}${codePlaceholders.length}__`;
        codePlaceholders.push(match);
        return placeholder;
      });

    // Step 4: Render KaTeX math expressions AFTER markdown parsing
    // Strategy: Replace display math first, then inline math to avoid conflicts
    
    // Display math: $$...$$ (must be done before inline math)
    const displayMathPlaceholders: string[] = [];
    // Use a unique placeholder that won't conflict with content
    // Optimized: Use timestamp only (unique enough per render cycle)
    const placeholderPrefix = `__KATEX_DISPLAY_${Date.now()}_`;
    
    DISPLAY_MATH_REGEX.lastIndex = 0;
    html = html.replace(DISPLAY_MATH_REGEX, (match, mathContent) => {
      try {
        // Use cached regex patterns for normalization
        BR_TAG_REGEX.lastIndex = 0;
        LT_REGEX.lastIndex = 0;
        GT_REGEX.lastIndex = 0;
        const normalizedMath = mathContent
          .replace(BR_TAG_REGEX, '\n')
          .replace(NBSP_REGEX, ' ')
          .replace(LT_REGEX, '<')
          .replace(GT_REGEX, '>')
          .replace(AMP_REGEX, '&')
          .trim();

        const rendered = katex.renderToString(normalizedMath, {
          throwOnError: false,
          errorColor: '#ff6b6b',
          strict: 'ignore',
          trust: true,
          output: 'htmlAndMathml',
          displayMode: true,
        });
        const placeholder = `${placeholderPrefix}${displayMathPlaceholders.length}__`;
        displayMathPlaceholders.push(rendered);
        return placeholder;
      } catch (error) {
        console.warn('KaTeX display render error:', error);
        return match; // Return original if rendering fails
      }
    });

    // Inline math: $...$ (now safe to match since $$...$$ are placeholders)
    INLINE_MATH_REGEX.lastIndex = 0;
    html = html.replace(INLINE_MATH_REGEX, (match, mathContent) => {
      // Skip if it's part of a placeholder
      if (match.includes(placeholderPrefix)) {
        return match;
      }
      
      try {
        // Use cached regex patterns for normalization
        BR_TAG_REGEX.lastIndex = 0;
        LT_REGEX.lastIndex = 0;
        GT_REGEX.lastIndex = 0;
        const normalizedMath = mathContent
          .replace(BR_TAG_REGEX, '\n')
          .replace(NBSP_REGEX, ' ')
          .replace(LT_REGEX, '<')
          .replace(GT_REGEX, '>')
          .replace(AMP_REGEX, '&')
          .trim();

        return katex.renderToString(normalizedMath, {
          throwOnError: false,
          errorColor: '#ff6b6b',
          strict: 'ignore',
          trust: true,
          output: 'htmlAndMathml',
        });
      } catch (error) {
        console.warn('KaTeX inline render error:', error);
        return match; // Return original if rendering fails
      }
    });

    // Restore display math placeholders
    // Optimized: Use string replace instead of regex for better performance
    displayMathPlaceholders.forEach((rendered, index) => {
      const placeholder = `${placeholderPrefix}${index}__`;
      const wrappedPlaceholder = `<p>${placeholder}</p>`;
      if (html.includes(wrappedPlaceholder)) {
        html = html.replace(wrappedPlaceholder, rendered);
      } else {
        // Also check for whitespace variations
        const spacedVariations = [
          `<p> ${placeholder} </p>`,
          `<p>\n${placeholder}\n</p>`,
          `<p>\n${placeholder}</p>`,
          `<p>${placeholder}\n</p>`
        ];
        for (const variant of spacedVariations) {
          if (html.includes(variant)) {
            html = html.replace(variant, rendered);
            return;
          }
        }
        // Fallback: direct replace
        html = html.replace(placeholder, rendered);
      }
    });

    // Restore code placeholders
    codePlaceholders.forEach((original, index) => {
      html = html.replace(`${CODE_PLACEHOLDER_PREFIX}${index}__`, original);
    });

    htmlContent.value = html;
  });

  return (
    <div 
      class="markdown-content w-full max-w-none text-black"
      dangerouslySetInnerHTML={htmlContent.value}
      style={{
        contentVisibility: 'auto',
        contain: 'layout style paint',
        willChange: 'auto',
        transition: 'none',
        animation: 'none'
      }}
    />
  );
});
