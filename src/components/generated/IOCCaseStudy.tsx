"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const IOCCaseStudy: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #E8EDE4 0%, #D8DFD0 50%, #C8D4C0 100%)' }}>
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 w-full">
        <div className="absolute inset-0 z-[-1] backdrop-blur-[11px] [mask-image:linear-gradient(to_top,transparent,black_65%)]"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />
        <div className="flex items-center justify-between w-full px-6 md:px-20 py-4">
          <a href="/" className="text-center text-[#1a1a1a] text-4xl font-medium no-underline hover:opacity-80 transition-opacity cursor-pointer" style={{ fontFamily: 'neulis-cursive, "Neulis Cursive", Caveat, Pacifico, cursive' }}>
            raks
          </a>
          <div className="flex items-center gap-4 opacity-60">
            <a href="https://linkedin.com/in/raksha-t" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-100 transition-opacity">
              <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.9583 3.625C23.5993 3.625 24.214 3.87961 24.6672 4.33283C25.1204 4.78604 25.375 5.40073 25.375 6.04167V22.9583C25.375 23.5993 25.1204 24.214 24.6672 24.6672C24.214 25.1204 23.5993 25.375 22.9583 25.375H6.04167C5.40073 25.375 4.78604 25.1204 4.33283 24.6672C3.87961 24.214 3.625 23.5993 3.625 22.9583V6.04167C3.625 5.40073 3.87961 4.78604 4.33283 4.33283C4.78604 3.87961 5.40073 3.625 6.04167 3.625H22.9583ZM22.3542 22.3542V15.95C22.3542 14.9053 21.9391 13.9033 21.2004 13.1646C20.4617 12.4259 19.4597 12.0108 18.415 12.0108C17.3879 12.0108 16.1917 12.6392 15.6117 13.5817V12.2404H12.2404V22.3542H15.6117V16.3971C15.6117 15.4667 16.3608 14.7054 17.2913 14.7054C17.7399 14.7054 18.1702 14.8836 18.4874 15.2009C18.8047 15.5181 18.9829 15.9484 18.9829 16.3971V22.3542H22.3542ZM8.31333 10.3433C8.85172 10.3433 9.36806 10.1295 9.74876 9.74876C10.1295 9.36806 10.3433 8.85172 10.3433 8.31333C10.3433 7.18958 9.43708 6.27125 8.31333 6.27125C7.77174 6.27125 7.25233 6.4864 6.86936 6.86936C6.4864 7.25233 6.27125 7.77174 6.27125 8.31333C6.27125 9.43708 7.18958 10.3433 8.31333 10.3433ZM9.99292 22.3542V12.2404H6.64583V22.3542H9.99292Z" fill="#1a1a1a" />
              </svg>
            </a>
            <a href="https://twitter.com/rakshatated" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:opacity-100 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.5859 21.375L14.0885 10.4471L14.1013 10.4574L20.8613 2.625H18.6023L13.0954 9L8.72227 2.625H2.79766L9.79723 12.8276L9.79638 12.8267L2.41406 21.375H4.67309L10.7955 14.2824L15.6613 21.375H21.5859ZM7.82719 4.32954L18.3466 19.6705H16.5564L6.02852 4.32954H7.82719Z" fill="#1a1a1a" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative w-full px-4 md:px-6 lg:px-20 pt-24 md:pt-28 lg:pt-[120px] pb-20 flex flex-col items-center">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[1200px] flex flex-col gap-4 items-start mb-8"
        >
          <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}>
            Dealdoc : Deal Management Platform
          </h1>
          <p className="text-sm md:text-base text-[#1a1a1a]/70 leading-relaxed max-w-[900px]" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
            Greex was an interesting case study because this was my stepping stone in the world of crypto. Intended to be a defi trading platform for options and futures. The USP was that they were looking to add pre built strategies within the platform that users could apply to their trades and get insights on which trade would bring what kind of impact. This was directed towards users that needed help with understanding aspects of trading options and futures and the probabilities that come with each trade.
          </p>
        </motion.div>

        {/* Hero Image with Phone + Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="relative w-full max-w-[1200px] rounded-2xl overflow-hidden mb-10"
          style={{ background: 'linear-gradient(135deg, #E8EDE4 0%, #D8E0D0 50%, #C8D4C0 100%)' }}
        >
          <div className="relative w-full aspect-[16/9] flex items-center justify-center py-8 px-4 md:px-12">
            {/* Phone Mockup on left */}
            <div className="flex-shrink-0 w-[120px] md:w-[180px] lg:w-[220px] mr-4 md:mr-8">
              <img
                src="https://res.cloudinary.com/dky01erho/image/upload/v1760525270/190_2x_shots_so_gytftu.png"
                alt="Mobile App"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Info Card on right */}
            <div className="flex-1 max-w-[500px] bg-[#F5F5E8] rounded-xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#8B9B7A] text-white text-xs rounded-full">Feature #2</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-4" style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}>
                Mobile-First Data Collection
              </h3>

              <ul className="space-y-3 text-sm text-[#1a1a1a]/80" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B9B7A] mt-1">•</span>
                  <span><strong>Live Data Collection:</strong> Collect and visualize sensor data in real time with interactive charts, facilitating immediate insights and informed decision making.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B9B7A] mt-1">•</span>
                  <span><strong>Mobile & Desktop Sync:</strong> Seamlessly synchronizes your data between your desktop and mobile, allowing flexibility in data entry and access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B9B7A] mt-1">•</span>
                  <span><strong>Offline Capability (Coming Soon):</strong> Work offline with automatic synchronization when the connection is restored, ensuring uninterrupted data collection.</span>
                </li>
              </ul>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#1a1a1a]">20+</div>
                  <div className="text-xs text-[#1a1a1a]/60">SLOTS MADE LAST WEEK</div>
                </div>
                <button className="px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors">
                  Let's talk
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What I did Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[1200px] flex flex-col gap-5 mb-12"
        >
          <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}>
            What I did
          </h2>

          <div className="w-full border border-[#1a1a1a]/20 rounded-xl overflow-hidden bg-white/30">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5 border-b border-[#1a1a1a]/10">
              <span className="text-sm text-[#1a1a1a]/60" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                Product Design
              </span>
              <span className="text-sm text-[#1a1a1a] md:text-right" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                UX flows , UI design , Mobile Responsive Design
              </span>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5 border-b border-[#1a1a1a]/10">
              <span className="text-sm text-[#1a1a1a]/60" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                Game Design
              </span>
              <span className="text-sm text-[#1a1a1a] md:text-right" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                Designed Telegram bots for quick gamified trading experiences and parlays
              </span>
            </div>
            {/* Row 3 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5">
              <span className="text-sm text-[#1a1a1a]/60" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                Design System
              </span>
              <span className="text-sm text-[#1a1a1a] md:text-right max-w-[70%]" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                Foundations (Tokens for color, typography, spacing, radii, grid, and breakpoints) and Components (Reusable UI)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Features & Star Feature */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Main Features */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}>
              Main Features
            </h3>
            <div className="bg-white/40 border border-[#1a1a1a]/10 rounded-xl p-6 h-full">
              <ul className="text-sm text-[#1a1a1a]/80 leading-7 list-disc pl-5 space-y-2" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                <li>Browse and apply prebuilt trading strategies</li>
                <li>View strategy logic, risk profile, and expected outcomes</li>
                <li>Place trades confidently through a simplified execution UI</li>
                <li>Track trades and performance in real time through a clear portfolio dashboard</li>
              </ul>
            </div>
          </div>

          {/* Star Feature */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}>
              Star Feature
            </h3>
            <div className="bg-white/40 border border-[#1a1a1a]/10 rounded-xl p-6 h-full">
              <p className="text-sm text-[#1a1a1a]/80 leading-7" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
                The strategic decision to educate users while letting them act and make pre built strategies that users can apply to their trades whilst also educating them on how those strategies worked and the probability of PNL they bring
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Portfolio */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[1200px] pt-8 border-t border-[#1a1a1a]/10"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
            style={{ fontFamily: 'Nexa, system-ui, sans-serif' }}
          >
            ← Back to Portfolio
          </button>
        </motion.div>
      </div>
    </div>
  );
};
