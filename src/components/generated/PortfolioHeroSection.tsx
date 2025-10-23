"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, ArrowUp, Trash2 } from 'lucide-react';
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
  attachedProject?: ProjectCard;
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

const NAV_ITEMS = [
  {
    id: "chat" as const,
    label: "Chat"
  },
  {
    id: "inbox" as const,
    label: "Inbox"
  },
  {
    id: "calendar" as const,
    label: "Calendar"
  }
] as const;

export const PortfolioHeroSection: React.FC<PortfolioHeroSectionProps> = ({
  projectCards = DEFAULT_PROJECTS
}) => {
  useEffect(() => {
    ensureLightMode();
  }, []);

  const [activeTab, setActiveTab] = useState<'work' | 'vibe-coded' | 'writings'>('work');
  const [activeNav, setActiveNav] = useState<"chat" | "inbox" | "calendar">("chat");
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
  const [draggedProject, setDraggedProject] = useState<ProjectCard | null>(null);
  const [isDraggingOverChat, setIsDraggingOverChat] = useState(false);
  const [usedCardIds, setUsedCardIds] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = (e: React.DragEvent, project: ProjectCard) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'copy';

    const thumbnail = document.createElement('div');
    thumbnail.style.cssText = `
      position: absolute; top: -9999px; left: -9999px; width: 200px;
      background: linear-gradient(135deg, rgba(235, 233, 243, 0.95), rgba(232, 231, 241, 0.98));
      backdrop-filter: blur(20px); border-radius: 16px; padding: 12px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 32px rgba(74, 74, 232, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
    `;
    
    const imgWrapper = document.createElement('div');
    imgWrapper.style.cssText = `width: 100%; height: 110px; border-radius: 12px; overflow: hidden; background: #f5f4f8;`;
    
    const img = document.createElement('img');
    img.src = project.image;
    img.style.cssText = `width: 100%; height: 100%; object-fit: cover;`;
    
    imgWrapper.appendChild(img);
    thumbnail.appendChild(imgWrapper);
    document.body.appendChild(thumbnail);
    
    e.dataTransfer.setDragImage(thumbnail, 100, 65);
    
    setTimeout(() => document.body.removeChild(thumbnail), 0);
  };

  const handleDragEnd = () => {
    setDraggedProject(null);
    setIsDraggingOverChat(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOverChat(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = chatAreaRef.current?.getBoundingClientRect();
    if (rect && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) {
      setIsDraggingOverChat(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverChat(false);
    
    if (draggedProject && !usedCardIds.has(draggedProject.id)) {
      const projectName = draggedProject.title.split(':')[0].trim();
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'card-with-question',
        content: `tell me more about ${projectName}, what were the design challenges with it?`,
        sender: 'user',
        timestamp: Date.now(),
        attachedProject: draggedProject
      };
      
      setMessages(prev => [...prev, newMessage]);
      setUsedCardIds(prev => new Set([...prev, draggedProject.id]));
      setDraggedProject(null);

      // Auto-reply to card question
      setTimeout(async () => {
        if (AI_CONFIG.ENABLED && AI_CONFIG.API_KEY && AI_CONFIG.API_KEY.startsWith('sk-proj-')) {
          setIsAITyping(true);

          try {
            const aiResponse = await sendToAI(newMessage.content!, messages, AI_CONFIG.API_KEY);

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
              content: getFallbackResponse(newMessage.content!),
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
  };

  return (
    <div className="h-screen w-screen bg-[#d9d7e4] flex flex-col overflow-hidden font-['Geist',_system-ui,_sans-serif]">
      {/* Top Navigation */}
      <nav className="fixed left-1/2 -translate-x-1/2 top-10 z-50 w-full max-w-[1542px] px-8">
        <div className="flex items-center justify-between gap-14 px-0 py-0 bg-white/[0.03] backdrop-blur-[22px] rounded-full border border-white/10">
          {/* Logo */}
          <div className="flex items-center justify-center px-8 py-2">
            <svg width="85" height="27" viewBox="0 0 85 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[85px] h-[27px]">
              <path d="M1.17123e-05 25.9199L2.95201 10.9799C2.01601 10.4039 1.44001 9.35992 1.44001 8.24392C1.44001 6.65992 2.52001 5.57992 4.17601 5.57992C5.83201 5.57992 6.91201 6.62392 7.02001 8.06392L18.972 9.43192V10.4039C16.848 13.4279 15.66 16.1279 15.66 18.3959C15.66 20.6999 16.884 22.0319 18.936 22.0319H19.656V25.9199H18.576C14.004 25.9199 11.52 23.2559 11.52 18.8639C11.52 16.9199 12.132 14.8319 13.248 12.7079L6.62401 11.8439L3.96001 25.9199H1.17123e-05ZM30.4144 26.3519C25.2304 26.3519 21.3784 22.2119 21.3784 16.7399C21.3784 11.2679 25.2304 7.12792 30.4144 7.12792C33.1144 7.12792 35.3464 8.27992 36.8584 10.1879V7.55992H40.8904V20.3399C40.8904 21.3839 41.5024 22.0319 42.5824 22.0319H42.9064V25.9199H41.7544C39.2344 25.9199 37.6504 24.9119 37.1104 23.0039C35.5624 25.0919 33.2224 26.3519 30.4144 26.3519ZM31.2064 22.4639C34.4464 22.4639 36.8584 19.9799 36.8584 16.7399C36.8584 13.4999 34.4464 11.0159 31.2064 11.0159C27.9304 11.0159 25.5184 13.4999 25.5184 16.7399C25.5184 19.9799 27.9304 22.4639 31.2064 22.4639ZM45.9788 25.9199V-7.9155e-05H50.0108V10.7999C52.2428 8.53192 55.1228 7.12792 57.9668 7.12792C61.3508 7.12792 63.5828 9.10792 63.5828 12.0599C63.5828 14.8679 61.4228 17.1719 57.5708 18.5759L58.8668 20.0879C59.8388 21.3119 61.2068 22.0319 62.6468 22.0319H63.5828V25.9199H62.1788C59.4068 25.9199 56.5628 25.0199 54.9428 22.0679L53.1788 19.6919C52.1708 19.8359 51.1268 19.9799 50.0108 20.0519V25.9199H45.9788ZM57.2108 10.8359C54.8348 10.8359 51.8828 12.5639 50.0108 15.0119V16.7399C55.9148 16.1279 59.4788 14.5439 59.4788 12.4919C59.4788 11.4839 58.6148 10.8359 57.2108 10.8359ZM77.31 26.3519C74.25 26.3519 71.586 25.0919 69.894 23.1119L68.67 25.9199H64.494L72.738 7.55992H77.346C78.462 12.3839 84.834 12.4199 84.834 18.9359C84.834 23.3639 81.99 26.3519 77.31 26.3519ZM80.694 18.8639C80.694 15.7679 76.806 14.9399 74.97 11.6639L71.37 19.7999C72.414 21.3839 74.394 22.4639 76.554 22.4639C79.002 22.4639 80.694 21.0599 80.694 18.8639Z" fill="white" />
            </svg>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center justify-center gap-7 px-0 py-0">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative w-[60px] h-[60px] flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[#283FE4] border border-white shadow-[1px_2px_4px_rgba(0,0,0,0.1),5px_7px_8px_rgba(0,0,0,0.09),11px_15px_11px_rgba(0,0,0,0.05),19px_26px_13px_rgba(0,0,0,0.01)]"
                      : "bg-white/32 border-none hover:bg-white/40"
                  }`}
                  aria-label={item.label}
                >
                  {/* Glow effect for active chat icon */}
                  {isActive && index === 0 && (
                    <div className="absolute left-0 top-[-2px] w-[30px] h-[25px] bg-white blur-[22px] pointer-events-none" />
                  )}

                  {/* Chat Icon */}
                  {index === 0 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                      <defs>
                        <linearGradient id={`chatGrad1-${index}`} x1="8" y1="-2" x2="8" y2="16" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0.34" />
                        </linearGradient>
                        <linearGradient id={`chatGrad2-${index}`} x1="13.5" y1="4.25" x2="13.5" y2="18.75" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" stopOpacity="0.6" />
                          <stop offset="1" stopColor="white" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id={`chatGrad3-${index}`} x1="13.5" y1="4.25" x2="13.5" y2="12.647" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M-1 6.9935C-1 8.624 -0.5594 10.1472 0.196296 11.4646C0.386008 11.9255 0.277894 12.4945 0.15637 12.9568C-0.0290115 13.6619 -0.37829 14.3398 -0.786234 14.7485C-0.989635 14.9522 -1.05447 15.2561 -0.951529 15.525C-0.848591 15.7939 -0.596747 15.9771 -0.309173 15.9927C0.515407 16.0372 1.42882 15.8742 2.22577 15.6419C2.83705 15.4638 3.42054 15.2318 3.88387 14.9889C5.15405 15.645 6.57121 15.9955 8.00093 15.9955C12.9719 15.9954 16.9997 11.9668 17 6.99726C17 2.05315 13.0118 -1.95859 8.07795 -2C3.10883 -1.99994 -1 2.02366 -1 6.9935Z" fill={`url(#chatGrad1-${index})`} />
                      <path d="M6.75 11.4971C6.75 12.8083 6.39474 14.0325 5.78811 15.0918C5.43806 15.7473 6.07971 17.0133 6.53028 17.4648C6.73936 17.6742 6.80605 17.9874 6.70017 18.2637C6.59423 18.5399 6.33537 18.7282 6.04003 18.7441C5.36508 18.7806 4.62642 18.6475 3.98931 18.4619C3.53604 18.3299 3.09802 18.1595 2.73538 17.9775C1.73231 18.4798 0.620666 18.7461 -0.500977 18.7461C-4.50523 18.7459 -7.74982 15.5019 -7.75 11.5C-7.75 7.49799 -4.50226 4.25 -0.499023 4.25C3.50371 4.25021 6.75 7.49486 6.75 11.4971Z" fill={`url(#chatGrad2-${index})`} />
                      <path d="M6 11.4971C6 7.02136 2.26862 5.18281 -1.16504 5.00879L-0.499023 5C-4.08819 5 -7 7.91218 -7 11.5C-6.99979 15.0874 -4.09121 17.9959 -0.500977 17.9961V18.7461C-4.50523 18.7459 -7.74982 15.5019 -7.75 11.5C-7.75 7.49799 -4.50226 4.25 -0.499023 4.25C3.50371 4.25021 6.75 7.49486 6.75 11.4971C6.75 12.8083 6.39474 14.0325 5.78811 15.0918C5.43806 15.7473 6.07971 17.0133 6.53028 17.4648C6.73936 17.6742 6.80605 17.9874 6.70017 18.2637C6.59423 18.5399 6.33537 18.7282 6.04003 18.7441C5.36508 18.7806 4.62642 18.6475 3.98931 18.4619C3.53604 18.3299 3.09802 18.1595 2.73538 17.9775C1.73231 18.4798 0.620666 18.7461 -0.500977 18.7461V17.9961C0.502543 17.9961 1.49923 17.7574 2.39941 17.3066C2.61093 17.2007 2.85991 17.2016 3.07129 17.3076C3.38904 17.467 3.78471 17.6214 4.19922 17.7422C4.71633 17.8928 5.27773 17.9965 5.78516 18L6 17.9951C5.68402 17.6784 5.35974 17.1509 5.15823 16.6211C5.05493 16.3495 4.97073 16.0451 4.94531 15.7373C4.92029 15.4343 4.94833 15.0728 5.12695 14.7383L5.13769 14.7188C5.61456 13.886 5.91706 12.9424 5.98535 11.9336L6 11.4971Z" fill={`url(#chatGrad3-${index})`} />
                    </svg>
                  )}

                  {/* Inbox Icon */}
                  {index === 1 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={`inboxGrad1-${index}`} x1="12" y1="3" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#575757" />
                          <stop offset="1" stopColor="#151515" />
                        </linearGradient>
                        <linearGradient id={`inboxGrad2-${index}`} x1="23" y1="17" x2="1" y2="17" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#E3E3E5" stopOpacity="0.6" />
                          <stop offset="1" stopColor="#BBBBC0" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id={`inboxGrad3-${index}`} x1="12" y1="13" x2="12" y2="17.633" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M22.3989 14.9955L21.1412 7.04961C20.9136 5.61186 20.7999 4.89299 20.4453 4.35306C20.1327 3.87717 19.6912 3.50015 19.1724 3.26581C18.5837 3 17.8558 3 16.4002 3L7.60059 3C6.14502 3 5.4171 3 4.82842 3.26594C4.30957 3.5002 3.86807 3.87731 3.55548 4.35319C3.20094 4.89306 3.08721 5.61195 2.85962 7.04973L1.60205 14.9962C3.97778 16.0307 6.82488 18.0001 9.50027 18.0001L14.5003 18C17.1756 18 20.0231 16.0302 22.3989 14.9955Z" fill={`url(#inboxGrad1-${index})`} />
                      <path d="M17.1818 21C18.8751 21 19.7217 21 20.3979 20.7478C21.4849 20.3424 22.3424 19.4849 22.7478 18.3979C23 17.7217 23 16.8751 23 15.1818C23 14.5469 23 14.2294 22.9054 13.9758C22.7534 13.5682 22.4318 13.2466 22.0242 13.0946C21.7706 13 21.4531 13 20.8182 13H17.8563C17.5432 13 17.3867 13 17.2446 13.0432C17.1188 13.0814 17.0018 13.144 16.9002 13.2275C16.7855 13.3217 16.6987 13.452 16.525 13.7125L15.475 15.2875C15.3013 15.548 15.2145 15.6783 15.0998 15.7725C14.9982 15.856 14.8812 15.9186 14.7554 15.9568C14.6133 16 14.4568 16 14.1437 16H9.85632C9.54316 16 9.38667 16 9.24463 15.9568C9.11877 15.9186 9.00183 15.856 8.90015 15.7725C8.78546 15.6783 8.69873 15.548 8.52502 15.2875L7.47498 13.7125C7.30127 13.452 7.21454 13.3217 7.09985 13.2275C6.99817 13.144 6.88123 13.0814 6.75537 13.0432C6.61333 13 6.45684 13 6.14368 13H3.18182C2.54684 13 2.22944 13 1.97583 13.0946C1.56821 13.2466 1.24663 13.5682 1.09461 13.9758C1 14.2294 1 14.5469 1 15.1818C1 16.8751 1 17.7217 1.25219 18.3979C1.65762 19.4849 2.51508 20.3424 3.60213 20.7478C4.27827 21 5.12493 21 6.81818 21H17.1818Z" fill={`url(#inboxGrad2-${index})`} />
                      <path d="M17.1816 20.25V21H6.81836V20.25H17.1816ZM22.25 15.1816C22.25 14.855 22.2493 14.6442 22.2393 14.4824C22.2296 14.3274 22.2138 14.2669 22.2031 14.2383C22.1271 14.0345 21.9655 13.8729 21.7617 13.7969C21.7331 13.7862 21.6726 13.7704 21.5176 13.7607C21.3558 13.7507 21.145 13.75 20.8184 13.75H17.8564C17.6918 13.75 17.5985 13.75 17.5283 13.7539C17.4867 13.7562 17.4685 13.7596 17.4629 13.7607C17.4314 13.7703 17.4014 13.7858 17.376 13.8066C17.3721 13.8105 17.3593 13.8247 17.334 13.8584C17.2918 13.9146 17.2405 13.9923 17.1494 14.1289L16.0986 15.7031C15.9509 15.9247 15.7971 16.1699 15.5762 16.3516C15.3985 16.4976 15.1937 16.6079 14.9736 16.6748C14.6998 16.758 14.4099 16.75 14.1436 16.75H9.85651C9.59012 16.75 9.30023 16.758 9.02637 16.6748C8.80627 16.6079 8.60148 16.4976 8.42383 16.3516C8.20288 16.1699 8.04907 15.9247 7.90137 15.7031L6.85059 14.1289C6.75952 13.9923 6.70825 13.9146 6.66602 13.8584C6.64072 13.8247 6.62805 13.8105 6.62402 13.8066C6.59863 13.7858 6.56863 13.7703 6.53711 13.7607C6.53149 13.7596 6.51331 13.7562 6.47168 13.7539C6.40152 13.75 6.30823 13.75 6.14355 13.75H3.18164C2.85498 13.75 2.64422 13.7507 2.48237 13.7607C2.32739 13.7704 2.26696 13.7862 2.2383 13.7969C2.03452 13.8729 1.87288 14.0345 1.79688 14.2383C1.78629 14.2669 1.77044 14.3274 1.76074 14.4824C1.75073 14.6442 1.75 14.855 1.75 15.1816C1.75 16.0376 1.75049 16.6458 1.78027 17.125C1.80969 17.5981 1.86572 17.896 1.95508 18.1357C2.28451 19.0189 2.98108 19.7155 3.86426 20.0449C4.10397 20.1343 4.40186 20.1903 4.875 20.2197C5.35425 20.2495 5.96239 20.25 6.81836 20.25V21L5.69629 20.9961C4.87637 20.9862 4.32104 20.9517 3.86523 20.8311L3.6025 20.748C2.51548 20.3426 1.65742 19.4845 1.25195 18.3975C0.999942 17.7214 1 16.8745 1 15.1816C1 14.626 1.00006 14.3135 1.06348 14.0742L1.09473 13.9756C1.22778 13.619 1.49053 13.3281 1.82715 13.1592L1.97559 13.0947C2.22905 13.0002 2.54684 13 3.18164 13H6.14355C6.45664 13 6.61377 12.9998 6.75586 13.043C6.88148 13.0812 6.99817 13.1442 7.09961 13.2275C7.21431 13.3218 7.30088 13.4524 7.47461 13.7129L8.52539 15.2871C8.69897 15.5476 8.78574 15.6782 8.90039 15.7725C9.00183 15.8558 9.11851 15.9188 9.24414 15.957C9.31524 15.9786 9.39026 15.9887 9.48633 15.9941L9.85651 16H14.1436L14.5137 15.9941C14.5616 15.9915 14.6041 15.9875 14.6436 15.9814L14.7559 15.957C14.8815 15.9188 14.9982 15.8558 15.0996 15.7725C15.2143 15.6782 15.3009 15.5476 15.4746 15.2871L16.5254 13.7129C16.6555 13.5177 16.7365 13.3952 16.8174 13.3066L16.9004 13.2275C17.0018 13.1442 17.1185 13.0812 17.2441 13.043C17.3152 13.0214 17.3903 13.0113 17.4863 13.0059L17.8564 13H20.8184C21.4532 13 21.7709 13.0002 22.0244 13.0947C22.4319 13.2468 22.7532 13.5681 22.9053 13.9756C22.9998 14.2291 23 14.5468 23 15.1816C23 16.8745 23.0001 17.7214 22.748 18.3975L22.667 18.5986C22.2348 19.5902 21.4167 20.3679 20.3975 20.748L20.1348 20.8311C19.4966 21 18.6631 21 17.1816 21V20.25C18.0376 20.25 18.6458 20.2495 19.125 20.2197C19.5981 20.1903 19.896 20.1343 20.1357 20.0449C21.0189 19.7155 21.7155 19.0189 22.0449 18.1357C22.1343 17.896 22.1903 17.5981 22.2197 17.125C22.2495 16.6458 22.25 16.0376 22.25 15.1816Z" fill={`url(#inboxGrad3-${index})`} />
                    </svg>
                  )}

                  {/* Calendar Icon */}
                  {index === 2 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={`calGrad1-${index}`} x1="12" y1="-2" x2="12" y2="19.495" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#575757" />
                          <stop offset="1" stopColor="#151515" />
                        </linearGradient>
                        <linearGradient id={`calGrad2-${index}`} x1="12" y1="7" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#E3E3E5" stopOpacity="0.6" />
                          <stop offset="1" stopColor="#BBBBC0" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id={`calGrad3-${index}`} x1="12" y1="7" x2="12" y2="15.687" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M6.4775 15.4951C7.5821 15.4951 8.4775 16.3905 8.4775 17.4951C8.4775 18.5997 7.5821 19.4951 6.4775 19.4951C5.37293 19.4951 4.4775 18.5997 4.4775 17.4951C4.4775 16.3905 5.37293 15.4951 6.4775 15.4951ZM12 15.4951C13.1046 15.4951 14 16.3905 14 17.4951C14 18.5997 13.1046 19.4951 12 19.4951C10.8954 19.4951 10 18.5997 10 17.4951C10 16.3905 10.8954 15.4951 12 15.4951ZM17.5234 15.4951C18.6278 15.4954 19.5234 16.3907 19.5234 17.4951C19.5234 18.5995 18.6278 19.4949 17.5234 19.4951C16.4189 19.4951 15.5234 18.5997 15.5234 17.4951C15.5234 16.3905 16.4189 15.4951 17.5234 15.4951ZM17 1C17.5523 1 18 1.44772 18 2V3.04C18.7846 3.08784 19.3414 3.1935 19.8164 3.4355C20.5689 3.819 21.181 4.43108 21.5645 5.18359C22.0004 6.03924 22 7.16022 22 9.40039V11H18.8428C19.259 11.3665 19.5234 11.9018 19.5234 12.5C19.5234 13.6044 18.6278 14.4997 17.5234 14.5C16.4189 14.5 15.5234 13.6046 15.5234 12.5C15.5234 11.9018 15.7869 11.3665 16.2031 11H13.3193C13.7357 11.3665 14 11.9017 14 12.5C14 13.6046 13.1046 14.5 12 14.5C10.8954 14.5 10 13.6046 10 12.5C10 11.9017 10.2643 11.3665 10.6807 11H7.79688C8.21318 11.3665 8.4775 11.9017 8.4775 12.5C8.4775 13.6046 7.5821 14.5 6.4775 14.5C5.37293 14.5 4.4775 13.6046 4.4775 12.5C4.4775 11.9017 4.74182 11.3665 5.15816 11H2V9.40039C2 7.16022 1.99963 6.03924 2.43555 5.18359C2.819 4.43108 3.43108 3.819 4.18359 3.4355C4.65859 3.1935 5.21543 3.08784 6 3.04V2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3.001C8.12943 3.00092 8.26276 3 8.40039 3H11V2C11 1.44772 11.4477 1 12 1C12.5523 1 13 1.44772 13 2V3H15.5996C15.7372 3 15.8706 3.00092 16 3.001V2C16 1.44772 16.4477 1 17 1Z" fill={`url(#calGrad1-${index})`} />
                      <path d="M15.5996 7C17.8398 7 18.9608 6.99963 19.8164 7.4356C20.5689 7.819 21.181 8.43108 21.5645 9.18359C22.0004 10.0392 22 11.1602 22 13.4004V15.5996C22 17.8398 22.0004 18.9608 21.5645 19.8164C21.181 20.5689 20.5689 21.181 19.8164 21.5645C18.9608 22.0004 17.8398 22 15.5996 22H8.40039C6.16022 22 5.03924 22.0004 4.18359 21.5645C3.43108 21.181 2.819 20.5689 2.43555 19.8164C1.99963 18.9608 2 17.8398 2 15.5996V13.4004C2 11.1602 1.99963 10.0392 2.43555 9.18359C2.819 8.43108 3.43108 7.819 4.18359 7.4356C5.03924 6.99963 6.16022 7 8.40039 7H15.5996ZM6.5 16C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19C7.32843 19 8 18.3284 8 17.5C8 16.6716 7.32843 16 6.5 16ZM12 16C11.1716 16 10.5 16.6716 10.5 17.5C10.5 18.3284 11.1716 19 12 19C12.8284 19 13.5 18.3284 13.5 17.5C13.5 16.6716 12.8284 16 12 16ZM17.5 16C16.6716 16 16 16.6716 16 17.5C16 18.3284 16.6716 19 17.5 19C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16ZM6.5 11C5.67157 11 5 11.6716 5 12.5C5 13.3284 5.67157 14 6.5 14C7.32843 14 8 13.3284 8 12.5C8 11.6716 7.32843 11 6.5 11ZM12 11C11.1716 11 10.5 11.6716 10.5 12.5C10.5 13.3284 11.1716 14 12 14C12.8284 14 13.5 13.3284 13.5 12.5C13.5 11.6716 12.8284 11 12 11ZM17.5 11C16.6716 11 16 11.6716 16 12.5C16 13.3284 16.6716 14 17.5 14C18.3284 14 19 13.3284 19 12.5C19 11.6716 18.3284 11 17.5 11Z" fill={`url(#calGrad2-${index})`} />
                      <path d="M15.5996 7C17.8398 7 18.9608 6.99963 19.8164 7.4356C20.5689 7.819 21.181 8.43108 21.5645 9.18359C22.0004 10.0392 22 11.1602 22 13.4004V15.5996C22 17.8398 22.0004 18.9608 21.5645 19.8164C21.181 20.5689 20.5689 21.181 19.8164 21.5645C18.9608 22.0004 17.8398 22 15.5996 22H8.40039C6.16022 22 5.03924 22.0004 4.18359 21.5645C3.43108 21.181 2.819 20.5689 2.43555 19.8164C1.99963 18.9608 2 17.8398 2 15.5996V13.4004C2 11.1602 1.99963 10.0392 2.43555 9.18359C2.819 8.43108 3.43108 7.819 4.18359 7.4356C5.03924 6.99963 6.16022 7 8.40039 7H15.5996ZM8.40039 7.75C7.26798 7.75 6.46335 7.75035 5.83398 7.80176C5.21336 7.85247 4.82889 7.94936 4.52441 8.10449C3.91304 8.41605 3.41605 8.91304 3.10449 9.52441C2.94936 9.82889 2.85247 10.2134 2.80176 10.834C2.75035 11.4633 2.75 12.268 2.75 13.4004V15.5996C2.75 16.732 2.75045 17.5364 2.80176 18.166C2.85235 18.7867 2.94856 19.1713 3.10352 19.4756C3.41508 20.087 3.913 20.5849 4.52441 20.8965C4.8287 21.0514 5.2133 21.1476 5.83398 21.1982C6.4636 21.2495 7.268 21.25 8.40039 21.25H15.5996C16.732 21.25 17.5364 21.2495 18.166 21.1982C18.7867 21.1476 19.1713 21.0514 19.4756 20.8965C20.087 20.5849 20.5849 20.087 20.8965 19.4756C21.0514 19.1713 21.1476 18.7867 21.1982 18.166C21.2495 17.5364 21.25 16.732 21.25 15.5996V13.4004C21.25 12.268 21.2497 11.4633 21.1982 10.834C21.1475 10.2134 21.0506 9.82889 20.8955 9.52441C20.5839 8.91304 20.087 8.41605 19.4756 8.10449C19.1711 7.94936 18.7866 7.85254 18.166 7.80176C17.5367 7.75035 16.732 7.75 15.5996 7.75H8.40039Z" fill={`url(#calGrad3-${index})`} />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 px-8 py-2 opacity-44">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
              aria-label="LinkedIn"
            >
              <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[29px] h-[29px]">
                <path d="M22.9583 3.625C23.5993 3.625 24.214 3.87961 24.6672 4.33283C25.1204 4.78604 25.375 5.40073 25.375 6.04167V22.9583C25.375 23.5993 25.1204 24.214 24.6672 24.6672C24.214 25.1204 23.5993 25.375 22.9583 25.375H6.04167C5.40073 25.375 4.78604 25.1204 4.33283 24.6672C3.87961 24.214 3.625 23.5993 3.625 22.9583V6.04167C3.625 5.40073 3.87961 4.78604 4.33283 4.33283C4.78604 3.87961 5.40073 3.625 6.04167 3.625H22.9583ZM22.3542 22.3542V15.95C22.3542 14.9053 21.9391 13.9033 21.2004 13.1646C20.4617 12.4259 19.4597 12.0108 18.415 12.0108C17.3879 12.0108 16.1917 12.6392 15.6117 13.5817V12.2404H12.2404V22.3542H15.6117V16.3971C15.6117 15.4667 16.3608 14.7054 17.2913 14.7054C17.7399 14.7054 18.1702 14.8836 18.4874 15.2009C18.8047 15.5181 18.9829 15.9484 18.9829 16.3971V22.3542H22.3542ZM8.31333 10.3433C8.85172 10.3433 9.36806 10.1295 9.74876 9.74876C10.1295 9.36806 10.3433 8.85172 10.3433 8.31333C10.3433 7.18958 9.43708 6.27125 8.31333 6.27125C7.77174 6.27125 7.25233 6.4864 6.86936 6.86936C6.4864 7.25233 6.27125 7.77174 6.27125 8.31333C6.27125 9.43708 7.18958 10.3433 8.31333 10.3433ZM9.99292 22.3542V12.2404H6.64583V22.3542H9.99292Z" fill="#020617" />
              </svg>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
              aria-label="X (Twitter)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px]">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.5859 21.375L14.0885 10.4471L14.1013 10.4574L20.8613 2.625H18.6023L13.0954 9L8.72227 2.625H2.79766L9.79723 12.8276L9.79638 12.8267L2.41406 21.375H4.67309L10.7955 14.2824L15.6613 21.375H21.5859ZM7.82719 4.32954L18.3466 19.6705H16.5564L6.02852 4.32954H7.82719Z" fill="#020617" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden pt-32">
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
                draggable
                onDragStart={(e) => handleDragStart(e as any, project)}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: draggedProject?.id === project.id ? 0.4 : 1,
                  scale: draggedProject?.id === project.id ? 0.95 : 1,
                  y: 0
                }}
                transition={{ delay: index * 0.1 }}
                className={`group cursor-grab active:cursor-grabbing ${
                  usedCardIds.has(project.id) ? 'pointer-events-none' : ''
                }`}
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
          ref={chatAreaRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex-1 flex flex-col overflow-hidden pt-[32px] pr-[32px] pb-[32px] transition-all relative"
        >
          {/* Large Rounded Container Wrapper */}
          <div className={`flex-1 bg-[#e8e7f1]/50 backdrop-blur-sm rounded-[40px] border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden transition-all ${
            isDraggingOverChat ? 'ring-4 ring-[#4a4ae8] ring-opacity-50 scale-[0.99]' : ''
          }`}>
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
                {/* Drop Indicator */}
                {isDraggingOverChat && draggedProject && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex items-center gap-[12px] bg-[#4a4ae8]/10 backdrop-blur-sm rounded-[16px] px-[20px] py-[12px] border-2 border-dashed border-[#4a4ae8]/40 mb-[20px]"
                  >
                    <img 
                      src={draggedProject.image} 
                      alt={draggedProject.title}
                      className="w-[32px] h-[32px] rounded-[8px] object-cover" 
                    />
                    <span className="text-[13px] text-[#4a4ae8] font-medium">
                      Drop to ask about {draggedProject.title.split(':')[0].trim()}
                    </span>
                  </motion.div>
                )}
                
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

                          {message.type === 'card-with-question' && message.attachedProject && (
                            <div className="flex flex-col items-end gap-[12px] w-full">
                              {/* Attached Project Card */}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
                                animate={{ opacity: 1, scale: 1, rotate: 4 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                                className="relative w-[180px] h-[112px] rounded-[14px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.2)] border-[3px] border-white/90"
                                style={{ transformOrigin: 'bottom right' }}
                              >
                                <img 
                                  src={message.attachedProject.image} 
                                  alt={message.attachedProject.title}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>

                              {/* Question Bubble */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.25 }}
                                className="bg-gradient-to-r from-[#4a4ae8] to-[#4a4ae8] rounded-[20px] px-[20px] py-[16px] shadow-[0_4px_16px_rgba(74,74,232,0.25)] max-w-[85%]"
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
                  <div className="flex items-center gap-[12px] bg-white/40 backdrop-blur-[20px] rounded-[20px] px-[20px] py-[14px] border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.06),_0_1px_3px_rgba(0,0,0,0.04)]">
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
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.cdnfonts.com/css/nexa-bold');
        
        body, * {
          font-family: 'Geist', system-ui, -apple-system, sans-serif;
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
