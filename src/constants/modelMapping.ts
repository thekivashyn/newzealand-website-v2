/**
 * Model ID to Display Name Mapping
 * This ensures consistent model naming across the application
 */

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
}

export const MODEL_MAPPING: Record<string, ModelInfo> = {
  'gpt-5': {
    id: 'gpt-5',
    name: 'Genius',
    description: 'Maximum intelligence with breakthrough reasoning and complex problem-solving abilities.',
  },
  'gpt-5-mini': {
    id: 'gpt-5-mini',
    name: 'Expert',
    description: 'High-level intelligence with advanced reasoning, perfectly balanced for most tasks.',
  },
  'gpt-4.1': {
    id: 'gpt-4.1',
    name: 'Balanced',
    description: 'Reliable intelligence optimized for everyday conversations and general knowledge.',
  },
  'gpt-4.1-mini': {
    id: 'gpt-4.1-mini',
    name: 'Swift',
    description: 'Fast and responsive intelligence, ideal for quick interactions and simple queries.',
  },
};

/**
 * Get display name for a model ID
 * @param modelId - The model ID (e.g., 'gpt-5', 'gpt-4.1')
 * @returns The display name (e.g., 'Genius', 'Balanced') or the original ID if not found
 */
export const getModelDisplayName = (modelId: string): string => {
  return MODEL_MAPPING[modelId]?.name || modelId;
};

/**
 * Get full model info
 * @param modelId - The model ID
 * @returns ModelInfo object or undefined if not found
 */
export const getModelInfo = (modelId: string): ModelInfo | undefined => {
  return MODEL_MAPPING[modelId];
};

/**
 * Get all available models as array
 * @returns Array of ModelInfo objects
 */
export const getAllModels = (): ModelInfo[] => {
  return Object.values(MODEL_MAPPING);
};

