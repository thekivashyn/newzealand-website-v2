import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { chatActions } from '~/store/chat';
import { chatFlowController } from '~/services/chatFlowController';
import { useChatHistory } from '~/composables/useChatHistory';
import { useTemplateDetector } from './hooks/useTemplateDetector';
import { TemplateBadge } from './TemplateBadge';
import type { ChatHistory } from '~/store/types';

interface ChatItemProps {
  chat: ChatHistory;
  isActive: boolean;
}

export const ChatItem = component$<ChatItemProps>((props) => {
  const navigate = useNavigate();
  const { deleteChat } = useChatHistory();
  const isDeleting = useSignal(false);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Just now';
    }
  };
  
  // Get subject icon SVG
  const getSubjectIcon = (subject: string | null) => {
    if (!subject) return null;
    
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower.includes('mathematics')) {
      return (
        <svg class="w-2 h-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    if (subjectLower.includes('english')) {
      return (
        <svg class="w-2 h-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    if (subjectLower.includes('science')) {
      return (
        <svg class="w-2 h-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    }
    
    return (
      <svg class="w-2 h-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  };
  
  // Get subject color
  const getSubjectColor = (subject: string | null) => {
    if (!subject) return 'bg-gray-600 text-gray-200';
    
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower.includes('mathematics')) return 'bg-yellow-600 text-yellow-100';
    if (subjectLower.includes('english')) return 'bg-blue-600 text-blue-100';
    if (subjectLower.includes('science')) return 'bg-green-600 text-green-100';
    if (subjectLower.includes('social')) return 'bg-purple-600 text-purple-100';
    if (subjectLower.includes('spanish')) return 'bg-red-600 text-red-100';
    if (subjectLower.includes('information') || subjectLower.includes('technology')) return 'bg-cyan-600 text-cyan-100';
    
    return 'bg-slate-600 text-slate-100';
  };
  
  const handleClick$ = $(() => {
    if (isDeleting.value) return;
    
    // Clear chatMethod to allow loading when route syncs
    // Route will handle chatId sync and loading
    chatFlowController.handleChatSwitch(props.chat.id);
    
    // Navigate to chat (route will sync chatId and trigger load)
    navigate(`/?id=${props.chat.id}`);
  });
  
  const handleDelete$ = $(async (e: Event) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      isDeleting.value = true;
      
      // Navigate away if this was the active chat
      if (props.isActive) {
        chatActions.clearMessages();
        chatActions.setCurrentChatId(null);
        navigate('/');
      }
      
      try {
        await deleteChat(props.chat.id);
      } catch (error) {
        console.error('Failed to delete chat:', error);
        isDeleting.value = false;
      }
    }
  });
  
  // Detect template type from title
  const templateData = useTemplateDetector(props.chat.title);
  
  return (
    <div
      onClick$={handleClick$}
      class={`
        relative flex items-center px-3 py-2 mx-2 rounded-xl cursor-pointer
        transition-all duration-300 group
        ${isDeleting.value ? 'opacity-50 pointer-events-none' : ''}
        ${
          props.isActive
            ? 'bg-[#1B7A7A] text-white border border-[#1B7A7A]/80 shadow-md'
            : 'text-gray-300 hover:bg-stone-800 hover:text-white border border-transparent hover:border-stone-500 hover:shadow-sm'
        }
      `}
      role="button"
      tabIndex={isDeleting.value ? -1 : 0}
      aria-label={`Chat: ${props.chat.title}${props.chat.subject ? ` - ${props.chat.subject}` : ''}`}
    >
      {/* Left border indicator */}
      <div class={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-all duration-300 ${
        props.isActive ? 'bg-[#14B8A6]' : 'bg-transparent group-hover:bg-stone-500'
      }`}></div>
      
      {/* Content */}
      <div class="flex-1 min-w-0 relative z-10 transition-all duration-300">
        {/* Title row */}
        <div class="flex items-baseline gap-2 mb-0.5">
          <h3 class={`font-semibold text-xs sm:text-sm flex-1 min-w-0 flex items-center gap-1 ${
            props.isActive
              ? 'text-white'
              : 'text-gray-200 group-hover:text-stone-100'
          } transition-all duration-300`}>
            {templateData.type ? (
              <TemplateBadge 
                type={templateData.type} 
                isActive={props.isActive}
                summary={templateData.summary || 'Tap to review'}
              />
            ) : (
              <span class="truncate flex-1 min-w-0">{props.chat.title}</span>
            )}
          </h3>
          
          {/* Message count */}
          <div class={`
            flex-shrink-0 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold
            ${props.isActive
              ? 'bg-[#14B8A6] text-white'
              : 'bg-gray-700 text-gray-400 group-hover:bg-stone-600 group-hover:text-stone-200'
            }
          `}>
            {props.chat.messageCount || 0}
          </div>
        </div>
        
        {/* Meta row: Subject badge + Timestamp */}
        <div class="flex items-center gap-1.5">
          {/* Subject badge */}
          {props.chat.subject && (
            <div class={`
              inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold leading-none
              ${getSubjectColor(props.chat.subject)}
              ${props.isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-95'}
              transition-all duration-300
            `}>
              {getSubjectIcon(props.chat.subject)}
              <span class="truncate max-w-[45px] sm:max-w-[55px]">{props.chat.subject}</span>
            </div>
          )}
          
          {/* Separator dot */}
          {props.chat.subject && props.chat.topic && (
            <span class={`text-[9px] sm:text-[10px] ${props.isActive ? 'text-gray-300' : 'text-gray-600'}`}>•</span>
          )}
          
          {/* Topic text */}
          {props.chat.topic && (
            <span class={`text-[9px] sm:text-[10px] truncate max-w-[60px] sm:max-w-[70px] font-medium ${
              props.isActive ? 'text-gray-200' : 'text-gray-500 group-hover:text-stone-400'
            }`}>
              {props.chat.topic}
            </span>
          )}
          
          {/* Separator dot */}
          <span class={`text-[9px] sm:text-[10px] ${props.isActive ? 'text-gray-300' : 'text-gray-600'}`}>•</span>
          
          {/* Timestamp */}
          <span class={`text-[9px] sm:text-[10px] font-medium flex-shrink-0 ${
            props.isActive ? 'text-gray-200' : 'text-gray-500 group-hover:text-stone-400'
          }`}>
            {formatTimestamp(props.chat.timestamp)}
          </span>
        </div>
      </div>
      
      {/* Action buttons - fade in on hover */}
      <div class={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto z-30 ${
        props.isActive
          ? 'bg-[#1B7A7A]/95 backdrop-blur-sm'
          : 'bg-stone-900/95 backdrop-blur-sm'
      } rounded-lg p-1 shadow-lg`}>
        <button
          onClick$={handleDelete$}
          class={`
            p-1.5 rounded-md transition-all duration-200 cursor-pointer
            ${props.isActive
              ? 'text-white hover:text-red-300 hover:bg-red-500/20'
              : 'text-gray-300 hover:text-red-400 hover:bg-red-500/20'
            }
          `}
          disabled={isDeleting.value}
          title="Delete chat"
          aria-label={`Delete chat: ${props.chat.title}`}
        >
          {isDeleting.value ? (
            <svg
              class="animate-spin h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
});

