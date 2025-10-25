// Smart Context Injection - Detects Keywords and Returns Relevant Case Studies

import {
  OVA_DEEP_DIVE,
  GREEX_DEEP_DIVE,
  IOC_DEEP_DIVE,
  DEALDOC_DEEP_DIVE,
  ENA_DEEP_DIVE,
  DOODLEBLUE_LEADERSHIP,
  DESIGN_PROCESS_DETAILS,
  CAREER_HISTORY
} from './case-studies';
import type { ChatMessage } from '../ai-chat';

interface KeywordTriggers {
  [key: string]: string[];
}

const KEYWORD_TRIGGERS: KeywordTriggers = {
  ova: ['ova', 'period', 'cryptiq', 'hannah', 'period tracking'],
  greex: ['greex', 'defi', 'crypto', 'trading', 'raj', 'binance', 'options', 'futures'],
  ioc: ['ioc', 'indian oil', 'vendor', 'vendor management', 'karthik'],
  dealdoc: ['dealdoc', 'deal management', 'investor', 'sunny', 'arash', 'deal pipeline'],
  ena: ['ena', 'nurse', 'healthcare', 'nurse practitioner', 'medical'],
  doodleblue: ['doodleblue', 'lead', 'team', 'management', 'nishitha', 'coe', 'leadership'],
  process: ['process', 'approach', 'methodology', 'how do you', 'design process', 'workflow', 'framework'],
  career: ['career', 'experience', 'past roles', 'bewakoof', 'background', 'work history', 'previous']
};

const CASE_STUDY_MAP: { [key: string]: string } = {
  ova: OVA_DEEP_DIVE,
  greex: GREEX_DEEP_DIVE,
  ioc: IOC_DEEP_DIVE,
  dealdoc: DEALDOC_DEEP_DIVE,
  ena: ENA_DEEP_DIVE,
  doodleblue: DOODLEBLUE_LEADERSHIP,
  process: DESIGN_PROCESS_DETAILS,
  career: CAREER_HISTORY
};

/**
 * Detects keywords in user message and recent conversation
 * Returns relevant case study contexts to inject
 */
export function getRelevantContext(
  userMessage: string,
  conversationHistory: ChatMessage[]
): string {
  const lowerMessage = userMessage.toLowerCase();
  const injectedContexts: string[] = [];
  const triggeredKeys = new Set<string>();

  // Check current message for keywords
  for (const [key, keywords] of Object.entries(KEYWORD_TRIGGERS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
      triggeredKeys.add(key);
    }
  }

  // Also check last 2 messages in history for context continuity
  const recentMessages = conversationHistory.slice(-2);
  for (const msg of recentMessages) {
    if (!msg.content) continue;
    const lowerContent = msg.content.toLowerCase();
    
    for (const [key, keywords] of Object.entries(KEYWORD_TRIGGERS)) {
      if (keywords.some(keyword => lowerContent.includes(keyword.toLowerCase()))) {
        triggeredKeys.add(key);
      }
    }
  }

  // Add corresponding case studies
  for (const key of triggeredKeys) {
    if (CASE_STUDY_MAP[key]) {
      injectedContexts.push(CASE_STUDY_MAP[key]);
    }
  }

  // Return combined contexts or empty string
  return injectedContexts.length > 0 
    ? '\n\n' + injectedContexts.join('\n\n') 
    : '';
}

/**
 * Determines if question seems interview-style (needs detailed answer)
 */
export function isInterviewQuestion(userMessage: string): boolean {
  const lowerMessage = userMessage.toLowerCase();
  
  const interviewIndicators = [
    'tell me about',
    'walk me through',
    'explain your',
    'how did you',
    'what was your role',
    'describe your',
    'what challenges',
    'how do you approach',
    'what is your process',
    'can you share',
    'what did you learn'
  ];

  return interviewIndicators.some(indicator => lowerMessage.includes(indicator));
}

