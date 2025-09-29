import { SortableContainer } from "@/dnd-kit/SortableContainer";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Github, Linkedin, Download } from 'lucide-react';
import { ensureLightMode } from '../../lib/utils';

// @component: PortfolioHeroSection
export const PortfolioHeroSection: React.FC = () => {
  useEffect(() => {
    ensureLightMode();
  }, []);
  const navItems = [{
    label: 'Home',
    href: '#home',
    mpid: "49aa8bba-f8d2-4f30-91ac-ec97fc5a0977"
  }, {
    label: 'Work',
    href: '#work',
    mpid: "57b872b5-37c0-4fd6-98d3-088d430b5500"
  }, {
    label: '0–1 Process',
    href: '#process',
    mpid: "2ef77306-5ac2-412e-8e43-a8988884846c"
  }, {
    label: 'Design Vault',
    href: '#vault',
    mpid: "e173ca0b-17c9-4220-b039-0f137013dbdf"
  }, {
    label: 'Vibe Coded',
    href: '#vibe',
    mpid: "fb391051-9ec3-4e1b-ba30-13073d5e06ae"
  }] as any[];
  const social = [{
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: Mail,
    mpid: "d14a9a3a-a146-4b26-860e-b9b1f95dd039"
  }, {
    label: 'GitHub',
    href: 'https://github.com/',
    icon: Github,
    mpid: "347eff47-1e51-4de6-8205-f9c356dafd43"
  }, {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: Linkedin,
    mpid: "12641a59-591b-4e21-80c1-f53284b2aa28"
  }, {
    label: 'Resume',
    href: '#resume',
    icon: Download,
    mpid: "c9e04133-91b2-4d51-b28b-47f55969bfc5"
  }] as any[];

  // @return
  return <SortableContainer dndKitId="57cd861d-0ae6-4c51-a621-96d27881fff2" containerType="regular" prevTag="section" aria-label="Portfolio hero" className="relative isolate overflow-hidden bg-gradient-to-b from-white to-zinc-50 text-zinc-900" data-magicpath-id="0" data-magicpath-path="PortfolioHeroSection.tsx">
      {/* Subtle pixel-like backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{
      backgroundImage: 'radial-gradient(rgba(24,24,27,0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} data-magicpath-id="1" data-magicpath-path="PortfolioHeroSection.tsx" />

      {/* Top nav pill */}
      <SortableContainer dndKitId="34b7fb5d-b6c7-4971-834d-2750801ef63a" containerType="regular" prevTag="div" className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-center px-4 pt-6 sm:px-6 lg:px-8" data-magicpath-id="2" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="73e75b74-3ad9-4f5d-a1d2-8e245458a1fe" containerType="regular" prevTag="nav" aria-label="Primary" className="mx-0 flex items-center gap-4" data-magicpath-id="3" data-magicpath-path="PortfolioHeroSection.tsx">
          <SortableContainer dndKitId="55781a90-59e5-4329-9fa3-7b943d3c87e5" containerType="collection" prevTag="div" className="relative flex items-center rounded-[32px] border border-zinc-800/70 bg-zinc-900 px-6 py-4 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.45)]" data-magicpath-id="4" data-magicpath-path="PortfolioHeroSection.tsx">
            {navItems.map(item => <a key={item.label} href={item.href} className="relative mx-6 inline-flex items-center py-1 text-lg font-medium tracking-wide text-zinc-400 transition-colors hover:text-white focus:outline-none" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="5" data-magicpath-path="PortfolioHeroSection.tsx">
                <span className="relative z-10" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="6" data-magicpath-path="PortfolioHeroSection.tsx">{item.label}</span>
                {item.label === 'Home' ? <span aria-hidden className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] h-1 w-20 -translate-x-1/2 rounded-full bg-[oklch(0.6_0.2_264)] shadow-[0_0_24px_6px_oklch(0.6_0.2_264_/_55%)]" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="7" data-magicpath-path="PortfolioHeroSection.tsx" /> : null}
              </a>)}
          </SortableContainer>
          <a href="#contact" className="relative inline-flex items-center justify-center rounded-[28px] border border-[oklch(0.6_0.2_264)] bg-zinc-900 px-8 py-4 text-xl font-semibold text-white shadow-[0_10px_30px_-6px_oklch(0.6_0.2_264_/_45%),inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors hover:text-white focus:outline-none" data-magicpath-id="8" data-magicpath-path="PortfolioHeroSection.tsx">
            <span data-magicpath-id="9" data-magicpath-path="PortfolioHeroSection.tsx">Say Hi !</span>
            <span aria-hidden className="absolute inset-0 rounded-[28px] ring-2 ring-inset ring-[oklch(0.6_0.2_264)]/40" data-magicpath-id="10" data-magicpath-path="PortfolioHeroSection.tsx" />
          </a>
        </SortableContainer>
      </SortableContainer>

      {/* Main content */}
      <SortableContainer dndKitId="5b39b75c-a450-431c-84f2-4753146f77ab" containerType="regular" prevTag="div" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20" data-magicpath-id="11" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="cd8ade1b-da80-4c52-9a9b-291ca2a02c97" containerType="regular" prevTag="div" className="mx-auto max-w-3xl text-center" data-magicpath-id="12" data-magicpath-path="PortfolioHeroSection.tsx">
          <motion.h1 data-magicpath-motion-tag="motion.h1" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          ease: 'easeOut'
        }} className="text-balance text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl" data-magicpath-id="13" data-magicpath-path="PortfolioHeroSection.tsx">
            End-To-End Product design and Branding. Visually stunning apps, softwares and wesbites with functionality at it’s core.
          </motion.h1>

          <motion.p data-magicpath-motion-tag="motion.p" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.05
        }} className="mt-4 text-pretty text-xl text-zinc-700 sm:text-2xl" data-magicpath-id="14" data-magicpath-path="PortfolioHeroSection.tsx">
            I craft visually rich apps, websites, and brand systems anchored in
            clarity, performance, and accessibility—turning ideas into products
            people love to use.
          </motion.p>

          <motion.p data-magicpath-motion-tag="motion.p" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.1
        }} className="mt-6 max-w-2xl mx-auto text-zinc-600" data-magicpath-id="15" data-magicpath-path="PortfolioHeroSection.tsx">
            6+ years designing for startups and scale-ups. Available for select
            collaborations and advisory.
          </motion.p>

          {/* Center orb */}
          <SortableContainer dndKitId="823eb775-07c1-4221-9c3e-b91b2d27a586" containerType="regular" prevTag="motion.div" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.15
        }} className="relative mx-auto mt-10 h-16 w-16 sm:h-20 sm:w-20" aria-hidden data-magicpath-id="16" data-magicpath-path="PortfolioHeroSection.tsx">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-300 via-emerald-300 to-amber-200 blur-lg opacity-70" data-magicpath-id="17" data-magicpath-path="PortfolioHeroSection.tsx" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-cyan-200 via-emerald-200 to-yellow-200 shadow-inner" data-magicpath-id="18" data-magicpath-path="PortfolioHeroSection.tsx" />
          </SortableContainer>

          {/* Greeting bubble */}
          <SortableContainer dndKitId="2a94d5c1-db43-4e7b-ad9c-522984a7b79f" containerType="regular" prevTag="motion.div" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.2
        }} className="mt-10 mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur" data-magicpath-id="19" data-magicpath-path="PortfolioHeroSection.tsx">
            <SortableContainer dndKitId="7eb5e849-9567-49e8-aa3f-c118cba705c1" containerType="regular" prevTag="div" className="flex items-center justify-center gap-3" data-magicpath-id="20" data-magicpath-path="PortfolioHeroSection.tsx">
              <SortableContainer dndKitId="1b61fe11-1e7b-4860-8393-8f86b83dfc6c" containerType="regular" prevTag="div" className="relative" data-magicpath-id="21" data-magicpath-path="PortfolioHeroSection.tsx">
                <img src="https://i.pravatar.cc/80?img=13" alt="Your avatar" className="size-9 rounded-full border border-zinc-200 object-cover" data-magicpath-id="22" data-magicpath-path="PortfolioHeroSection.tsx" />
                <span className="absolute -right-0 -bottom-0 inline-block size-3 rounded-full bg-emerald-500 ring-2 ring-white" data-magicpath-id="23" data-magicpath-path="PortfolioHeroSection.tsx" />
              </SortableContainer>
              <p className="text-sm text-zinc-700" data-magicpath-id="24" data-magicpath-path="PortfolioHeroSection.tsx">
                Hi, I’m <span className="font-semibold" data-magicpath-id="25" data-magicpath-path="PortfolioHeroSection.tsx">Your Name</span>. Nice
                to meet you. What’s up?
              </p>
            </SortableContainer>
          </SortableContainer>

          {/* CTA and social */}
          <SortableContainer dndKitId="d264ff95-53d5-46f8-9d36-3b306f3f1243" containerType="regular" prevTag="motion.div" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.25
        }} className="mt-8 flex flex-wrap items-center justify-center gap-3" data-magicpath-id="26" data-magicpath-path="PortfolioHeroSection.tsx">
            <a href="#work" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-id="27" data-magicpath-path="PortfolioHeroSection.tsx">
              View projects
              <ArrowRight className="size-4" aria-hidden data-magicpath-id="28" data-magicpath-path="PortfolioHeroSection.tsx" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-id="29" data-magicpath-path="PortfolioHeroSection.tsx">
              Contact
            </a>

            <div className="mx-1 hidden h-5 w-px bg-zinc-200 sm:block" aria-hidden data-magicpath-id="30" data-magicpath-path="PortfolioHeroSection.tsx" />

            <SortableContainer dndKitId="3aa29d43-5ae7-49e0-813b-58546c3dee3f" containerType="collection" prevTag="ul" className="flex items-center justify-center gap-2" data-magicpath-id="31" data-magicpath-path="PortfolioHeroSection.tsx">
              {social.map(s => <li key={s.label} data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="PortfolioHeroSection.tsx">
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-id="33" data-magicpath-path="PortfolioHeroSection.tsx">
                    <s.icon className="size-4" aria-hidden data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="PortfolioHeroSection.tsx" />
                    <span className="hidden sm:inline" data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="35" data-magicpath-path="PortfolioHeroSection.tsx">{s.label}</span>
                  </a>
                </li>)}
            </SortableContainer>
          </SortableContainer>
        </SortableContainer>
      </SortableContainer>

      {/* Decorative side initials */}
      <SortableContainer dndKitId="c42b00ac-78f4-4b80-b9b8-5a76577e40cf" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="36" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="37" data-magicpath-path="PortfolioHeroSection.tsx">
          PRT
        </span>
      </SortableContainer>
      <SortableContainer dndKitId="f882857b-2e3f-48e8-8ef8-b0638314ec83" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="38" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="39" data-magicpath-path="PortfolioHeroSection.tsx">
          FOL
        </span>
      </SortableContainer>
    </SortableContainer>;
};