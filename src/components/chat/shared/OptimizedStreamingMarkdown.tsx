import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { CustomMarkdown } from './CustomMarkdown';

interface OptimizedStreamingMarkdownProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Simple hash function for creating stable keys
 * Optimized: Early return for empty strings, use bitwise operations efficiently
 */
const hashString = (str: string): string => {
  if (!str) return '0';
  let hash = 0;
  const len = str.length;
  for (let i = 0; i < len; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Cache regex patterns to avoid recompiling on every execution
const DISPLAY_MATH_REGEX = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;

/**
 * StableCompletedBlock - Prevents re-rendering when other blocks are appended
 * Uses CSS to prevent visual flashing even if re-render occurs
 * Qwik will automatically skip re-rendering this component if props haven't changed
 */
const StableCompletedBlock = component$<{ content: string; contentHash: string }>((props) => {
  return (
    <div 
      key={`completed-${props.contentHash}`}
      style={{ 
        contain: 'layout style paint',
        willChange: 'auto',
        transition: 'none',
        animation: 'none'
      }}
    >
      <CustomMarkdown content={props.content} />
    </div>
  );
});

/**
 * OptimizedStreamingMarkdown - Prevents KaTeX flashing during streaming
 * 
 * Problem: When AI streams text with math formulas, every character update causes
 * all KaTeX formulas to re-render, causing visual flashing.
 * 
 * Solution: Split content into "completed" blocks and "streaming" block.
 * Only the streaming part re-renders, completed blocks stay stable.
 */
export const OptimizedStreamingMarkdown = component$<OptimizedStreamingMarkdownProps>((props) => {
  const completedBlock = useSignal('');
  const completedHash = useSignal('');
  const streamingBlock = useSignal('');
  
  // Track last split result to avoid unnecessary recalculations
  const lastSplitResult = useSignal<{
    completedBlock: string;
    completedHash: string;
    streamingBlock: string;
    contentLength: number;
  } | null>(null);

  useVisibleTask$(({ track }) => {
    track(() => props.content);
    track(() => props.isStreaming);

    if (!props.isStreaming) {
      // Not streaming, render everything normally
      const hash = hashString(props.content);
      // Only update if actually changed
      if (completedHash.value !== hash) {
        completedBlock.value = props.content;
        completedHash.value = hash;
      }
      streamingBlock.value = '';
      lastSplitResult.value = null;
      return;
    }

    const content = props.content;
    const contentLength = content.length;

    // Optimization: Only re-calculate split if content grew by at least 100 chars
    // This dramatically reduces unnecessary regex operations during streaming
    if (lastSplitResult.value && 
        Math.abs(contentLength - lastSplitResult.value.contentLength) < 100) {
      // Content hasn't grown much, reuse last result but update streaming part
      const lastResult = lastSplitResult.value;
      if (lastResult.completedBlock) {
        // CRITICAL: Only update signals if values actually changed
        // This prevents Qwik from triggering re-renders unnecessarily
        if (completedBlock.value !== lastResult.completedBlock) {
          completedBlock.value = lastResult.completedBlock;
        }
        if (completedHash.value !== lastResult.completedHash) {
          completedHash.value = lastResult.completedHash;
        }
        const newStreaming = content.slice(lastResult.completedBlock.length);
        if (streamingBlock.value !== newStreaming) {
          streamingBlock.value = newStreaming;
        }
        return;
      }
    }

    let splitPoint = -1;

    // Strategy 1: Find the last complete display math block ($$...$$ or \[...\])
    // Use cached regex pattern for better performance
    DISPLAY_MATH_REGEX.lastIndex = 0; // Reset regex state
    let lastMatch;
    let match;

    while ((match = DISPLAY_MATH_REGEX.exec(content)) !== null) {
      lastMatch = match;
    }

    if (lastMatch && lastMatch.index !== undefined) {
      const potentialSplitPoint = lastMatch.index + lastMatch[0].length;
      const afterContent = content.slice(potentialSplitPoint);

      // Only split if there's substantial content after (paragraph break or 200+ chars)
      if (afterContent.includes('\n\n')) {
        const nextParagraph = afterContent.indexOf('\n\n');
        if (nextParagraph !== -1 && nextParagraph < 400) {
          splitPoint = potentialSplitPoint + nextParagraph + 2;
        }
      } else if (afterContent.length > 200) {
        splitPoint = potentialSplitPoint;
      }
    }

    // Strategy 2: If no math found, split at paragraph boundaries
    if (splitPoint === -1) {
      const lastDoubleLine = content.lastIndexOf('\n\n', content.length - 300);
      if (lastDoubleLine > content.length * 0.3) { // At least 30% of content
        splitPoint = lastDoubleLine + 2;
      }
    }

    // Only split if we have a valid split point
    if (splitPoint > 0) {
      const completed = content.slice(0, splitPoint);
      const hash = hashString(completed);
      
      // CRITICAL: Only update completedBlock if hash changed AND content actually changed
      // This prevents re-rendering when streaming block updates but completed block hasn't changed
      if (hash !== completedHash.value && completed !== completedBlock.value) {
        completedBlock.value = completed;
        completedHash.value = hash;
      }

      const newStreaming = content.slice(completedBlock.value.length);
      const result = {
        completedBlock: completedBlock.value,
        completedHash: completedHash.value,
        streamingBlock: newStreaming,
        contentLength: contentLength
      };

      lastSplitResult.value = result;
      
      // Only update streamingBlock if it actually changed
      if (streamingBlock.value !== newStreaming) {
        streamingBlock.value = newStreaming;
      }
    } else {
      // Default: everything is streaming
      // Only clear if not already empty to avoid unnecessary re-renders
      if (completedBlock.value !== '') {
        completedBlock.value = '';
        completedHash.value = '';
      }
      
      // Only update streamingBlock if it actually changed
      if (streamingBlock.value !== content) {
        streamingBlock.value = content;
      }
      
      lastSplitResult.value = {
        completedBlock: '',
        completedHash: '',
        streamingBlock: content,
        contentLength: contentLength
      };
    }
  });

  if (!props.isStreaming) {
    // Not streaming, render everything normally
    return <CustomMarkdown content={props.content} />;
  }

  return (
    <>
      {/* Completed block - uses stable key + CSS to prevent visual flashing */}
      {completedBlock.value && completedBlock.value.trim() && (
        <StableCompletedBlock 
          content={completedBlock.value} 
          contentHash={completedHash.value}
        />
      )}
      
      {/* Streaming block - only this part re-renders */}
      {streamingBlock.value && streamingBlock.value.trim() && (
        <div style={{ 
          willChange: 'contents',
          transition: 'none',
          animation: 'none'
        }}>
          <CustomMarkdown content={streamingBlock.value} />
        </div>
      )}
    </>
  );
});

