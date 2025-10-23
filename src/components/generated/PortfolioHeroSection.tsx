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
    <div className="h-screen w-screen bg-[#d9d7e4] flex overflow-hidden font-['Geist',_system-ui,_sans-serif]">
      {/* Left Icon Sidebar */}
      <div className="w-[88px] bg-transparent flex flex-col items-center justify-center gap-[31px]">
        {/* Active Button - Chat */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[60px] h-[60px] rounded-[4444px] border border-white flex items-center justify-center p-[18px]"
          style={{
            background: '#283FE4',
            boxShadow: '30px 41px 14px 0 rgba(0, 0, 0, 0.00), 19px 26px 13px 0 rgba(0, 0, 0, 0.01), 11px 15px 11px 0 rgba(0, 0, 0, 0.05), 5px 7px 8px 0 rgba(0, 0, 0, 0.09), 1px 2px 4px 0 rgba(0, 0, 0, 0.10)'
          }}
          aria-label="Chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_347_3" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <path d="M24 0H0V24H24V0Z" fill="white"/>
              <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill="black"/>
            </mask>
            <g mask="url(#mask0_347_3)">
              <path d="M1 9.99348C1.00003 11.624 1.44063 13.1472 2.19626 14.4646C2.38601 14.9255 2.27792 15.4945 2.15636 15.9568C1.97097 16.6619 1.62172 17.3398 1.21379 17.7485C1.0104 17.9522 0.945503 18.2561 1.04846 18.525C1.1515 18.7939 1.40329 18.9771 1.69077 18.9927C2.51536 19.0372 3.42875 18.8742 4.22582 18.6419C4.83702 18.4638 5.42053 18.2318 5.88387 17.9889C7.15411 18.645 8.57122 18.9955 10.0009 18.9955C14.9719 18.9954 18.9997 14.9668 19 9.99728C19 5.05316 15.0118 1.04141 10.0779 1C5.1088 1.00007 1 5.02371 1 9.99348Z" fill="url(#paint0_linear_347_3)"/>
            </g>
            <mask id="mask1_347_3" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="8" y="7" width="15" height="15">
              <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill="white"/>
            </mask>
            <g mask="url(#mask1_347_3)">
              <g filter="url(#filter0_f_347_3)">
                <path d="M1 9.99348C1.00003 11.624 1.44063 13.1472 2.19626 14.4646C2.38601 14.9255 2.27792 15.4945 2.15636 15.9568C1.97097 16.6619 1.62172 17.3398 1.21379 17.7485C1.0104 17.9522 0.945503 18.2561 1.04846 18.525C1.1515 18.7939 1.40329 18.9771 1.69077 18.9927C2.51536 19.0372 3.42875 18.8742 4.22582 18.6419C4.83702 18.4638 5.42053 18.2318 5.88387 17.9889C7.15411 18.645 8.57122 18.9955 10.0009 18.9955C14.9719 18.9954 18.9997 14.9668 19 9.99728C19 5.05316 15.0118 1.04141 10.0779 1C5.1088 1.00007 1 5.02371 1 9.99348Z" fill="url(#paint1_linear_347_3)"/>
              </g>
            </g>
            <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill="url(#paint2_linear_347_3)"/>
            <path d="M22 14.4971C22 11.0214 19.2686 8.18279 15.835 8.00879L15.501 8C11.9118 8 9 10.9122 9 14.5C9.0002 18.0874 11.9088 20.9959 15.499 20.9961V21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461V20.9961C16.5025 20.9961 17.4992 20.7574 18.3994 20.3066C18.6109 20.2007 18.8599 20.2016 19.0713 20.3076C19.389 20.467 19.7847 20.6214 20.1992 20.7422C20.7163 20.8928 21.2777 20.9965 21.7852 21L22 20.9951C21.684 20.6784 21.3597 20.1509 21.1582 19.6211C21.0549 19.3495 20.9707 19.0451 20.9453 18.7373C20.9203 18.4343 20.9483 18.0728 21.127 17.7383L21.1377 17.7188C21.6146 16.886 21.9171 15.9424 21.9854 14.9336L22 14.4971Z" fill="url(#paint3_linear_347_3)"/>
            <defs>
              <filter id="filter0_f_347_3" x="-3" y="-3" width="26" height="26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_347_3"/>
              </filter>
              <linearGradient id="paint0_linear_347_3" x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0.34"/>
              </linearGradient>
              <linearGradient id="paint1_linear_347_3" x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0.34"/>
              </linearGradient>
              <linearGradient id="paint2_linear_347_3" x1="15.5" y1="7.25" x2="15.5" y2="21.75" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0.6"/>
                <stop offset="1" stopColor="white" stopOpacity="0.6"/>
              </linearGradient>
              <linearGradient id="paint3_linear_347_3" x1="15.5" y1="7.25" x2="15.5" y2="15.647" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </motion.button>

        {/* Inactive Button - Projects */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[60px] h-[60px] rounded-[4444px] bg-[#E4E5F3] flex items-center justify-center p-[18px]"
          aria-label="Projects"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_349_53)">
              <mask id="mask0_349_53" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <path d="M24 0H0V24H24V0Z" fill="white"/>
                <path d="M17.1818 21C18.8751 21 19.7217 21 20.3979 20.7478C21.4849 20.3424 22.3424 19.4849 22.7478 18.3979C23 17.7217 23 16.8751 23 15.1818C23 14.5469 23 14.2294 22.9054 13.9758C22.7534 13.5682 22.4318 13.2466 22.0242 13.0946C21.7706 13 21.4531 13 20.8182 13H17.8563C17.5432 13 17.3867 13 17.2446 13.0432C17.1188 13.0814 17.0018 13.144 16.9002 13.2275C16.7855 13.3217 16.6987 13.452 16.525 13.7125L15.475 15.2875C15.3013 15.548 15.2145 15.6783 15.0998 15.7725C14.9982 15.856 14.8812 15.9186 14.7554 15.9568C14.6133 16 14.4568 16 14.1437 16H9.85629C9.54322 16 9.38669 16 9.2446 15.9568C9.11881 15.9186 9.00179 15.856 8.90022 15.7725C8.7855 15.6783 8.69867 15.548 8.52501 15.2875L7.47499 13.7125C7.30133 13.452 7.2145 13.3217 7.09977 13.2275C6.99821 13.144 6.88119 13.0814 6.7554 13.0432C6.61331 13 6.45678 13 6.14371 13H3.18182C2.54685 13 2.22937 13 1.9758 13.0946C1.56816 13.2466 1.24662 13.5682 1.09458 13.9758C1 14.2294 1 14.5469 1 15.1818C1 16.8751 1 17.7217 1.2522 18.3979C1.65765 19.4849 2.5151 20.3424 3.60214 20.7478C4.27832 21 5.12494 21 6.81818 21H17.1818Z" fill="black"/>
              </mask>
              <g mask="url(#mask0_349_53)">
                <path d="M22.3989 14.9955L21.1412 7.04959C20.9136 5.61187 20.7999 4.89301 20.4453 4.35311C20.1327 3.87724 19.6912 3.50013 19.1724 3.26583C18.5837 3 17.8558 3 16.4002 3L7.60062 3.00003C6.14497 3.00003 5.41714 3.00003 4.82844 3.26587C4.30956 3.50018 3.86806 3.8773 3.55552 4.35318C3.20093 4.89309 3.08716 5.61197 2.85963 7.04973L1.60205 14.9962C3.9778 16.0307 6.8249 18.0001 9.50026 18.0001L14.5003 18C17.1756 18 20.0231 16.0302 22.3989 14.9955Z" fill="url(#paint0_linear_349_53)"/>
              </g>
              <mask id="mask1_349_53" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1" y="13" width="22" height="8">
                <path d="M17.1818 21C18.8751 21 19.7217 21 20.3979 20.7478C21.4849 20.3424 22.3424 19.4849 22.7478 18.3979C23 17.7217 23 16.8751 23 15.1818C23 14.5469 23 14.2294 22.9054 13.9758C22.7534 13.5682 22.4318 13.2466 22.0242 13.0946C21.7706 13 21.4531 13 20.8182 13H17.8563C17.5432 13 17.3867 13 17.2446 13.0432C17.1188 13.0814 17.0018 13.144 16.9002 13.2275C16.7855 13.3217 16.6987 13.452 16.525 13.7125L15.475 15.2875C15.3013 15.548 15.2145 15.6783 15.0998 15.7725C14.9982 15.856 14.8812 15.9186 14.7554 15.9568C14.6133 16 14.4568 16 14.1437 16H9.85629C9.54322 16 9.38669 16 9.2446 15.9568C9.11881 15.9186 9.00179 15.856 8.90022 15.7725C8.7855 15.6783 8.69867 15.548 8.52501 15.2875L7.47499 13.7125C7.30133 13.452 7.2145 13.3217 7.09977 13.2275C6.99821 13.144 6.88119 13.0814 6.7554 13.0432C6.61331 13 6.45678 13 6.14371 13H3.18182C2.54685 13 2.22937 13 1.9758 13.0946C1.56816 13.2466 1.24662 13.5682 1.09458 13.9758C1 14.2294 1 14.5469 1 15.1818C1 16.8751 1 17.7217 1.2522 18.3979C1.65765 19.4849 2.5151 20.3424 3.60214 20.7478C4.27832 21 5.12494 21 6.81818 21H17.1818Z" fill="white"/>
              </mask>
              <g mask="url(#mask1_349_53)">
                <g filter="url(#filter0_f_349_53)">
                  <path d="M22.3989 14.9955L21.1412 7.04959C20.9136 5.61187 20.7999 4.89301 20.4453 4.35311C20.1327 3.87724 19.6912 3.50013 19.1724 3.26583C18.5837 3 17.8558 3 16.4002 3L7.60062 3.00003C6.14497 3.00003 5.41714 3.00003 4.82844 3.26587C4.30956 3.50018 3.86806 3.8773 3.55552 4.35318C3.20093 4.89309 3.08716 5.61197 2.85963 7.04973L1.60205 14.9962C3.9778 16.0307 6.8249 18.0001 9.50026 18.0001L14.5003 18C17.1756 18 20.0231 16.0302 22.3989 14.9955Z" fill="url(#paint1_linear_349_53)"/>
                </g>
              </g>
              <path d="M17.1818 21C18.8751 21 19.7217 21 20.3979 20.7478C21.4849 20.3424 22.3424 19.4849 22.7478 18.3979C23 17.7217 23 16.8751 23 15.1818C23 14.5469 23 14.2294 22.9054 13.9758C22.7534 13.5682 22.4318 13.2466 22.0242 13.0946C21.7706 13 21.4531 13 20.8182 13H17.8563C17.5432 13 17.3867 13 17.2446 13.0432C17.1188 13.0814 17.0018 13.144 16.9002 13.2275C16.7855 13.3217 16.6987 13.452 16.525 13.7125L15.475 15.2875C15.3013 15.548 15.2145 15.6783 15.0998 15.7725C14.9982 15.856 14.8812 15.9186 14.7554 15.9568C14.6133 16 14.4568 16 14.1437 16H9.85629C9.54322 16 9.38669 16 9.2446 15.9568C9.11881 15.9186 9.00179 15.856 8.90022 15.7725C8.7855 15.6783 8.69867 15.548 8.52501 15.2875L7.47499 13.7125C7.30133 13.452 7.2145 13.3217 7.09977 13.2275C6.99821 13.144 6.88119 13.0814 6.7554 13.0432C6.61331 13 6.45678 13 6.14371 13H3.18182C2.54685 13 2.22937 13 1.9758 13.0946C1.56816 13.2466 1.24662 13.5682 1.09458 13.9758C1 14.2294 1 14.5469 1 15.1818C1 16.8751 1 17.7217 1.2522 18.3979C1.65765 19.4849 2.5151 20.3424 3.60214 20.7478C4.27832 21 5.12494 21 6.81818 21H17.1818Z" fill="url(#paint2_linear_349_53)"/>
              <path d="M17.1816 20.25V21H6.81836V20.25H17.1816ZM22.25 15.1816C22.25 14.855 22.2493 14.6442 22.2393 14.4824C22.2296 14.3274 22.2138 14.2669 22.2031 14.2383C22.1271 14.0345 21.9655 13.8729 21.7617 13.7969C21.7331 13.7862 21.6726 13.7704 21.5176 13.7607C21.3558 13.7507 21.145 13.75 20.8184 13.75H17.8564C17.6918 13.75 17.5985 13.75 17.5283 13.7539C17.4867 13.7562 17.4685 13.7596 17.4629 13.7607C17.4314 13.7703 17.4014 13.7858 17.376 13.8066C17.3721 13.8105 17.3593 13.8247 17.334 13.8584C17.2918 13.9146 17.2405 13.9923 17.1494 14.1289L16.0986 15.7031C15.9509 15.9247 15.7971 16.1699 15.5762 16.3516C15.3985 16.4976 15.1937 16.6079 14.9736 16.6748C14.6998 16.758 14.4099 16.75 14.1436 16.75H9.85645C9.59007 16.75 9.30018 16.758 9.02637 16.6748C8.8063 16.6079 8.60151 16.4976 8.42383 16.3516C8.20291 16.1699 8.04906 15.9247 7.90137 15.7031L6.85059 14.1289C6.75951 13.9923 6.70817 13.9146 6.66602 13.8584C6.64071 13.8247 6.62795 13.8105 6.62402 13.8066C6.59863 13.7858 6.56856 13.7703 6.53711 13.7607C6.53152 13.7596 6.51327 13.7562 6.47168 13.7539C6.40149 13.75 6.3082 13.75 6.14355 13.75H3.18164C2.85505 13.75 2.64419 13.7507 2.48242 13.7607C2.32739 13.7704 2.26695 13.7862 2.23828 13.7969C2.03446 13.8729 1.8729 14.0345 1.79688 14.2383C1.78625 14.2669 1.77037 14.3274 1.76074 14.4824C1.75071 14.6442 1.75 14.855 1.75 15.1816C1.75 16.0376 1.75053 16.6458 1.78027 17.125C1.80966 17.5981 1.86566 17.896 1.95508 18.1357C2.2845 19.0189 2.98107 19.7155 3.86426 20.0449C4.104 20.1343 4.40186 20.1903 4.875 20.2197C5.35421 20.2495 5.96243 20.25 6.81836 20.25V21L5.69629 20.9961C4.87637 20.9862 4.32102 20.9517 3.86523 20.8311L3.60254 20.748C2.51549 20.3426 1.6574 19.4845 1.25195 18.3975C0.999912 17.7214 1 16.8745 1 15.1816C1 14.626 1.00008 14.3135 1.06348 14.0742L1.09473 13.9756C1.2278 13.619 1.49047 13.3281 1.82715 13.1592L1.97559 13.0947C2.22913 13.0002 2.54679 13 3.18164 13H6.14355C6.45663 13 6.61377 12.9998 6.75586 13.043C6.88149 13.0812 6.99816 13.1442 7.09961 13.2275C7.21433 13.3218 7.30095 13.4524 7.47461 13.7129L8.52539 15.2871C8.69905 15.5476 8.78567 15.6782 8.90039 15.7725C9.00184 15.8558 9.11851 15.9188 9.24414 15.957C9.31518 15.9786 9.39031 15.9887 9.48633 15.9941L9.85645 16H14.1436L14.5137 15.9941C14.5616 15.9915 14.6041 15.9875 14.6436 15.9814L14.7559 15.957C14.8815 15.9188 14.9982 15.8558 15.0996 15.7725C15.2143 15.6782 15.3009 15.5476 15.4746 15.2871L16.5254 13.7129C16.6555 13.5177 16.7365 13.3952 16.8174 13.3066L16.9004 13.2275C17.0018 13.1442 17.1185 13.0812 17.2441 13.043C17.3152 13.0214 17.3903 13.0113 17.4863 13.0059L17.8564 13H20.8184C21.4532 13 21.7709 13.0002 22.0244 13.0947C22.4319 13.2468 22.7532 13.5681 22.9053 13.9756C22.9998 14.2291 23 14.5468 23 15.1816C23 16.8745 23.0001 17.7214 22.748 18.3975L22.667 18.5986C22.2348 19.5902 21.4167 20.3679 20.3975 20.748L20.1348 20.8311C19.4966 21 18.6631 21 17.1816 21V20.25C18.0376 20.25 18.6458 20.2495 19.125 20.2197C19.5981 20.1903 19.896 20.1343 20.1357 20.0449C21.0189 19.7155 21.7155 19.0189 22.0449 18.1357C22.1343 17.896 22.1903 17.5981 22.2197 17.125C22.2495 16.6458 22.25 16.0376 22.25 15.1816Z" fill="url(#paint3_linear_349_53)"/>
            </g>
            <defs>
              <filter id="filter0_f_349_53" x="-2.39795" y="-1" width="28.7969" height="23" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_349_53"/>
              </filter>
              <linearGradient id="paint0_linear_349_53" x1="12.0002" y1="3.00006" x2="12.0002" y2="18.0001" gradientUnits="userSpaceOnUse">
                <stop stopColor="#575757"/>
                <stop offset="1" stopColor="#151515"/>
              </linearGradient>
              <linearGradient id="paint1_linear_349_53" x1="12.0002" y1="3.00006" x2="12.0002" y2="18.0001" gradientUnits="userSpaceOnUse">
                <stop stopColor="#575757"/>
                <stop offset="1" stopColor="#151515"/>
              </linearGradient>
              <linearGradient id="paint2_linear_349_53" x1="23" y1="17" x2="1" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E3E3E5" stopOpacity="0.6"/>
                <stop offset="1" stopColor="#BBBBC0" stopOpacity="0.6"/>
              </linearGradient>
              <linearGradient id="paint3_linear_349_53" x1="12" y1="13" x2="12" y2="17.633" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
              <clipPath id="clip0_349_53">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </motion.button>

        {/* Inactive Button - Calendar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[60px] h-[60px] rounded-[4444px] bg-[#E4E5F3] flex items-center justify-center p-[18px]"
          aria-label="Calendar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_349_68)">
              <mask id="mask0_349_68" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <path d="M24 0H0V24H24V0Z" fill="white"/>
                <path d="M15.5996 7C17.8398 7 18.9608 6.99957 19.8164 7.43555C20.5689 7.81902 21.181 8.43109 21.5645 9.18359C22.0004 10.0392 22 11.1602 22 13.4004V15.5996C22 17.8398 22.0004 18.9608 21.5645 19.8164C21.181 20.5689 20.5689 21.181 19.8164 21.5645C18.9608 22.0004 17.8398 22 15.5996 22H8.40039C6.16018 22 5.03924 22.0004 4.18359 21.5645C3.43109 21.181 2.81902 20.5689 2.43555 19.8164C1.99957 18.9608 2 17.8398 2 15.5996V13.4004C2 11.1602 1.99957 10.0392 2.43555 9.18359C2.81902 8.43109 3.43109 7.81902 4.18359 7.43555C5.03924 6.99957 6.16018 7 8.40039 7H15.5996ZM6.5 16C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19C7.32843 19 8 18.3284 8 17.5C8 16.6716 7.32843 16 6.5 16ZM12 16C11.1716 16 10.5 16.6716 10.5 17.5C10.5 18.3284 11.1716 19 12 19C12.8284 19 13.5 18.3284 13.5 17.5C13.5 16.6716 12.8284 16 12 16ZM17.5 16C16.6716 16 16 16.6716 16 17.5C16 18.3284 16.6716 19 17.5 19C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16ZM6.5 11C5.67157 11 5 11.6716 5 12.5C5 13.3284 5.67157 14 6.5 14C7.32843 14 8 13.3284 8 12.5C8 11.6716 7.32843 11 6.5 11ZM12 11C11.1716 11 10.5 11.6716 10.5 12.5C10.5 13.3284 11.1716 14 12 14C12.8284 14 13.5 13.3284 13.5 12.5C13.5 11.6716 12.8284 11 12 11ZM17.5 11C16.6716 11 16 11.6716 16 12.5C16 13.3284 16.6716 14 17.5 14C18.3284 14 19 13.3284 19 12.5C19 11.6716 18.3284 11 17.5 11Z" fill="black"/>
              </mask>
              <g mask="url(#mask0_349_68)">
                <path d="M6.47754 15.4951C7.58211 15.4951 8.47754 16.3905 8.47754 17.4951C8.47754 18.5997 7.58211 19.4951 6.47754 19.4951C5.37297 19.4951 4.47754 18.5997 4.47754 17.4951C4.47754 16.3905 5.37297 15.4951 6.47754 15.4951ZM12 15.4951C13.1046 15.4951 14 16.3905 14 17.4951C14 18.5997 13.1046 19.4951 12 19.4951C10.8954 19.4951 10 18.5997 10 17.4951C10 16.3905 10.8954 15.4951 12 15.4951ZM17.5234 15.4951C18.6278 15.4954 19.5234 16.3907 19.5234 17.4951C19.5234 18.5995 18.6278 19.4949 17.5234 19.4951C16.4189 19.4951 15.5234 18.5997 15.5234 17.4951C15.5234 16.3905 16.4189 15.4951 17.5234 15.4951ZM17 1C17.5523 1 18 1.44772 18 2V3.04004C18.7846 3.08782 19.3414 3.19353 19.8164 3.43555C20.5689 3.81902 21.181 4.43109 21.5645 5.18359C22.0004 6.03924 22 7.16018 22 9.40039V11H18.8428C19.259 11.3665 19.5234 11.9018 19.5234 12.5C19.5234 13.6044 18.6278 14.4997 17.5234 14.5C16.4189 14.5 15.5234 13.6046 15.5234 12.5C15.5234 11.9018 15.7869 11.3665 16.2031 11H13.3193C13.7357 11.3665 14 11.9017 14 12.5C14 13.6046 13.1046 14.5 12 14.5C10.8954 14.5 10 13.6046 10 12.5C10 11.9017 10.2643 11.3665 10.6807 11H7.79688C8.21325 11.3665 8.47754 11.9017 8.47754 12.5C8.47754 13.6046 7.58211 14.5 6.47754 14.5C5.37297 14.5 4.47754 13.6046 4.47754 12.5C4.47754 11.9017 4.74183 11.3665 5.1582 11H2V9.40039C2 7.16018 1.99957 6.03924 2.43555 5.18359C2.81902 4.43109 3.43109 3.81902 4.18359 3.43555C4.65858 3.19353 5.21543 3.08782 6 3.04004V2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3.00098C8.12937 3.00088 8.26277 3 8.40039 3H11V2C11 1.44772 11.4477 1 12 1C12.5523 1 13 1.44772 13 2V3H15.5996C15.7372 3 15.8706 3.00088 16 3.00098V2C16 1.44772 16.4477 1 17 1Z" fill="url(#paint0_linear_349_68)"/>
              </g>
              <mask id="mask1_349_68" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="2" y="7" width="20" height="15">
                <path d="M15.5996 7C17.8398 7 18.9608 6.99957 19.8164 7.43555C20.5689 7.81902 21.181 8.43109 21.5645 9.18359C22.0004 10.0392 22 11.1602 22 13.4004V15.5996C22 17.8398 22.0004 18.9608 21.5645 19.8164C21.181 20.5689 20.5689 21.181 19.8164 21.5645C18.9608 22.0004 17.8398 22 15.5996 22H8.40039C6.16018 22 5.03924 22.0004 4.18359 21.5645C3.43109 21.181 2.81902 20.5689 2.43555 19.8164C1.99957 18.9608 2 17.8398 2 15.5996V13.4004C2 11.1602 1.99957 10.0392 2.43555 9.18359C2.81902 8.43109 3.43109 7.81902 4.18359 7.43555C5.03924 6.99957 6.16018 7 8.40039 7H15.5996ZM6.5 16C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19C7.32843 19 8 18.3284 8 17.5C8 16.6716 7.32843 16 6.5 16ZM12 16C11.1716 16 10.5 16.6716 10.5 17.5C10.5 18.3284 11.1716 19 12 19C12.8284 19 13.5 18.3284 13.5 17.5C13.5 16.6716 12.8284 16 12 16ZM17.5 16C16.6716 16 16 16.6716 16 17.5C16 18.3284 16.6716 19 17.5 19C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16ZM6.5 11C5.67157 11 5 11.6716 5 12.5C5 13.3284 5.67157 14 6.5 14C7.32843 14 8 13.3284 8 12.5C8 11.6716 7.32843 11 6.5 11ZM12 11C11.1716 11 10.5 11.6716 10.5 12.5C10.5 13.3284 11.1716 14 12 14C12.8284 14 13.5 13.3284 13.5 12.5C13.5 11.6716 12.8284 11 12 11ZM17.5 11C16.6716 11 16 11.6716 16 12.5C16 13.3284 16.6716 14 17.5 14C18.3284 14 19 13.3284 19 12.5C19 11.6716 18.3284 11 17.5 11Z" fill="white"/>
              </mask>
              <g mask="url(#mask1_349_68)">
                <g filter="url(#filter0_f_349_68)">
                  <path d="M6.47754 15.4951C7.58211 15.4951 8.47754 16.3905 8.47754 17.4951C8.47754 18.5997 7.58211 19.4951 6.47754 19.4951C5.37297 19.4951 4.47754 18.5997 4.47754 17.4951C4.47754 16.3905 5.37297 15.4951 6.47754 15.4951ZM12 15.4951C13.1046 15.4951 14 16.3905 14 17.4951C14 18.5997 13.1046 19.4951 12 19.4951C10.8954 19.4951 10 18.5997 10 17.4951C10 16.3905 10.8954 15.4951 12 15.4951ZM17.5234 15.4951C18.6278 15.4954 19.5234 16.3907 19.5234 17.4951C19.5234 18.5995 18.6278 19.4949 17.5234 19.4951C16.4189 19.4951 15.5234 18.5997 15.5234 17.4951C15.5234 16.3905 16.4189 15.4951 17.5234 15.4951ZM17 1C17.5523 1 18 1.44772 18 2V3.04004C18.7846 3.08782 19.3414 3.19353 19.8164 3.43555C20.5689 3.81902 21.181 4.43109 21.5645 5.18359C22.0004 6.03924 22 7.16018 22 9.40039V11H18.8428C19.259 11.3665 19.5234 11.9018 19.5234 12.5C19.5234 13.6044 18.6278 14.4997 17.5234 14.5C16.4189 14.5 15.5234 13.6046 15.5234 12.5C15.5234 11.9018 15.7869 11.3665 16.2031 11H13.3193C13.7357 11.3665 14 11.9017 14 12.5C14 13.6046 13.1046 14.5 12 14.5C10.8954 14.5 10 13.6046 10 12.5C10 11.9017 10.2643 11.3665 10.6807 11H7.79688C8.21325 11.3665 8.47754 11.9017 8.47754 12.5C8.47754 13.6046 7.58211 14.5 6.47754 14.5C5.37297 14.5 4.47754 13.6046 4.47754 12.5C4.47754 11.9017 4.74183 11.3665 5.1582 11H2V9.40039C2 7.16018 1.99957 6.03924 2.43555 5.18359C2.81902 4.43109 3.43109 3.81902 4.18359 3.43555C4.65858 3.19353 5.21543 3.08782 6 3.04004V2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3.00098C8.12937 3.00088 8.26277 3 8.40039 3H11V2C11 1.44772 11.4477 1 12 1C12.5523 1 13 1.44772 13 2V3H15.5996C15.7372 3 15.8706 3.00088 16 3.00098V2C16 1.44772 16.4477 1 17 1Z" fill="url(#paint1_linear_349_68)"/>
                </g>
              </g>
              <path d="M15.5996 7C17.8398 7 18.9608 6.99957 19.8164 7.43555C20.5689 7.81902 21.181 8.43109 21.5645 9.18359C22.0004 10.0392 22 11.1602 22 13.4004V15.5996C22 17.8398 22.0004 18.9608 21.5645 19.8164C21.181 20.5689 20.5689 21.181 19.8164 21.5645C18.9608 22.0004 17.8398 22 15.5996 22H8.40039C6.16018 22 5.03924 22.0004 4.18359 21.5645C3.43109 21.181 2.81902 20.5689 2.43555 19.8164C1.99957 18.9608 2 17.8398 2 15.5996V13.4004C2 11.1602 1.99957 10.0392 2.43555 9.18359C2.81902 8.43109 3.43109 7.81902 4.18359 7.43555C5.03924 6.99957 6.16018 7 8.40039 7H15.5996ZM6.5 16C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19C7.32843 19 8 18.3284 8 17.5C8 16.6716 7.32843 16 6.5 16ZM12 16C11.1716 16 10.5 16.6716 10.5 17.5C10.5 18.3284 11.1716 19 12 19C12.8284 19 13.5 18.3284 13.5 17.5C13.5 16.6716 12.8284 16 12 16ZM17.5 16C16.6716 16 16 16.6716 16 17.5C16 18.3284 16.6716 19 17.5 19C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16ZM6.5 11C5.67157 11 5 11.6716 5 12.5C5 13.3284 5.67157 14 6.5 14C7.32843 14 8 13.3284 8 12.5C8 11.6716 7.32843 11 6.5 11ZM12 11C11.1716 11 10.5 11.6716 10.5 12.5C10.5 13.3284 11.1716 14 12 14C12.8284 14 13.5 13.3284 13.5 12.5C13.5 11.6716 12.8284 11 12 11ZM17.5 11C16.6716 11 16 11.6716 16 12.5C16 13.3284 16.6716 14 17.5 14C18.3284 14 19 13.3284 19 12.5C19 11.6716 18.3284 11 17.5 11Z" fill="url(#paint2_linear_349_68)"/>
              <path d="M15.5996 7C17.8398 7 18.9608 6.99957 19.8164 7.43555C20.5689 7.81902 21.181 8.43109 21.5645 9.18359C22.0004 10.0392 22 11.1602 22 13.4004V15.5996C22 17.8398 22.0004 18.9608 21.5645 19.8164C21.181 20.5689 20.5689 21.181 19.8164 21.5645C18.9608 22.0004 17.8398 22 15.5996 22H8.40039C6.16018 22 5.03924 22.0004 4.18359 21.5645C3.43109 21.181 2.81902 20.5689 2.43555 19.8164C1.99957 18.9608 2 17.8398 2 15.5996V13.4004C2 11.1602 1.99957 10.0392 2.43555 9.18359C2.81902 8.43109 3.43109 7.81902 4.18359 7.43555C5.03924 6.99957 6.16018 7 8.40039 7H15.5996ZM8.40039 7.75C7.26798 7.75 6.46335 7.75035 5.83398 7.80176C5.21336 7.85247 4.82889 7.94936 4.52441 8.10449C3.91304 8.41605 3.41605 8.91304 3.10449 9.52441C2.94936 9.82889 2.85247 10.2134 2.80176 10.834C2.75035 11.4633 2.75 12.268 2.75 13.4004V15.5996C2.75 16.732 2.75045 17.5364 2.80176 18.166C2.85235 18.7867 2.94856 19.1713 3.10352 19.4756C3.41508 20.087 3.913 20.5849 4.52441 20.8965C4.8287 21.0514 5.2133 21.1476 5.83398 21.1982C6.4636 21.2495 7.268 21.25 8.40039 21.25H15.5996C16.732 21.25 17.5364 21.2495 18.166 21.1982C18.7867 21.1476 19.1713 21.0514 19.4756 20.8965C20.087 20.5849 20.5849 20.087 20.8965 19.4756C21.0514 19.1713 21.1476 18.7867 21.1982 18.166C21.2495 17.5364 21.25 16.732 21.25 15.5996V13.4004C21.25 12.268 21.2497 11.4633 21.1982 10.834C21.1475 10.2134 21.0506 9.82889 20.8955 9.52441C20.5839 8.91304 20.087 8.41605 19.4756 8.10449C19.1711 7.94936 18.7866 7.85247 18.166 7.80176C17.5367 7.75035 16.732 7.75 15.5996 7.75H8.40039Z" fill="url(#paint3_linear_349_68)"/>
            </g>
            <defs>
              <filter id="filter0_f_349_68" x="-2" y="-3" width="28" height="26.4951" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_349_68"/>
              </filter>
              <linearGradient id="paint0_linear_349_68" x1="12" y1="-2" x2="12" y2="19.495" gradientUnits="userSpaceOnUse">
                <stop stopColor="#575757"/>
                <stop offset="1" stopColor="#151515"/>
              </linearGradient>
              <linearGradient id="paint1_linear_349_68" x1="12" y1="-2" x2="12" y2="19.495" gradientUnits="userSpaceOnUse">
                <stop stopColor="#575757"/>
                <stop offset="1" stopColor="#151515"/>
              </linearGradient>
              <linearGradient id="paint2_linear_349_68" x1="12" y1="7" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E3E3E5" stopOpacity="0.6"/>
                <stop offset="1" stopColor="#BBBBC0" stopOpacity="0.6"/>
              </linearGradient>
              <linearGradient id="paint3_linear_349_68" x1="12" y1="7" x2="12" y2="15.687" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
              <clipPath id="clip0_349_68">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
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
