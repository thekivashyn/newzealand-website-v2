import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { marked } from 'marked';
import katex from 'katex';
import { preprocessMathDelimiters } from '~/utils/markdownRenderer';

const sanitizeRawHtml = (html: string) =>
  html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

marked.use({
  renderer: {
    html(html: string) {
      return sanitizeRawHtml(html);
    },
  },
});

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

  // Process markdown and render KaTeX
  useVisibleTask$(async ({ track }) => {
    track(() => props.content);
    
    if (!props.content) {
      htmlContent.value = '';
      return;
    }

    // Step 1: Preprocess LaTeX delimiters (\[...\] and \(...\) to $$...$$ and $...$)
    // This matches frontend's useMarkdownRenderer hook
    let processedContent = preprocessMathDelimiters(props.content);

    // Step 1.5: Decode HTML entities and handle HTML tags (after math preprocessing)
    // This ensures math expressions are preserved while cleaning up HTML artifacts
    // Order matters: decode <br> first, then other entities
    processedContent = processedContent
      .replace(/<\s*br\s*\/?\s*>/gi, '\n') // Handle plain HTML <br>, <br/>, < br >
      .replace(/&lt;\s*br\s*\/?\s*&gt;/gi, '\n') // Decode <br>, <br/>, < br >, < br/ > from HTML entities
      .replace(/&nbsp;/g, ' ')              // Non-breaking spaces
      .replace(/&amp;/g, '&');               // Ampersands (must be after <br> to avoid conflicts)

    // Step 2: Configure marked for markdown parsing (matches frontend config)
    marked.setOptions({
      breaks: true, // Convert \n to <br>
      gfm: true,    // GitHub Flavored Markdown
    });

    // Step 3: Parse markdown to HTML
    let html = '';
    try {
      html = await marked.parse(processedContent) as string;
    } catch (error) {
      console.warn('Markdown parse error:', error);
      html = processedContent; // Fallback to raw content
    }

    // Preserve code blocks and inline code to prevent math processing within code snippets
    const codePlaceholders: string[] = [];
    const CODE_PLACEHOLDER_PREFIX = `__CODE_BLOCK_${Date.now()}_${Math.random().toString(36).slice(2)}_`;

    html = html
      .replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
        const placeholder = `${CODE_PLACEHOLDER_PREFIX}${codePlaceholders.length}__`;
        codePlaceholders.push(match);
        return placeholder;
      })
      .replace(/<code[\s\S]*?<\/code>/gi, (match) => {
        const placeholder = `${CODE_PLACEHOLDER_PREFIX}${codePlaceholders.length}__`;
        codePlaceholders.push(match);
        return placeholder;
      });

    // Step 4: Render KaTeX math expressions AFTER markdown parsing
    // Strategy: Replace display math first, then inline math to avoid conflicts
    
    // Display math: $$...$$ (must be done before inline math)
    const displayMathPlaceholders: string[] = [];
    // Use a unique placeholder that won't conflict with content
    const placeholderPrefix = `__KATEX_DISPLAY_${Date.now()}_${Math.random().toString(36).substring(7)}_`;
    
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
      try {
        const normalizedMath = mathContent
          .replace(/<\s*br\s*\/?\s*>/gi, '\n')
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
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
    html = html.replace(/\$([^$\n]+?)\$/g, (match, mathContent) => {
      // Skip if it's part of a placeholder
      if (match.includes(placeholderPrefix)) {
        return match;
      }
      
      try {
        const normalizedMath = mathContent
          .replace(/<\s*br\s*\/?\s*>/gi, '\n')
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
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
    displayMathPlaceholders.forEach((rendered, index) => {
      const placeholder = `${placeholderPrefix}${index}__`;
      const blockPattern = new RegExp(`<p>\\s*${placeholder}\\s*<\/p>`, 'g');
      if (blockPattern.test(html)) {
        html = html.replace(blockPattern, rendered);
      }
      html = html.replace(placeholder, rendered);
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
        contain: 'layout style paint'
      }}
    />
  );
});
