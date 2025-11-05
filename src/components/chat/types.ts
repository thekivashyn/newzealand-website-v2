// Shared types for EmptyChat steps
export type StepType = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ModeType = 'study' | 'general' | 'study-guide';
export type AgentKey = 'mathematics' | 'english' | 'science' | 'socialstudies' | 'spanish' | 'informationtechnology';

export interface StepComponentProps {
  onBack?: () => void;
  onNext?: () => void;
  onSendMessage?: (content: string, options?: { mode?: string }) => void;
}

export interface ModeSelectionProps {
  onModeSelect: (mode: ModeType) => void;
}

export interface SubjectSelectionProps extends StepComponentProps {
  onAgentSelect: (agentKey: AgentKey) => void;
}

export interface TopicSelectionProps extends StepComponentProps {
  selectedTerm: string;
  selectedAgent: AgentKey;
  onTopicSelect: (topicKey: string) => void;
}

export interface SubCategorySelectionProps extends StepComponentProps {
  selectedTerm: string;
  selectedAgent: AgentKey;
  selectedTopic: string;
  onSubCategorySelect: (subCategoryKey: string) => void;
}

export interface PresetQuestionsProps extends StepComponentProps {
  selectedTerm: string;
  selectedAgent: AgentKey;
  selectedTopic: string;
  selectedSubCategory: string;
}

export interface AgentGroup {
  key: AgentKey;
  icon: any; // SVG component
  title: string;
  description: string;
  color: string;
  bgColor: string;
  tags: string[];
}

export interface ModeCard {
  key: ModeType;
  icon: any; // SVG component
  title: string;
  description: string;
  color: string;
}

export interface SubCategoryGroup {
  key: string;
  title: string;
  description: string;
  icon: any; // SVG component
  color: string;
}

export interface TopicGroup {
  key: string;
  title: string;
  description: string;
  icon: any; // SVG component
  color: string;
  subCategories?: SubCategoryGroup[];
}

export interface SubjectTopics {
  [agentKey: string]: TopicGroup[];
}

// Video segment for timestamp-based navigation
export interface VideoSegment {
  start: number; // Start time in seconds
  end: number; // End time in seconds
  description: string; // Description of what's covered in this segment
}

// Video metadata for multiple choice questions with video explanations
export interface VideoMeta {
  video_url: string; // URL to the video
  video_title: string; // Title of the video
  duration: number; // Total duration in seconds
  segments: {
    intro?: VideoSegment; // Optional intro segment
    [key: string]: VideoSegment | undefined; // Segments keyed by answer index ("0", "1", "2", "3") or special keys like "intro"
  };
}

// Sub-question for multi-part questions (a, b, c)
export interface SubQuestion {
  part: string; // e.g., 'a', 'b', 'c'
  question: string; // The question text for this part
}

export interface PresetMessageItem {
  type: 'single_ask' | 'multiple_choice' | 'image_question';
  value?: string; // For single_ask - the question text
  question_context?: string; // Context/setup for the question (shown to user)
  questions?: SubQuestion[]; // For multi-part questions (a, b, c)
  preset_answers?: string[]; // Available answers for multiple choice
  img_question?: string; // Image URL for image-based questions (will be generated later)
  diagram_description?: string; // Technical description for AI to generate the diagram (not shown to user)
  correct_answer?: string; // Optional: for validation (not shown to user)
  response_ai_preset?: Record<string, string> | null; // Optional: Personalized feedback per answer choice (keys: "0", "1", "2", "3"). If null, submit to AI for dynamic response.
  video_meta?: VideoMeta | null; // Optional: Video explanation with timestamp segments per answer
}

// Preset messages can be objects or strings (for backward compatibility during migration)
export type PresetMessageValue = PresetMessageItem | string;

export interface PresetMessages {
  [agentKey: string]: {
    [topicKey: string]: {
      [subCategoryKey: string]: PresetMessageValue[];
    };
  };
}

