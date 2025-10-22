"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MessageCircle, Archive, Calendar, ArrowUpRight, Sparkles, ArrowUp, Trash2 } from 'lucide-react';
import { ensureLightMode } from '../../lib/utils';
import { sendToAI, getFallbackResponse, type ChatMessage as AIChatMessage } from '../../lib/ai-chat';
import { AI_CONFIG } from '../../lib/config';

interface ProjectCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
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

export interface PortfolioHeroSectionProps {
  projectCards?: ProjectCard[];
}

const DEFAULT_PROJECTS: ProjectCard[] = [
  {
    id: 'card-1',
    title: 'ova : period Tracking App',
    subtitle: '',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760524296/6_3x_shots_so_y310gt.png',
    rotation: 0
  },
  {
    id: 'card-2',
    title: 'greex : defi trading platform',
    subtitle: '',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525138/172_2x_shots_so_plr79y.png',
    rotation: 0
  },
  {
    id: 'card-3',
    title: 'ioc : vendor management platform',
    subtitle: '',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525270/190_2x_shots_so_gytftu.png',
    rotation: 0
  },
  {
    id: 'card-4',
    title: 'dealdoc : deal management platform',
    subtitle: '',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525328/19_2x_shots_so_lio1is.png',
    rotation: 0
  }
];

export const PortfolioHeroSection: React.FC<PortfolioHeroSectionProps> = ({
  projectCards = DEFAULT_PROJECTS
}) => {
  useEffect(() => {
    ensureLightMode();
  }, []);

  const [activeTab, setActiveTab] = useState<'work' | 'vibe-coded' | 'writings'>('work');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      type: 'greeting',
      content: 'you can ask me here about my design process, my past projects or just get to know me better!',
      sender: 'system',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [draggedOverChat, setDraggedOverChat] = useState(false);
  const [usedCardIds, setUsedCardIds] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatDropZoneRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'text',
      content: inputValue,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // AI Response
    if (AI_CONFIG.ENABLED && AI_CONFIG.API_KEY && AI_CONFIG.API_KEY.startsWith('sk-proj-')) {
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
    }
  };

  const handleClearConversation = () => {
    setMessages([
      {
        id: 'greeting',
        type: 'greeting',
        content: 'you can ask me here about my design process, my past projects or just get to know me better!',
        sender: 'system',
        timestamp: Date.now()
      }
    ]);
    setUsedCardIds(new Set());
    localStorage.removeItem('chatMessages');
  };

  const handleCardDragStart = (cardId: string) => {
    setDraggedCardId(cardId);
  };

  const handleCardDragEnd = (cardId: string, info: PanInfo) => {
    const dropZone = chatDropZoneRef.current;
    if (!dropZone) return;

    const dropZoneRect = dropZone.getBoundingClientRect();
    const { x, y } = info.point;

    const isInDropZone =
      x >= dropZoneRect.left &&
      x <= dropZoneRect.right &&
      y >= dropZoneRect.top &&
      y <= dropZoneRect.bottom;

    setDraggedCardId(null);
    setDraggedOverChat(false);

    if (isInDropZone) {
      const card = projectCards.find(c => c.id === cardId);
      if (card && !usedCardIds.has(cardId)) {
        const autoReplyMap: { [key: string]: string } = {
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

        // Auto-reply to card question
        setTimeout(async () => {
          if (AI_CONFIG.ENABLED && AI_CONFIG.API_KEY && AI_CONFIG.API_KEY.startsWith('sk-proj-')) {
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
          }
        }, 800);
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-[#d9d7e4] flex overflow-hidden font-['Nexa',_system-ui,_sans-serif]">
      {/* Left Icon Sidebar */}
      <div className="w-[88px] bg-transparent flex flex-col items-center pt-[340px] gap-[18px]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[56px] h-[56px] rounded-full bg-[#4a4ae8] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(74,74,232,0.3)]"
          aria-label="Chat"
        >
          <MessageCircle className="w-[24px] h-[24px]" strokeWidth={2} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[48px] h-[48px] rounded-full bg-[#3a3749] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          aria-label="Projects"
        >
          <Archive className="w-[20px] h-[20px]" strokeWidth={2} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[48px] h-[48px] rounded-full bg-[#3a3749] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          aria-label="Calendar"
        >
          <Calendar className="w-[20px] h-[20px]" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Left Content - Projects */}
      <div className="w-[960px] flex flex-col overflow-hidden pt-[32px]">
        {/* Top Tabs */}
        <div className="flex items-center gap-[48px] px-[24px] pb-[32px]">
          {(['work', 'vibe coded', 'writings'] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab as 'work' | 'vibe-coded' | 'writings')}
              className="relative pb-[8px]"
              whileHover={{ scale: 1.02 }}
            >
              <span
                className={`text-[15px] font-normal transition-colors ${
                  activeTab === 'work' && tab === 'work'
                    ? 'text-[#4a4ae8]'
                    : 'text-[#3d3a4f]/75'
                }`}
              >
                {tab}
              </span>
              {activeTab === 'work' && tab === 'work' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4a4ae8]"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Projects Scroll Area */}
        <div className="flex-1 overflow-y-auto px-[24px] pb-[24px] space-y-[24px] custom-scrollbar">
          {projectCards.map((project, index) => (
            <motion.div
              key={project.id}
              drag
              dragMomentum={false}
              dragElastic={0.1}
              onDragStart={() => handleCardDragStart(project.id)}
              onDragEnd={(_, info) => handleCardDragEnd(project.id, info)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: usedCardIds.has(project.id) ? 0.3 : 1, 
                y: 0,
                scale: draggedCardId === project.id ? 1.05 : 1
              }}
              transition={{ delay: index * 0.1 }}
              className={`group cursor-grab active:cursor-grabbing ${
                usedCardIds.has(project.id) ? 'pointer-events-none' : ''
              }`}
              style={{ zIndex: draggedCardId === project.id ? 50 : 1 }}
            >
              <div className="bg-[#ebe9f3]/60 backdrop-blur-sm rounded-[28px] p-[20px] border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h3 className="text-[14px] font-normal text-[#2d2a3f] mb-[16px] tracking-[-0.01em]">
                  <span>{project.title}</span>
                </h3>

                <div className="relative bg-[#f5f4f8] rounded-[20px] overflow-hidden aspect-[16/10]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-[14px] right-[14px] w-[40px] h-[40px] rounded-full bg-[#c8c5dc]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
                    aria-label="View project"
                  >
                    <ArrowUpRight className="w-[20px] h-[20px] text-[#2d2a3f]" strokeWidth={2} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Interface */}
      <div 
        ref={chatDropZoneRef}
        className={`flex-1 flex flex-col overflow-hidden pt-[32px] pr-[32px] pb-[32px] transition-all ${
          draggedCardId ? 'ring-2 ring-[#4a4ae8]/30 ring-offset-4' : ''
        }`}
      >
        {/* Large Rounded Container Wrapper */}
        <div className="flex-1 bg-[#e8e7f1]/50 backdrop-blur-sm rounded-[40px] border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-[48px] pt-[48px] pb-[24px]">
            <div className="flex items-start justify-between mb-[32px]">
              <h1 className="text-[28px] font-normal text-[#2d2a3f] tracking-[-0.02em]">
                <span>hey, I'm Raks</span>
              </h1>
              <div className="flex items-center gap-[8px]">
                <span className="text-[13px] text-[#6b6883] font-light">
                  <span>email :</span>
                </span>
                <span className="text-[13px] text-[#2d2a3f] font-normal">
                  <span>contact@rakshaaa.com</span>
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto px-[48px] pb-[24px] custom-scrollbar">
            <div className="max-w-[720px] space-y-[20px]">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {(message.sender === 'system' || message.sender === 'ai') && (
                      <div className="flex items-start gap-[14px] max-w-[90%]">
                        <div className="w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                          <img
                            src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
                            alt="Raksha"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-[20px] px-[20px] py-[16px] border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                          <p className="text-[14px] text-[#2d2a3f] leading-[1.6]">
                            <span>{message.content}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {message.sender === 'user' && (
                      <div className="max-w-[90%]">
                        {message.type === 'text' && (
                          <div className="bg-gradient-to-r from-[#4a4ae8] to-[#4a4ae8] rounded-[20px] px-[20px] py-[16px] shadow-[0_4px_16px_rgba(74,74,232,0.25)]">
                            <p className="text-[14px] text-white leading-[1.6]">
                              <span>{message.content}</span>
                            </p>
                          </div>
                        )}

                        {message.type === 'card-with-question' && message.card && (
                          <div className="relative">
                            {/* Card Image - Tilted and positioned */}
                            <motion.div
                              initial={{ rotate: 0, opacity: 0 }}
                              animate={{ rotate: 3, opacity: 1 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              className="bg-white rounded-[14px] border border-black/[0.08] overflow-hidden shadow-lg hover:shadow-xl transition-shadow mb-3 ml-auto max-w-[85%]"
                              style={{ transformOrigin: 'center center' }}
                            >
                              <div
                                className="relative w-full overflow-hidden bg-zinc-100"
                                style={{ height: '140px' }}
                              >
                                <img
                                  src={message.card.image}
                                  alt={message.card.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-[12px] text-zinc-900 italic leading-tight">
                                  <span>{message.card.title}</span>
                                </p>
                              </div>
                            </motion.div>

                            {/* Question Bubble - Slightly offset */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="bg-gradient-to-r from-[#4a4ae8] to-[#4a4ae8] rounded-[20px] px-[20px] py-[16px] shadow-[0_4px_16px_rgba(74,74,232,0.25)] max-w-[90%] ml-auto"
                            >
                              <p className="text-[14px] text-white leading-[1.6]">
                                <span>{message.content}</span>
                              </p>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isAITyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-[14px]">
                    <div className="w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      <img
                        src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
                        alt="Raksha"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-[20px] px-[20px] py-[16px] border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-[#6b6883] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-[#6b6883] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-[#6b6883] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Section - Input + Clear */}
          <div className="px-[48px] pb-[48px]">
            <div className="max-w-[720px]">
              {/* Input Area */}
              <div className="relative">
                <div className="flex items-center gap-[12px] bg-[#ebe9f3]/70 backdrop-blur-sm rounded-[20px] px-[20px] py-[14px] border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <Sparkles className="w-[20px] h-[20px] text-[#6b6883] flex-shrink-0" strokeWidth={2} />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Talk 2 me"
                    className="flex-1 bg-transparent text-[14px] text-[#2d2a3f] placeholder:text-[#6b6883] focus:outline-none"
                    aria-label="Message input"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.12)] transition-all"
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-[20px] h-[20px] text-[#2d2a3f]" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>

              {/* Clear Button */}
              <div className="flex justify-end mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearConversation}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] bg-white/60 backdrop-blur-sm text-[13px] text-[#6b6883] hover:bg-white/80 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.cdnfonts.com/css/nexa-bold');
        
        .font-nexa {
          font-family: 'Nexa', system-ui, -apple-system, sans-serif;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 74, 232, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 74, 232, 0.25);
        }
      `}</style>
    </div>
  );
};
