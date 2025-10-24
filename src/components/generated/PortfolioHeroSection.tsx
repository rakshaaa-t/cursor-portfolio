"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { sendToAI, getFallbackResponse, type ChatMessage } from "../../lib/ai-chat";
import { AI_CONFIG } from "../../lib/config";

export interface RakshaPortfolioProps {}

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

const SUGGESTION_PILLS = [
  {
    id: 1,
    text: "tell me more about ova"
  },
  {
    id: 2,
    text: "what is your design process?"
  },
  {
    id: 3,
    text: "what tools do you use ?"
  }
] as const;

const PROJECT_CARDS = [
  {
    id: 1,
    title: "ova : period tracking app",
    gradient: "from-blue-100 via-purple-100 to-pink-100",
    bgGradient: "from-blue-200 to-purple-200"
  },
  {
    id: 2,
    title: "greex : defi trading platform",
    gradient: "from-gray-800 to-gray-900",
    bgGradient: "from-gray-700 to-black"
  },
  {
    id: 3,
    title: "ioc : vendor management app",
    gradient: "from-white to-gray-100",
    bgGradient: "from-gray-50 to-gray-200"
  },
  {
    id: 4,
    title: "dealdoc : deal management...",
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-500 to-blue-700"
  }
] as const;

export const PortfolioHeroSection: React.FC<RakshaPortfolioProps> = (props: RakshaPortfolioProps) => {
  const [activeNav, setActiveNav] = React.useState<"chat" | "inbox" | "calendar">("chat");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const [isPlaceholderHovered, setIsPlaceholderHovered] = React.useState(false);
  const [showAlternateText, setShowAlternateText] = React.useState(false);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: textToSend,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send to AI
      const response = await sendToAI(textToSend, messages, AI_CONFIG.API_KEY);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: response.message,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: getFallbackResponse(textToSend),
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#D8D4E8] overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute w-[1472px] h-[761px] -left-[227px] top-[281px] bg-[rgba(0,132,255,0.1)] rounded-[4444px] blur-[200px] pointer-events-none" />
      <div className="absolute w-[1629px] h-[842px] left-[474px] top-[617px] bg-white rounded-[4444px] blur-[200px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed left-1/2 -translate-x-1/2 top-[40px] z-50 w-[1546px] h-[68px]">
        <div className="flex items-center justify-between px-[12px] py-[4px] gap-[563px] bg-white/[0.01] backdrop-blur-[11px] rounded-full h-full">
          {/* Logo - "raks" */}
          <div className="flex items-center justify-center">
            <span
              className="text-[36px] leading-[47px] font-medium text-white text-center w-[87px] h-[47px]"
              style={{ fontFamily: 'Neulis Cursive, system-ui, sans-serif' }}
            >
              raks
            </span>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center justify-center gap-[28px] w-[236px] h-[60px]">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative z-10">
                      <g clipPath="url(#clip0_371_216)">
                        <mask id={`mask0_371_216_${index}`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                          <path d="M24 0H0V24H24V0Z" fill="white"/>
                          <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill="black"/>
                        </mask>
                        <g mask={`url(#mask0_371_216_${index})`}>
                          <path d="M1 9.99348C1.00003 11.624 1.44063 13.1472 2.19626 14.4646C2.38601 14.9255 2.27792 15.4945 2.15636 15.9568C1.97097 16.6619 1.62172 17.3398 1.21379 17.7485C1.0104 17.9522 0.945503 18.2561 1.04846 18.525C1.1515 18.7939 1.40329 18.9771 1.69077 18.9927C2.51536 19.0372 3.42875 18.8742 4.22582 18.6419C4.83702 18.4638 5.42053 18.2318 5.88387 17.9889C7.15411 18.645 8.57122 18.9955 10.0009 18.9955C14.9719 18.9954 18.9997 14.9668 19 9.99728C19 5.05316 15.0118 1.04141 10.0779 1C5.1088 1.00007 1 5.02371 1 9.99348Z" fill={`url(#paint0_linear_371_216_${index})`}/>
                        </g>
                        <mask id={`mask1_371_216_${index}`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="8" y="7" width="15" height="15">
                          <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill="white"/>
                        </mask>
                        <g mask={`url(#mask1_371_216_${index})`}>
                          <g filter={`url(#filter0_f_371_216_${index})`}>
                            <path d="M1 9.99348C1.00003 11.624 1.44063 13.1472 2.19626 14.4646C2.38601 14.9255 2.27792 15.4945 2.15636 15.9568C1.97097 16.6619 1.62172 17.3398 1.21379 17.7485C1.0104 17.9522 0.945503 18.2561 1.04846 18.525C1.1515 18.7939 1.40329 18.9771 1.69077 18.9927C2.51536 19.0372 3.42875 18.8742 4.22582 18.6419C4.83702 18.4638 5.42053 18.2318 5.88387 17.9889C7.15411 18.645 8.57122 18.9955 10.0009 18.9955C14.9719 18.9954 18.9997 14.9668 19 9.99728C19 5.05316 15.0118 1.04141 10.0779 1C5.1088 1.00007 1 5.02371 1 9.99348Z" fill={`url(#paint1_linear_371_216_${index})`}/>
                          </g>
                        </g>
                        <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill={`url(#paint2_linear_371_216_${index})`}/>
                        <path d="M22 14.4971C22 11.0214 19.2686 8.18279 15.835 8.00879L15.501 8C11.9118 8 9 10.9122 9 14.5C9.0002 18.0874 11.9088 20.9959 15.499 20.9961V21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461V20.9961C16.5025 20.9961 17.4992 20.7574 18.3994 20.3066C18.6109 20.2007 18.8599 20.2016 19.0713 20.3076C19.389 20.467 19.7847 20.6214 20.1992 20.7422C20.7163 20.8928 21.2777 20.9965 21.7852 21L22 20.9951C21.684 20.6784 21.3597 20.1509 21.1582 19.6211C21.0549 19.3495 20.9707 19.0451 20.9453 18.7373C20.9203 18.4343 20.9483 18.0728 21.127 17.7383L21.1377 17.7188C21.6146 16.886 21.9171 15.9424 21.9854 14.9336L22 14.4971Z" fill={`url(#paint3_linear_371_216_${index})`}/>
                      </g>
                      <defs>
                        <filter id={`filter0_f_371_216_${index}`} x="-3" y="-3" width="26" height="26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_371_216"/>
                        </filter>
                        <linearGradient id={`paint0_linear_371_216_${index}`} x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.34"/>
                        </linearGradient>
                        <linearGradient id={`paint1_linear_371_216_${index}`} x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.34"/>
                        </linearGradient>
                        <linearGradient id={`paint2_linear_371_216_${index}`} x1="15.5" y1="7.25" x2="15.5" y2="21.75" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" stopOpacity="0.6"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.6"/>
                        </linearGradient>
                        <linearGradient id={`paint3_linear_371_216_${index}`} x1="15.5" y1="7.25" x2="15.5" y2="15.647" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white"/>
                          <stop offset="1" stopColor="white" stopOpacity="0"/>
                        </linearGradient>
                        <clipPath id="clip0_371_216">
                          <rect width="24" height="24" fill="white"/>
                        </clipPath>
                      </defs>
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
          <div className="flex items-center gap-[20px] w-[73px] h-[29px] opacity-44">
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

      {/* Content Container */}
      <div className="relative w-full max-w-[1440px] mx-auto px-8 pt-32">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mt-8 mb-12 px-16"
        >
          <h2 className="text-[40px] leading-[1.3] font-bold text-[#4F5CFF] mb-3">
            <span>End-To-End Product Design, Frontend development and Branding.</span>
          </h2>
          <p className="text-[18px] leading-[1.5] text-gray-600 font-normal">
            <span>Visually stunning apps, softwares and websites with functionality at it's core.</span>
          </p>
          </motion.div>

        {/* Chat Interface Card - Made Smaller */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative w-[800px] h-[480px] mx-auto bg-gradient-to-b from-[#E9E8FF] to-[#EFF4EC] rounded-[44px] overflow-visible"
          style={{
            boxShadow: '0px 480px 192px rgba(0, 0, 0, 0.01), 0px 270px 162px rgba(0, 0, 0, 0.02), 0px 120px 120px rgba(0, 0, 0, 0.03), 0px 30px 66px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Inner Background Blurs */}
          <div className="absolute w-[421px] h-[336px] left-1/2 bottom-[-99px] -translate-x-1/2 translate-x-[236px] bg-[rgba(101,73,255,0.14)] rounded-[4444px] blur-[100px] pointer-events-none" />
          <div className="absolute w-[605px] h-[313px] left-1/2 bottom-[267px] -translate-x-1/2 -translate-x-[172px] bg-gradient-to-r from-[rgba(255,255,255,0.88)] to-[rgba(255,255,255,0.1936)] rounded-[4444px] blur-[100px] pointer-events-none" />

          <div className="relative h-full px-[32px] py-[20px]">
            {/* Header - "hey i'm raks" | "email : contact@rakshaaa.com" */}
            <div className="absolute w-[640px] h-[24px] left-[80px] top-[20px] flex items-end justify-between">
              <div className="flex items-end gap-3">
                <span
                  className="text-[16px] leading-[24px] font-light text-black"
                  style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}
                >
                  <span>hey i'm raks</span>
                </span>
              </div>
              <span
                className="text-[16px] leading-[24px] font-normal text-black"
                style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}
              >
                <span className="text-black/[0.22]">email : </span><span>contact@rakshaaa.com</span>
              </span>
            </div>

            {/* Chat Messages Container - Scrollable */}
            <div 
              className="absolute left-[80px] w-[640px] top-[64px] h-[256px] flex flex-col"
            >
              <div 
                ref={chatContainerRef}
                className="overflow-y-auto flex flex-col gap-3 pr-3 pb-4 custom-scrollbar flex-1"
                style={{ scrollBehavior: 'smooth' }}
              >
              {/* Initial Welcome Message - Always show */}
              <div className="w-full flex-shrink-0 mb-2">
                <div className="flex items-start gap-3 max-w-[560px]">
                  <div className="relative w-[48px] h-[48px] flex-shrink-0 rounded-full overflow-hidden bg-[#D9D9D9]">
                    <img
                      src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="px-[18px] py-[14px] bg-white text-black flex-1"
                    style={{
                      borderRadius: '30px 30px 30px 0px',
                      filter: 'drop-shadow(0 15px 34px rgba(40, 63, 228, 0.04)) drop-shadow(0 62px 62px rgba(40, 63, 228, 0.03)) drop-shadow(0 139px 84px rgba(40, 63, 228, 0.02)) drop-shadow(0 248px 99px rgba(40, 63, 228, 0.01)) drop-shadow(0 387px 108px rgba(40, 63, 228, 0.00))'
                    }}
                  >
                    <p className="text-[14px] leading-[21px] font-extralight" style={{ fontFamily: 'Nexa Text, system-ui, sans-serif' }}>
                      you can ask me here about my design process, my past projects or just get to know me better!
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Messages */}
              {messages.map((msg) => (
                <div key={msg.id} className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="flex items-start gap-3 max-w-[560px]">
                      <div className="relative w-[48px] h-[48px] flex-shrink-0 rounded-full overflow-hidden bg-[#D9D9D9]">
                        <img
                          src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
                          alt="Profile"
                          className="absolute w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className="px-[18px] py-[14px] bg-white text-black"
                        style={{
                          borderRadius: '30px 30px 30px 0px',
                          filter: 'drop-shadow(0 15px 34px rgba(40, 63, 228, 0.04)) drop-shadow(0 62px 62px rgba(40, 63, 228, 0.03)) drop-shadow(0 139px 84px rgba(40, 63, 228, 0.02)) drop-shadow(0 248px 99px rgba(40, 63, 228, 0.01)) drop-shadow(0 387px 108px rgba(40, 63, 228, 0.00))'
                        }}
                      >
                        <p className="text-[14px] leading-[21px] font-extralight" style={{ fontFamily: 'Nexa Text, system-ui, sans-serif' }}>
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className="max-w-[560px]">
                      <div
                        className="px-[22px] py-[20px] bg-black/[0.79] text-white"
                        style={{
                          borderRadius: '30px 30px 0px 30px',
                          filter: 'drop-shadow(0 15px 34px rgba(40, 63, 228, 0.04)) drop-shadow(0 62px 62px rgba(40, 63, 228, 0.03)) drop-shadow(0 139px 84px rgba(40, 63, 228, 0.02)) drop-shadow(0 248px 99px rgba(40, 63, 228, 0.01)) drop-shadow(0 387px 108px rgba(40, 63, 228, 0.00))'
                        }}
                      >
                        <p className="text-[14px] leading-[21px] font-light" style={{ fontFamily: 'Nexa Text, system-ui, sans-serif' }}>
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="w-full flex justify-start">
                  <div className="flex items-start gap-3 max-w-[560px]">
                    <div className="relative w-[48px] h-[48px] flex-shrink-0 rounded-full overflow-hidden bg-[#D9D9D9]">
                      <img
                        src="https://storage.googleapis.com/storage.magicpath.ai/user/323295203727400960/assets/a162f3c9-9017-4e52-a2b7-d48614b32b0f.jpg"
                        alt="Profile"
                        className="absolute w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className="px-[22px] py-[20px] bg-white text-black"
                      style={{
                        borderRadius: '30px 30px 30px 0px',
                        filter: 'drop-shadow(0 15px 34px rgba(40, 63, 228, 0.04)) drop-shadow(0 62px 62px rgba(40, 63, 228, 0.03)) drop-shadow(0 139px 84px rgba(40, 63, 228, 0.02)) drop-shadow(0 248px 99px rgba(40, 63, 228, 0.01)) drop-shadow(0 387px 108px rgba(40, 63, 228, 0.00))'
                      }}
                    >
                      <p className="text-[14px] leading-[21px] font-extralight" style={{ fontFamily: 'Nexa Text, system-ui, sans-serif' }}>
                        ...
                      </p>
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>

            {/* Bottom Section - Suggestions + Input */}
            <div className="absolute w-[640px] left-[80px] bottom-[20px] flex flex-col items-center gap-[12px]">
              {/* Suggestion Pills - With Glass Effect */}
              <div className="w-full flex items-center justify-center gap-2">
                {SUGGESTION_PILLS.map((pill) => {
                  return (
                    <button 
                      key={pill.id}
                      onClick={() => handleSendMessage(pill.text)}
                      disabled={isLoading}
                      className="relative px-6 py-2 h-[37px] rounded-full hover:bg-white/15 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                      }}
                    >
                      <span
                        className="text-[13px] leading-[20px] font-normal text-black/[0.64] whitespace-nowrap text-center"
                        style={{ fontFamily: 'Nexa Text, system-ui, sans-serif' }}
                      >
                        {pill.text}
        </span>
                    </button>
                  );
                })}
              </div>

              {/* Input Bar - Smaller */}
              <div
                className="w-[640px] h-[56px] flex items-center justify-center px-[22px] py-[4px] rounded-[100px] border border-white"
                style={{
                  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.44) 100%)',
                  boxShadow: '0px 297px 119px rgba(0, 0, 0, 0.01), 0px 167px 100px rgba(0, 0, 0, 0.02), 0px 74px 74px rgba(0, 0, 0, 0.03), 0px 19px 41px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="w-full flex items-center justify-between gap-3">
                  {/* Left: Sparkle Icon + Input */}
                  <div className="flex items-center gap-3 flex-1" style={{ alignItems: 'center' }}>
                    {/* Sparkle Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <g clipPath="url(#clip0_371_175)">
                        <mask id="mask0_371_175" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                          <path d="M24 0H0V24H24V0Z" fill="white"/>
                          <path d="M16.6562 9.21214L14.3939 3.51184C13.893 2.24975 12.1067 2.24959 11.6056 3.5116L9.34196 9.21214C9.31836 9.27141 9.27155 9.31822 9.21228 9.34182L3.51087 11.6058C2.24898 12.1069 2.24898 13.8929 3.51087 14.394L9.21228 16.658C9.27155 16.6816 9.31836 16.7284 9.34196 16.7876L11.6055 22.4882C12.1067 23.7502 13.8929 23.75 14.3939 22.4879L16.6562 16.7876C16.6799 16.7282 16.7273 16.6815 16.7868 16.658L22.4888 14.394C23.7507 13.893 23.7507 12.1068 22.4888 11.6058L16.7868 9.34182C16.7273 9.31828 16.6799 9.27161 16.6562 9.21214Z" fill="black"/>
                        </mask>
                        <g mask="url(#mask0_371_175)">
                          <path d="M13.0001 9.00529C13.5523 9.00529 14 9.45306 14.0001 10.0053V12.0053H16.0001C16.5523 12.0053 17 12.4531 17.0001 13.0053C16.9999 13.5574 16.5522 14.0053 16.0001 14.0053H14.0001V16.0053C13.9999 16.5574 13.5522 17.0053 13.0001 17.0053C12.448 17.0053 12.0003 16.5574 12.0001 16.0053V14.0053H10.0001C9.448 14.0053 9.00034 13.5574 9.00009 13.0053C9.00016 12.4531 9.44789 12.0054 10.0001 12.0053H12.0001V10.0053C12.0002 9.45309 12.4479 9.00534 13.0001 9.00529ZM6.0704 1.34123C6.40449 0.499893 7.59584 0.499834 7.92978 1.34123L9.25009 4.66935C9.26462 4.70569 9.29382 4.73394 9.33017 4.74845L12.6593 6.07072C13.5006 6.40475 13.5006 7.59507 12.6593 7.92912L9.33017 9.25138C9.29383 9.26588 9.26463 9.29417 9.25009 9.33049L7.92978 12.6586C7.59584 13.5 6.40449 13.5 6.0704 12.6586L4.74911 9.33049C4.73455 9.29416 4.7054 9.26586 4.66904 9.25138L1.34091 7.92912C0.499646 7.59507 0.499646 6.40477 1.34091 6.07072L4.66904 4.74845C4.70542 4.73397 4.73456 4.7057 4.74911 4.66935L6.0704 1.34123Z" fill="url(#paint0_linear_371_175)"/>
                        </g>
                        <mask id="mask1_371_175" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="2" y="2" width="22" height="22">
                          <path d="M16.6562 9.21214L14.3939 3.51184C13.893 2.24975 12.1067 2.24959 11.6056 3.5116L9.34196 9.21214C9.31836 9.27141 9.27155 9.31822 9.21228 9.34182L3.51087 11.6058C2.24898 12.1069 2.24898 13.8929 3.51087 14.394L9.21228 16.658C9.27155 16.6816 9.31836 16.7284 9.34196 16.7876L11.6055 22.4882C12.1067 23.7502 13.8929 23.75 14.3939 22.4879L16.6562 16.7876C16.6799 16.7282 16.7273 16.6815 16.7868 16.658L22.4888 14.394C23.7507 13.893 23.7507 12.1068 22.4888 11.6058L16.7868 9.34182C16.7273 9.31828 16.6799 9.27161 16.6562 9.21214Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask1_371_175)">
                          <g filter="url(#filter0_f_371_175)">
                            <path d="M13.0001 9.00529C13.5523 9.00529 14 9.45306 14.0001 10.0053V12.0053H16.0001C16.5523 12.0053 17 12.4531 17.0001 13.0053C16.9999 13.5574 16.5522 14.0053 16.0001 14.0053H14.0001V16.0053C13.9999 16.5574 13.5522 17.0053 13.0001 17.0053C12.448 17.0053 12.0003 16.5574 12.0001 16.0053V14.0053H10.0001C9.448 14.0053 9.00034 13.5574 9.00009 13.0053C9.00016 12.4531 9.44789 12.0054 10.0001 12.0053H12.0001V10.0053C12.0002 9.45309 12.4479 9.00534 13.0001 9.00529ZM6.0704 1.34123C6.40449 0.499893 7.59584 0.499834 7.92978 1.34123L9.25009 4.66935C9.26462 4.70569 9.29382 4.73394 9.33017 4.74845L12.6593 6.07072C13.5006 6.40475 13.5006 7.59507 12.6593 7.92912L9.33017 9.25138C9.29383 9.26588 9.26463 9.29417 9.25009 9.33049L7.92978 12.6586C7.59584 13.5 6.40449 13.5 6.0704 12.6586L4.74911 9.33049C4.73455 9.29416 4.7054 9.26586 4.66904 9.25138L1.34091 7.92912C0.499646 7.59507 0.499646 6.40477 1.34091 6.07072L4.66904 4.74845C4.70542 4.73397 4.73456 4.7057 4.74911 4.66935L6.0704 1.34123Z" fill="url(#paint1_linear_371_175)"/>
                          </g>
                        </g>
                        <path d="M16.6562 9.21214L14.3939 3.51184C13.893 2.24975 12.1067 2.24959 11.6056 3.5116L9.34196 9.21214C9.31836 9.27141 9.27155 9.31822 9.21228 9.34182L3.51087 11.6058C2.24898 12.1069 2.24898 13.8929 3.51087 14.394L9.21228 16.658C9.27155 16.6816 9.31836 16.7284 9.34196 16.7876L11.6055 22.4882C12.1067 23.7502 13.8929 23.75 14.3939 22.4879L16.6562 16.7876C16.6799 16.7282 16.7273 16.6815 16.7868 16.658L22.4888 14.394C23.7507 13.893 23.7507 12.1068 22.4888 11.6058L16.7868 9.34182C16.7273 9.31828 16.6799 9.27161 16.6562 9.21214Z" fill="url(#paint2_linear_371_175)"/>
                        <path d="M11.6056 3.5118C12.1066 2.24991 13.8926 2.25003 14.3936 3.5118L16.6563 9.212C16.68 9.27147 16.7277 9.31834 16.7872 9.34188L22.4884 11.6056C23.7503 12.1066 23.7503 13.8936 22.4884 14.3947L16.7872 16.6583L16.7452 16.6798C16.7054 16.7057 16.6741 16.7434 16.6563 16.7882L14.3936 22.4884L14.3429 22.6027C13.8002 23.7119 12.1989 23.7121 11.6563 22.6027L11.6056 22.4884L9.34192 16.7882C9.31833 16.7289 9.2713 16.6819 9.21204 16.6583L3.51087 14.3947C2.24898 13.8936 2.24898 12.1067 3.51087 11.6056L9.21204 9.34188C9.2713 9.31828 9.31833 9.27126 9.34192 9.212L11.6056 3.5118ZM13.6974 3.78915C13.447 3.15823 12.5536 3.15757 12.3028 3.78817L10.0391 9.48934C9.9518 9.70881 9.78861 9.88887 9.58118 9.99715L9.48938 10.0392L3.78821 12.3029C3.15726 12.5534 3.15727 13.4468 3.78821 13.6974L9.48938 15.9611C9.70885 16.0484 9.88891 16.2116 9.99719 16.4191L10.0391 16.5109L12.3028 22.212C12.5536 22.8426 13.446 22.842 13.6964 22.2111L15.9591 16.5109L16.002 16.4181C16.1119 16.2084 16.2932 16.0471 16.5099 15.9611L22.212 13.6974C22.843 13.4469 22.843 12.5534 22.212 12.3029L16.5099 10.0392C16.2933 9.95312 16.1118 9.79173 16.002 9.58211L15.9591 9.48934L13.6974 3.78915Z" fill="url(#paint3_linear_371_175)"/>
                      </g>
                      <defs>
                        <filter id="filter0_f_371_175" x="-3.29004" y="-3.28979" width="24.29" height="24.2952" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_371_175"/>
                        </filter>
                        <linearGradient id="paint0_linear_371_175" x1="8.85509" y1="0.709981" x2="8.85509" y2="13.5" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#283FE4" stopOpacity="0.38"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.38"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_371_175" x1="8.85509" y1="0.709981" x2="8.85509" y2="13.5" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#283FE4" stopOpacity="0.38"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.38"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_371_175" x1="13.1508" y1="25.999" x2="12.8493" y2="0.000757185" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#283FE4" stopOpacity="0.38"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="paint3_linear_371_175" x1="12.9992" y1="2.56506" x2="12.9992" y2="13.5001" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white"/>
                          <stop offset="1" stopColor="white" stopOpacity="0"/>
                        </linearGradient>
                        <clipPath id="clip0_371_175">
                          <rect width="24" height="24" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>

                    <div className="relative flex-1 min-w-0 h-[24px] flex items-center">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="w-full h-full bg-transparent border-none outline-none text-[16px] leading-[24px] font-normal text-black disabled:opacity-50"
                        style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}
                      />
                      {!inputValue && (
                        <div
                          className="absolute inset-0 pointer-events-none flex items-center whitespace-nowrap"
                          onMouseEnter={() => {
                            setIsPlaceholderHovered(true);
                            setShowAlternateText(true);
                          }}
                          onMouseLeave={() => {
                            setIsPlaceholderHovered(false);
                            setShowAlternateText(false);
                          }}
                          style={{ pointerEvents: 'auto' }}
                        >
                          <div className="relative overflow-hidden whitespace-nowrap h-[24px] flex items-center">
                            <motion.span
                              className="text-[16px] leading-[24px] font-normal text-black/[0.44] whitespace-nowrap block"
                              style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}
                              animate={{ opacity: showAlternateText ? 0 : 1 }}
                              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            >
                              talk 2 me
                            </motion.span>
                            
                            {isPlaceholderHovered && (
                              <motion.div
                                className="absolute inset-0"
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ 
                                  duration: 0.7, 
                                  ease: [0.4, 0, 0.2, 1]
                                }}
                                style={{
                                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)',
                                  pointerEvents: 'none'
                                }}
                              />
                            )}
                          </div>
                          
                          <motion.div
                            className="absolute text-[16px] leading-[24px] font-normal text-black/[0.44] whitespace-nowrap flex items-center h-[24px] overflow-hidden"
                            style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}
                            initial={{ width: 0 }}
                            animate={{ width: showAlternateText ? 'auto' : 0 }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                          >
                            raksha can see all our messages
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Send Button */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    className="w-[44px] h-[44px] bg-white rounded-[3333px] flex items-center justify-center hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: '-17px 20px 10px rgba(40, 63, 228, 0.01), -10px 11px 9px rgba(40, 63, 228, 0.02), -4px 5px 7px rgba(40, 63, 228, 0.03), -1px 1px 4px rgba(40, 63, 228, 0.04)'
                    }}
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-[20px] h-[20px] text-[#283FE4]" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-4 gap-6 mt-16 pb-20"
        >
          {PROJECT_CARDS.map((project) => {
            return (
              <div
                key={project.id}
                className="group relative bg-white/30 backdrop-blur-sm border border-white/60 rounded-[32px] overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-[15px] text-gray-900 font-normal">
                      <span>{project.title}</span>
                    </h3>
                    <button
                      className="w-[38px] h-[38px] bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors"
                      aria-label={`View ${project.title}`}
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#4F5CFF]" strokeWidth={2} />
                    </button>
                  </div>
                  <div className={`w-full aspect-[4/3] bg-gradient-to-br ${project.gradient} rounded-[24px] border border-white/40 overflow-hidden`}>
                    <div className={`w-full h-full bg-gradient-to-br ${project.bgGradient}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.cdnfonts.com/css/nexa-bold');
        @import url('https://fonts.googleapis.com/css2?family=Nexa+Text:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.cdnfonts.com/css/neulis-cursive');
        
        /* Custom Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 127, 186, 0.3);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 127, 186, 0.5);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 127, 186, 0.3) transparent;
        }
      `}</style>
      </div>
  );
};
