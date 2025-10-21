"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ArrowUp, Sparkles, Paperclip, Linkedin, Trash2, Bot } from 'lucide-react';
import { ensureLightMode } from '../../lib/utils';
import { sendToAI, getFallbackResponse, type ChatMessage as AIChatMessage } from '../../lib/ai-chat';
import { AI_CONFIG } from '../../lib/config';
interface DraggableCard {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  rotation: number;
}
interface ChatMessage {
  id: string;
  type: 'text' | 'card-with-question' | 'greeting';
  content?: string;
  card?: {
    id: string;
    image: string;
    title: string;
  };
  sender: 'user' | 'system' | 'ai';
  timestamp: number;
  isTyping?: boolean;
}
interface TabItem {
  id: string;
  label: string;
}
interface CaseStudy {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  backgroundColor?: string;
  borderColor?: string;
}
export interface PortfolioHeroSectionProps {
  cards?: DraggableCard[];
}
const TAB_ITEMS: TabItem[] = [{
  id: 'my-work',
  label: 'my work'
}, {
  id: 'visuals',
  label: 'visuals'
}];
const CASE_STUDIES: CaseStudy[] = [{
  id: 'case-1',
  image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760524296/6_3x_shots_so_y310gt.png',
  title: 'Process Breakdown: Plasticity Brand & Website',
  subtitle: 'Process Breakdown',
  backgroundColor: 'bg-white',
  borderColor: 'border-black/[0.06]'
}, {
  id: 'case-2',
  image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525138/172_2x_shots_so_plr79y.png',
  title: 'Website Design and Development for Default.com',
  subtitle: 'Process Breakdown',
  backgroundColor: 'bg-white',
  borderColor: 'border-black/[0.06]'
}, {
  id: 'case-3',
  image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525270/190_2x_shots_so_gytftu.png',
  title: 'Creamier Branding Process Breakdown',
  subtitle: 'Process Breakdown',
  backgroundColor: 'bg-purple-200',
  borderColor: 'border-purple-300'
}, {
  id: 'case-4',
  image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525328/19_2x_shots_so_lio1is.png',
  title: 'Brand Strategy & Identity: Wayfinder Ventures',
  subtitle: 'Process Breakdown',
  backgroundColor: 'bg-cyan-400',
  borderColor: 'border-cyan-500'
}];
export const PortfolioHeroSection: React.FC<PortfolioHeroSectionProps> = ({
  cards: customCards
}) => {
  useEffect(() => {
    ensureLightMode();
  }, []);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'greeting',
    type: 'greeting',
    content: "Hey there.",
    sender: 'system',
    timestamp: Date.now()
  }]);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [activeDragCard, setActiveDragCard] = useState<DraggableCard | null>(null);
  const [draggedOverChat, setDraggedOverChat] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('my-work');
  const [usedCardIds, setUsedCardIds] = useState<Set<string>>(new Set());
  const [returningCardId, setReturningCardId] = useState<string | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dragImageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const defaultCards: DraggableCard[] = [{
    id: 'card-1',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760524296/6_3x_shots_so_y310gt.png',
    title: 'Ova : Period tracking app ',
    subtitle: '',
    rotation: -8
  }, {
    id: 'card-2',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525138/172_2x_shots_so_plr79y.png',
    title: 'Greex : Defi trading crypto platform',
    subtitle: '',
    rotation: -4
  }, {
    id: 'card-3',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525270/190_2x_shots_so_gytftu.png',
    title: 'IOC : Vendor management platform ',
    subtitle: '',
    rotation: 2
  }, {
    id: 'card-4',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525328/19_2x_shots_so_lio1is.png',
    title: 'Dealdoc : Deal management platform',
    subtitle: '',
    rotation: 6
  }];
  const cards = customCards || defaultCards;

  // ISSUE #5: Persist messages to localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to load saved messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  const scrollToBottom = useCallback(() => {
    // ISSUE #7: Improve smooth scroll behavior robustness
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);
  const handleDragEnd = useCallback((cardId: string, info: PanInfo) => {
    if (!chatContainerRef.current) {
      setDraggedCardId(null);
      setActiveDragCard(null);
      setDraggedOverChat(false);
      return;
    }
    const chatRect = chatContainerRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;
    const margin = 50;
    const isInDropZone = dropX >= chatRect.left - margin && dropX <= chatRect.right + margin && dropY >= chatRect.top - margin && dropY <= chatRect.bottom + margin;

    // Reset drag states immediately
    setDraggedCardId(null);
    setActiveDragCard(null);
    setDraggedOverChat(false);
    if (isInDropZone) {
      const card = cards.find(c => c.id === cardId);
      if (card && !messages.some(m => m.type === 'card-with-question' && m.card?.id === cardId)) {
        const autoReplyMap: {
          [key: string]: string;
        } = {
          'card-1': 'Tell me more about Ova : Period tracking app. What was your design process?',
          'card-2': 'What was the biggest challenge you came across while designing Greex?',
          'card-3': "What is IOC's vendor management platform?",
          'card-4': 'What did Dealdoc teach you about designing B2B saas?'
        };
        const autoReplyText = autoReplyMap[cardId] || '';
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          type: 'card-with-question',
          content: autoReplyText,
          card: {
            id: card.id,
            image: card.image,
            title: card.title
          },
          sender: 'user',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMessage]);
        setUsedCardIds(prev => new Set([...prev, cardId]));
        
        // Auto-reply to the card question
        setTimeout(async () => {
          if (AI_CONFIG.ENABLED && AI_CONFIG.API_KEY && AI_CONFIG.API_KEY !== 'sk-proj-your-openai-key-here') {
            setIsAITyping(true);
            
            try {
              const aiResponse = await sendToAI(autoReplyText, messages, AI_CONFIG.API_KEY);
              
              const aiMessage: ChatMessage = {
                id: `ai-${Date.now()}`,
                type: 'text',
                content: aiResponse.message,
                sender: 'ai',
                timestamp: Date.now()
              };
              
              setMessages(prev => [...prev, aiMessage]);
            } catch (error) {
              console.error('AI Error:', error);
              // Fallback to static response
              const fallbackMessage: ChatMessage = {
                id: `ai-${Date.now()}`,
                type: 'text',
                content: getFallbackResponse(autoReplyText),
                sender: 'ai',
                timestamp: Date.now()
              };
              setMessages(prev => [...prev, fallbackMessage]);
            } finally {
              setIsAITyping(false);
            }
          } else {
            // Fallback response when API key is not set
            const fallbackMessage: ChatMessage = {
              id: `ai-${Date.now()}`,
              type: 'text',
              content: getFallbackResponse(autoReplyText),
              sender: 'ai',
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, fallbackMessage]);
          }
        }, 1000); // 1 second delay to make it feel natural
      }
    }
  }, [cards, messages]);
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'text',
        content: inputValue,
        sender: 'user',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // Handle AI response (always enabled, hidden from users)
      if (AI_CONFIG.ENABLED && AI_CONFIG.API_KEY && AI_CONFIG.API_KEY !== 'sk-proj-your-openai-key-here') {
        setIsAITyping(true);
        
        try {
          const aiResponse = await sendToAI(inputValue, messages, AI_CONFIG.API_KEY);
          
          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            type: 'text',
            content: aiResponse.message,
            sender: 'ai',
            timestamp: Date.now()
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('AI Error:', error);
          // Fallback to static response
          const fallbackMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            type: 'text',
            content: getFallbackResponse(inputValue),
            sender: 'ai',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, fallbackMessage]);
        } finally {
          setIsAITyping(false);
        }
      } else {
        // Fallback response when API key is not set
        const fallbackMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: 'text',
          content: getFallbackResponse(inputValue),
          sender: 'ai',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    }
  };

  // ISSUE #10: Add clear conversation button
  const handleClearConversation = () => {
    setMessages([{
      id: 'greeting',
      type: 'greeting',
      content: "Hey there.",
      sender: 'system',
      timestamp: Date.now()
    }]);
    setUsedCardIds(new Set());
    localStorage.removeItem('chatMessages');
  };
  const isCardInMessages = (cardId: string) => messages.some(m => m.type === 'card-with-question' && m.card?.id === cardId);
  const shouldShowCard = (cardId: string) => !isCardInMessages(cardId) || returningCardId === cardId;
  return <section aria-label="Portfolio hero" className="relative isolate overflow-hidden bg-[#F2F2F2] text-zinc-900 min-h-screen pb-32">
      {/* Premium dot grid background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
      backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
      backgroundSize: '32px 32px'
    }} />

      {/* Left Floating Buttons */}
      <motion.div initial={{
      opacity: 0,
      x: -20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      duration: 0.6,
      delay: 0.2
    }} className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
        <motion.button whileHover={{
        scale: 1.05,
        y: -2
      }} whileTap={{
        scale: 0.95
      }} className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3BF1]" aria-label="Say Hi">
          <span className="text-sm font-semibold text-zinc-900">Hi</span>
        </motion.button>
        <motion.button whileHover={{
        scale: 1.05,
        y: -2
      }} whileTap={{
        scale: 0.95
      }} className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3BF1]" aria-label="About Me">
          <span className="text-xs font-semibold text-zinc-900">About</span>
        </motion.button>
      </motion.div>

      {/* Right Floating Social Icons */}
      <motion.div initial={{
      opacity: 0,
      x: 20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      duration: 0.6,
      delay: 0.2
    }} className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        <motion.a href="https://twitter.com" target="_blank" rel="noopener noreferrer" whileHover={{
        scale: 1.05,
        y: -2
      }} whileTap={{
        scale: 0.95
      }} className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all text-zinc-900 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3BF1]" aria-label="Twitter">
          <X className="w-5 h-5" />
        </motion.a>
        <motion.a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" whileHover={{
        scale: 1.05,
        y: -2
      }} whileTap={{
        scale: 0.95
      }} className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all text-zinc-900 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3BF1]" aria-label="LinkedIn">
          <Linkedin className="w-5 h-5" />
        </motion.a>
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-[877px] px-4 pb-20 sm:px-6 lg:px-0 mt-16 md:mt-20" style={{
      marginTop: '68px'
    }}>
        <div className="mx-auto flex flex-col items-center">
          {/* Hero Headline */}
          <motion.h1 initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          ease: 'easeOut'
        }} className="font-extrabold tracking-tight leading-tight w-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-[40px]" style={{
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          textAlign: "left",
          justifyContent: "flex-start"
        }}>
            <span className="text-[#1D3BF1] text-2xl sm:text-3xl md:text-4xl lg:text-[44px]" style={{
            textAlign: "left",
            justifyContent: "flex-start"
          }}>
              End-To-End Product design and Branding.
            </span>
          </motion.h1>

          {/* Hero Subheading */}
          <h2 className="mt-2 font-extrabold text-zinc-900 w-full text-center text-xl sm:text-2xl md:text-3xl lg:text-[44px]" style={{
          lineHeight: 1.15,
          textAlign: "left",
          justifyContent: "flex-start"
        }}>
            <span>Visually stunning apps, softwares and</span>
            <span> websites with functionality at it's core.</span>
          </h2>

          {/* Hero Description */}
          <p className="mt-6 text-sm sm:text-base md:text-lg lg:text-[20px] leading-6 text-zinc-700 w-full text-center" style={{
          textAlign: "left",
          justifyContent: "flex-start"
        }}>
            <span style={{
            textAlign: "left",
            justifyContent: "flex-start"
          }}>
              Raksha leads Product and Brand Design for startups, big thinkers and game changers. 6+ years of industry
              experience and 55+ clients so far
            </span>
          </p>

          {/* Chat Container */}
          <div ref={chatContainerRef} className="mt-8 w-full rounded-[14px] border border-black/[0.08] bg-white p-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all" style={{
          backgroundColor: draggedOverChat ? '#f8f9ff' : 'white',
          borderColor: draggedOverChat ? '#1D3BF1' : 'rgba(0,0,0,0.08)'
        }}>
            {/* Messages Area */}
            <div className="messages-scroll-area rounded-[12px] border border-black/[0.08] bg-white px-3 sm:px-4 py-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto space-y-3" aria-live="polite" aria-atomic="true" role="list">
              <AnimatePresence mode="popLayout">
                {messages.map(message => <motion.div key={message.id} initial={{
          opacity: 0,
                y: 10,
                scale: 0.95
        }} animate={{
          opacity: 1,
                y: 0,
                scale: 1
              }} exit={{
                opacity: 0,
                y: -10,
                scale: 0.95
        }} transition={{
                duration: 0.3,
                ease: 'easeOut'
              }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`} role="listitem">
                    {(message.sender === 'system' || message.sender === 'ai') && <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-xs">
                        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg" alt="Raksha avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
                  }} />
                        {(message.type === 'greeting' || message.type === 'text') && <div className="bg-zinc-50 rounded-[12px] px-4 py-3 border border-black/[0.06]">
                            <p className="text-[13px] text-zinc-700 leading-relaxed">
                              <span>{message.content}</span>
                            </p>
                          </div>}
                      </div>}

                    {message.sender === 'user' && <div className="max-w-[85%] sm:max-w-xs">
                        {message.type === 'text' && <div className="bg-[#1D3BF1] rounded-[12px] px-4 py-3">
                            <p className="text-[13px] text-white leading-relaxed">
                              <span>{message.content}</span>
                            </p>
                          </div>}

                        {message.type === 'card-with-question' && message.card && <div className="space-y-2">
                            {/* Card Image */}
                            <div className="bg-white rounded-[14px] border border-black/[0.08] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                              <div className="relative w-full overflow-hidden bg-zinc-100" style={{
                        height: '140px'
                      }}>
                                <img src={message.card.image} alt={message.card.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-3">
                                <p className="text-[12px] text-zinc-900 italic leading-tight">
                                  <span>{message.card.title}</span>
                                </p>
                              </div>
                            </div>

                            {/* Question Bubble */}
                            <div className="bg-[#1D3BF1] rounded-[20px] px-5 py-4 shadow-md">
                              <p className="text-[14px] text-white leading-relaxed">
                                <span>{message.content}</span>
                              </p>
                            </div>
                          </div>}
                      </div>}
                  </motion.div>)}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isAITyping && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="flex items-start gap-3 max-w-xs">
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg" alt="Raksha avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
            }} />
                <div className="bg-zinc-50 rounded-[12px] px-4 py-3 border border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{
                    animationDelay: '0ms'
                  }} />
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{
                    animationDelay: '150ms'
                  }} />
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{
                    animationDelay: '300ms'
                  }} />
                    </div>
                    <span className="text-[12px] text-zinc-600 font-medium">Raksha is typing...</span>
                  </div>
                </div>
              </motion.div>}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Section */}
            <motion.div initial={{
          opacity: 0,
            y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
            duration: 0.4,
            delay: 0.2
          }} className="mt-3 rounded-[20px] border border-black/[0.08] bg-white p-3 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all" style={{
            borderColor: draggedCardId ? '#1D3BF1' : 'rgba(0,0,0,0.08)',
            backgroundColor: draggedCardId ? '#f8f9ff' : 'white'
          }}>
              <div className="space-y-3">
                {/* Input Area */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 flex-shrink-0" strokeWidth={2} />
                  <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Say something..." className="flex-1 bg-transparent text-sm sm:text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none" aria-label="Chat input" />

                  {/* Send Button */}
                  <button onClick={handleSendMessage} className="inline-flex items-center gap-1 sm:gap-2 rounded-[16px] bg-[#0A0D1F] px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(10,13,31,0.2)] transition-all hover:bg-[#151829] hover:shadow-[0_6px_20px_rgba(10,13,31,0.3)] focus:outline-none focus:ring-2 focus:ring-[#0A0D1F] focus:ring-offset-2" aria-label="Send message">
                    <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 justify-end">
                  {/* Clear conversation button */}
                  <button onClick={handleClearConversation} className="inline-flex items-center gap-2 rounded-[16px] bg-zinc-100 px-4 py-2.5 text-[12px] font-medium text-zinc-600 transition-all hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-400" aria-label="Clear conversation">
                    <Trash2 className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                </div>

                {/* Drop Zone Indicator */}
                {draggedCardId && <motion.div initial={{
                opacity: 0
        }} animate={{
                opacity: 1
              }} exit={{
                opacity: 0
        }} transition={{
                duration: 0.2
              }} className="flex items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#1D3BF1]/30 bg-[#1D3BF1]/5 py-3 text-[13px] font-medium text-[#1D3BF1]">
                    <Paperclip className="h-4 w-4" />
                    <span>Drop cards here to ask me anything about this case study.</span>
                  </motion.div>}
              </div>
          </motion.div>
          </div>

          {/* Draggable Cards Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="relative mt-16 mx-auto w-full" style={{
          minHeight: '360px'
        }}>
            <p className="text-center text-sm text-zinc-500 mb-8">
              <span>Explore my creative journey across diverse projects and platforms</span>
            </p>

            <div className="relative w-full max-w-[877px] mx-auto flex items-center justify-center flex-wrap gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4">
              {cards.map((card, index) => {
              const isInMessages = isCardInMessages(card.id);
              return isInMessages ? null : <motion.div key={`card-${card.id}`} drag={!isInMessages} dragMomentum={false} dragElastic={0.1} dragConstraints={{
                left: -2000,
                right: 2000,
                top: -2000,
                bottom: 2000
              }} onDragStart={() => {
                setDraggedCardId(card.id);
                setActiveDragCard(card);
              }} onDragEnd={(event, info) => handleDragEnd(card.id, info)} onDrag={(event, info) => {
                if (chatContainerRef.current) {
                  const chatRect = chatContainerRef.current.getBoundingClientRect();
                  const isOver = info.point.x >= chatRect.left - 100 && info.point.x <= chatRect.right + 100 && info.point.y >= chatRect.top - 100 && info.point.y <= chatRect.bottom + 100;
                  setDraggedOverChat(isOver);
                }
              }} whileHover={!isInMessages ? {
                scale: 1.05,
                zIndex: 50,
                y: -4
              } : {}} whileDrag={{
                scale: 1.12,
                zIndex: 100,
                cursor: 'grabbing',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
              }} onHoverStart={() => !isInMessages && setHoveredCardId(card.id)} onHoverEnd={() => setHoveredCardId(null)} className={`${isInMessages ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing'}`} style={{
                rotate: card.rotation
              }} initial={{
                opacity: 0,
                scale: 0.8,
                y: 20
              }} animate={{
                opacity: usedCardIds.has(card.id) ? 1 : 1,
                scale: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.5 + index * 0.08,
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}>
                    <div className="bg-white rounded-[16px] p-2 sm:p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.06] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]" style={{
                  width: '150px',
                  minHeight: '180px',
                  userSelect: 'none'
                }}>
                      <div className="relative w-full h-[120px] sm:h-[140px] rounded-[10px] overflow-hidden bg-zinc-100 mb-2 sm:mb-3">
                        <img src={card.image} alt={card.title} className="w-full h-full object-cover pointer-events-none select-none" draggable={false} />
              </div>
                      <div className="px-1">
                        {card.subtitle && <p className="text-[10px] sm:text-[11px] text-zinc-500 mb-1">
                            <span>{card.subtitle}</span>
                          </p>}
                        <p className="text-[12px] sm:text-[13px] text-zinc-900 italic leading-tight">
                          <span>{card.title}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>;
            })}
            </div>
          </motion.div>

          {/* Premium Tab Navigation */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6
        }} className="mt-20 mx-auto w-full">
            <nav aria-label="Portfolio categories" className="flex items-center justify-center" style={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
              <ul className="flex items-center justify-center gap-8 list-none p-0 m-0">
                {TAB_ITEMS.map(tab => <li key={tab.id} className="m-0 p-0">
                    <motion.button onClick={e => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }} className="relative inline-block px-0 py-4 text-base font-normal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3BF1]" style={{
                  color: activeTab === tab.id ? '#1D3BF1' : '#9E9E9E',
                  fontSize: '16px',
                  letterSpacing: '0.01em'
                }} whileHover={{
                  color: '#1D3BF1'
                }} whileTap={{
                  scale: 0.98
                }}>
                      <span>{tab.label}</span>
                      {activeTab === tab.id && <motion.span layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1D3BF1]" style={{
                    borderRadius: '1px'
                  }} initial={false} transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30
                  }} />}
                    </motion.button>
                </li>)}
            </ul>
            </nav>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }} transition={{
              duration: 0.3,
              ease: 'easeInOut'
            }} className="mt-12 mb-8">
                <div className="text-center">
                  <p className="text-zinc-700" style={{
                  fontSize: '16px',
                  lineHeight: 1.6
                }}>
                    <span style={{
                    display: 'none'
                  }}>
                      Exploring my expertise in <strong>{TAB_ITEMS.find(t => t.id === activeTab)?.label}</strong>.
                    </span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Case Studies Section */}
            {activeTab === 'my-work' && <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.4,
            ease: 'easeInOut'
          }} className="mt-8 sm:mt-16 space-y-4 sm:space-y-6 mx-auto w-full">
                {CASE_STUDIES.map(caseStudy => <motion.div key={caseStudy.id} initial={{
              opacity: 0,
              y: 16
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              ease: 'easeOut'
            }} className={`group rounded-[18px] overflow-hidden border transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] cursor-pointer ${caseStudy.backgroundColor} ${caseStudy.borderColor} shadow-[0_8px_30px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D3BF1]`} tabIndex={0} role="button" aria-label={`View case study: ${caseStudy.title}`}>
                    {/* Image Container */}
                    <div className="relative w-full overflow-hidden bg-zinc-100" style={{
                aspectRatio: '180 / 140'
              }}>
                      <img src={caseStudy.image} alt={caseStudy.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    {/* Content Container */}
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-2">
                        <span>{caseStudy.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-zinc-600">
                        <span>{caseStudy.subtitle}</span>
                      </p>

                      {/* ISSUE #4: Add "Ask about this" button for keyboard users */}
                      <button className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-[#1D3BF1] text-white text-[11px] sm:text-[12px] font-semibold rounded-[8px] hover:bg-[#1629D1] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3BF1]" aria-label={`Ask about ${caseStudy.title}`}>
                        Ask about this
                      </button>
                    </div>
                  </motion.div>)}
              </motion.div>}

            {/* Visuals Tab */}
            {activeTab === 'visuals' && <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.4,
            ease: 'easeInOut'
          }} className="mt-16 mx-auto w-full">
                <motion.div initial={{
              opacity: 0,
              y: 16
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              ease: 'easeOut'
            }} className="group rounded-[18px] overflow-hidden border border-black/[0.06] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] cursor-pointer bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  {/* Video Container */}
                  <div className="relative w-full overflow-hidden bg-black" style={{
                height: '658px'
              }}>
                    <video src="https://res.cloudinary.com/dky01erho/video/upload/v1760696149/Scene_1_1_ctx9pr.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  </div>
                  {/* Content Container */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-zinc-900 leading-tight mb-2">
                      <span>Visual Motion Showcase</span>
                    </h3>
                    <p className="text-sm font-medium text-zinc-600">
                      <span>Cinematic visualization of design in motion</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>}
          </motion.div>
        </div>
      </div>

      {/* Decorative Background Words */}
      <div aria-hidden="true" className="absolute inset-0 z-[1] hidden w-full overflow-visible select-none lg:block pointer-events-none">
        {/* Row 1 */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex" style={{
        gap: '12vw'
      }}>
          <span className="text-white/80 text-[18vw] font-black leading-none tracking-[0.18em]" style={{
          color: '#ffffff3d'
        }}>
            {' '}
            Raksha{' '}
          </span>
          <span className="text-white/80 text-[18vw] font-black leading-none tracking-[0.18em]" style={{
          color: '#ffffff3d'
        }}>
            {' '}
            Raksha{' '}
        </span>
      </div>
        {/* Row 2 */}
        <div className="absolute top-[78%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex" style={{
        gap: '14vw'
      }}>
          <span className="text-white/80 text-[18vw] font-black leading-none tracking-[0.18em]" style={{
          color: '#ffffff3d'
        }}>
            {' '}
            Raksha{' '}
          </span>
          <span className="text-white/80 text-[18vw] font-black leading-none tracking-[0.18em]" style={{
          color: '#ffffff3d'
        }}>
            {' '}
            Raksha{' '}
        </span>
        </div>
      </div>
    </section>;
};