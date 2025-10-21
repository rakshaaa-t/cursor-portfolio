"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUp, Sparkles, Linkedin, Trash2, Menu } from 'lucide-react';
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

export interface MobilePortfolioHeroProps {
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

export const MobilePortfolioHero: React.FC<MobilePortfolioHeroProps> = ({
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
  const [activeTab, setActiveTab] = useState<string>('my-work');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const [isAITyping, setIsAITyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const defaultCards: DraggableCard[] = [{
    id: 'card-1',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760524296/6_3x_shots_so_y310gt.png',
    title: 'Ova : Period tracking app ',
    subtitle: '',
    rotation: 0
  }, {
    id: 'card-2',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525138/172_2x_shots_so_plr79y.png',
    title: 'Greex : Defi trading crypto platform',
    subtitle: '',
    rotation: 0
  }, {
    id: 'card-3',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525270/190_2x_shots_so_gytftu.png',
    title: 'IOC : Vendor management platform ',
    subtitle: '',
    rotation: 0
  }, {
    id: 'card-4',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1760525328/19_2x_shots_so_lio1is.png',
    title: 'Dealdoc : Deal management platform',
    subtitle: '',
    rotation: 0
  }];

  const cards = customCards || defaultCards;

  useEffect(() => {
    const updateUnderline = () => {
      const activeButton = tabRefs.current[activeTab];
      if (activeButton && tabsContainerRef.current) {
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        setTabUnderlineLeft(buttonRect.left - containerRect.left);
        setTabUnderlineWidth(buttonRect.width);
      }
    };
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeTab]);

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

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'text',
        content: inputValue,
        sender: 'user',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');

      // Get AI response
      if (AI_CONFIG.API_KEY && AI_CONFIG.API_KEY.startsWith('sk-proj-')) {
        setIsAITyping(true);
        try {
          const response = await sendToAI(inputValue, messages, AI_CONFIG.API_KEY);
          setIsAITyping(false);
          
          const aiMessage: ChatMessage = {
            id: `msg-ai-${Date.now()}`,
            type: 'text',
            content: response.message,
            sender: 'ai',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          setIsAITyping(false);
          console.error('AI response error:', error);
        }
      }
    }
  };

  const handleClearConversation = () => {
    setMessages([{
      id: 'greeting',
      type: 'greeting',
      content: "Hey there.",
      sender: 'system',
      timestamp: Date.now()
    }]);
    localStorage.removeItem('chatMessages');
  };

  const handleCardClick = async (card: DraggableCard) => {
    const autoReplyMap: { [key: string]: string } = {
      'card-1': 'Tell me more about Ova : Period tracking app. What was your design process?',
      'card-2': 'What was the biggest challenge you came across while designing Greex?',
      'card-3': "What is IOC's vendor management platform?",
      'card-4': 'What did Dealdoc teach you about designing B2B saas?'
    };
    
    const autoReplyText = autoReplyMap[card.id] || '';
    
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

    // Get AI response after card placement
    if (AI_CONFIG.API_KEY && AI_CONFIG.API_KEY.startsWith('sk-proj-') && autoReplyText) {
      setTimeout(async () => {
        setIsAITyping(true);
        try {
          const response = await sendToAI(autoReplyText, messages, AI_CONFIG.API_KEY);
          setIsAITyping(false);
          
          const aiMessage: ChatMessage = {
            id: `msg-ai-${Date.now()}`,
            type: 'text',
            content: response.message,
            sender: 'ai',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          setIsAITyping(false);
          console.error('AI response error:', error);
        }
      }, 1000);
    }
  };

  return (
    <section aria-label="Portfolio hero" className="relative isolate overflow-hidden bg-[#F2F2F2] text-zinc-900 min-h-screen pb-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-[#F2F2F2]/80 backdrop-blur-md border-b border-black/[0.06] px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
              alt="Raksha avatar"
              className="w-10 h-10 rounded-full object-cover"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' }}
            />
            <div>
              <h1 className="text-sm font-bold text-zinc-900">Raksha</h1>
              <p className="text-xs text-zinc-600">Product Designer</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full bg-white border border-black/[0.06] shadow-sm"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-zinc-900" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-zinc-900">Menu</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-4">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50 text-zinc-900 font-medium">
                  Say Hi
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50 text-zinc-900 font-medium">
                  About Me
                </button>
                <div className="pt-4 border-t border-zinc-200">
                  <p className="text-xs text-zinc-500 mb-3">Connect</p>
                  <div className="flex gap-3">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-50 border border-black/[0.06]"
                      aria-label="Twitter"
                    >
                      <X className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-50 border border-black/[0.06]"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-6 pb-8">
        <div className="mx-auto max-w-2xl">
          {/* Hero Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="font-extrabold tracking-tight leading-tight text-[28px] text-left"
            style={{ letterSpacing: '-0.01em' }}
          >
            <span className="text-[#1D3BF1]">End-To-End Product design and Branding.</span>
          </motion.h2>

          {/* Hero Subheading */}
          <h3
            className="mt-3 font-extrabold text-zinc-900 text-left text-[22px] leading-tight"
            style={{ letterSpacing: '-0.01em' }}
          >
            Visually stunning apps, softwares and websites with functionality at it's core.
          </h3>

          {/* Hero Description */}
          <p className="mt-4 text-zinc-700 text-left text-[15px] leading-relaxed">
            Raksha leads Product and Brand Design for startups, big thinkers and game changers. 6+ years of industry
            experience and 55+ clients so far
          </p>

          {/* Chat Container */}
          <div ref={chatContainerRef} className="mt-6 w-full rounded-[14px] border border-black/[0.08] bg-white p-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            {/* Messages Area */}
            <div className="messages-scroll-area rounded-[12px] border border-black/[0.08] bg-white px-3 py-3 max-h-[300px] overflow-y-auto space-y-3" aria-live="polite" aria-atomic="true" role="list">
              <AnimatePresence mode="popLayout">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    role="listitem"
                  >
                    {(message.sender === 'system' || message.sender === 'ai') && (
                      <div className="flex items-start gap-2 max-w-[85%]">
                        <img
                          src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
                          alt="Raksha avatar"
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' }}
                        />
                        {(message.type === 'greeting' || message.type === 'text') && (
                          <div className="bg-zinc-50 rounded-[12px] px-3 py-2.5 border border-black/[0.06]">
                            <p className="text-[13px] text-zinc-700 leading-relaxed">{message.content}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {message.sender === 'user' && (
                      <div className="max-w-[85%]">
                        {message.type === 'text' && (
                          <div className="bg-[#1D3BF1] rounded-[12px] px-3 py-2.5">
                            <p className="text-[13px] text-white leading-relaxed">{message.content}</p>
                          </div>
                        )}

                        {message.type === 'card-with-question' && message.card && (
                          <div className="space-y-2">
                            <div className="bg-white rounded-[12px] border border-black/[0.08] overflow-hidden shadow-sm">
                              <div className="relative w-full overflow-hidden bg-zinc-100 h-24">
                                <img src={message.card.image} alt={message.card.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-2.5">
                                <p className="text-[11px] text-zinc-900 italic leading-tight">
                                  {message.card.title}
                                </p>
                              </div>
                            </div>
                            <div className="bg-[#1D3BF1] rounded-[14px] px-4 py-3 shadow-md">
                              <p className="text-[13px] text-white leading-relaxed">{message.content}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isAITyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <img
                        src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
                        alt="Raksha avatar"
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' }}
                      />
                      <div className="bg-zinc-50 rounded-[12px] px-3 py-2.5 border border-black/[0.06]">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-2 rounded-[18px] border border-black/[0.08] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-zinc-400 flex-shrink-0" strokeWidth={2} />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Say something..."
                    className="flex-1 bg-transparent text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                    aria-label="Chat input"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#0A0D1F] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(10,13,31,0.2)] transition-all hover:bg-[#151829] focus:outline-none focus:ring-2 focus:ring-[#0A0D1F] focus:ring-offset-2"
                    aria-label="Send message"
                  >
                    <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                    <span>Send</span>
                  </button>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={handleClearConversation}
                    className="inline-flex items-center gap-1.5 rounded-[12px] bg-zinc-100 px-3 py-1.5 text-[12px] font-medium text-zinc-600 transition-all hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-400"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Project Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <p className="text-center text-sm text-zinc-500 mb-6 px-2">
              Tap a card to ask about the project
            </p>

            <div className="grid grid-cols-2 gap-3">
              {cards.map((card, index) => (
                <motion.button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + index * 0.08,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-[14px] p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.06] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] text-left"
                >
                  <div className="relative w-full rounded-[10px] overflow-hidden bg-zinc-100 mb-2 h-28">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-0.5">
                    {card.subtitle && <p className="text-[10px] text-zinc-500 mb-1">{card.subtitle}</p>}
                    <p className="text-[12px] text-zinc-900 italic leading-tight">{card.title}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <nav aria-label="Portfolio categories" className="relative">
              <div
                ref={tabsContainerRef}
                className="flex items-center justify-start relative overflow-x-auto scrollbar-hide"
                style={{
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <ul className="flex items-center gap-6 list-none p-0 m-0">
                  {TAB_ITEMS.map(tab => (
                    <li key={tab.id} className="m-0 p-0 flex-shrink-0">
                      <button
                        ref={el => { tabRefs.current[tab.id] = el; }}
                        onClick={e => {
                          e.preventDefault();
                          setActiveTab(tab.id);
                        }}
                        className="relative inline-block px-0 py-3 text-sm font-normal transition-colors duration-200 focus:outline-none whitespace-nowrap"
                        style={{
                          color: activeTab === tab.id ? '#1D3BF1' : '#9E9E9E',
                          letterSpacing: '0.01em'
                        }}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                <motion.div
                  className="absolute bottom-0 h-0.5 bg-[#1D3BF1]"
                  style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 1 }}
                  layoutId="tabUnderline"
                />
              </div>
            </nav>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="mt-8 mb-6"
              >
                {activeTab === 'my-work' && (
                  <div className="space-y-4">
                    {CASE_STUDIES.map(caseStudy => (
                      <motion.div
                        key={caseStudy.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`group rounded-[16px] overflow-hidden border transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] ${caseStudy.backgroundColor} ${caseStudy.borderColor} shadow-[0_8px_30px_rgba(0,0,0,0.06)]`}
                      >
                        <div className="relative w-full overflow-hidden bg-zinc-100" style={{ aspectRatio: '16 / 10' }}>
                          <img
                            src={caseStudy.image}
                            alt={caseStudy.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-bold text-zinc-900 leading-tight mb-1">
                            {caseStudy.title}
                          </h3>
                          <p className="text-xs font-medium text-zinc-600">{caseStudy.subtitle}</p>
                          <button className="mt-3 px-4 py-2 bg-[#1D3BF1] text-white text-[12px] font-semibold rounded-[8px] hover:bg-[#1629D1] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3BF1]">
                            Ask about this
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'visuals' && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="group rounded-[16px] overflow-hidden border border-black/[0.06] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '16 / 9' }}>
                      <video
                        src="https://res.cloudinary.com/dky01erho/video/upload/v1760696149/Scene_1_1_ctx9pr.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-zinc-900 leading-tight mb-1">
                        Visual Motion Showcase
                      </h3>
                      <p className="text-xs font-medium text-zinc-600">
                        Cinematic visualization of design in motion
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

