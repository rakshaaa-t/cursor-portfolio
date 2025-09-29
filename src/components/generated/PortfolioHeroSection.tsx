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
    label: 'Work',
    href: '#work',
    mpid: "80e3b469-b30c-4cfe-8b69-4b2b5add87ed"
  }, {
    label: 'Process',
    href: '#process',
    mpid: "c21b9591-86ed-4b76-9112-cd6a8587f9c5"
  }, {
    label: 'Case Studies',
    href: '#cases',
    mpid: "3683c019-73b1-4d62-ae9f-143af54e343c"
  }, {
    label: 'Playground',
    href: '#playground',
    mpid: "b7b050f7-91ff-4ea8-9d64-7385328a0430"
  }] as any[];
  const social = [{
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: Mail,
    mpid: "8380616b-df9d-4f47-ba66-b20c8ef37229"
  }, {
    label: 'GitHub',
    href: 'https://github.com/',
    icon: Github,
    mpid: "57a33a60-5017-4e23-ad6c-779389813406"
  }, {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: Linkedin,
    mpid: "7c41065f-e28a-4de9-a255-ff5b1ce58f64"
  }, {
    label: 'Resume',
    href: '#resume',
    icon: Download,
    mpid: "89502518-16e6-481a-a994-9675d3db2413"
  }] as any[];

  // @return
  return <SortableContainer dndKitId="a81549ff-ee97-4fd2-952c-1082cf482d48" containerType="regular" prevTag="section" aria-label="Portfolio hero" className="relative isolate overflow-hidden bg-gradient-to-b from-white to-zinc-50 text-zinc-900" data-magicpath-id="0" data-magicpath-path="PortfolioHeroSection.tsx">
      {/* Subtle pixel-like backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{
      backgroundImage: 'radial-gradient(rgba(24,24,27,0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} data-magicpath-id="1" data-magicpath-path="PortfolioHeroSection.tsx" />

      {/* Top nav pill */}
      <SortableContainer dndKitId="8fdac80d-b056-4933-96b1-8bb4cc1b7263" containerType="regular" prevTag="div" className="relative z-10 mx-auto flex w-full max-w-6xl justify-between px-4 pt-6 sm:px-6 lg:px-8" data-magicpath-id="2" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="dcc59dcd-18f8-4af2-a899-24d6eacca634" containerType="collection" prevTag="nav" aria-label="Primary" className="mx-auto flex items-center gap-1 rounded-full border border-zinc-200 bg-white/80 px-1 py-1 shadow-sm backdrop-blur" data-magicpath-id="3" data-magicpath-path="PortfolioHeroSection.tsx">
          {navItems.map(item => <a key={item.label} href={item.href} className="rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="4" data-magicpath-path="PortfolioHeroSection.tsx">
              {item.label}
            </a>)}
          <a href="#contact" className="ml-1 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-id="5" data-magicpath-path="PortfolioHeroSection.tsx">
            Say hi
            <ArrowRight className="size-4" aria-hidden data-magicpath-id="6" data-magicpath-path="PortfolioHeroSection.tsx" />
          </a>
        </SortableContainer>
      </SortableContainer>

      {/* Main content */}
      <SortableContainer dndKitId="0d3286fd-6519-4a0c-8f71-1f2548130815" containerType="regular" prevTag="div" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20" data-magicpath-id="7" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="7d9ae0f8-eab8-4b23-96d9-559e4ac8557b" containerType="regular" prevTag="div" className="mx-auto max-w-3xl" data-magicpath-id="8" data-magicpath-path="PortfolioHeroSection.tsx">
          <motion.h1 data-magicpath-motion-tag="motion.h1" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          ease: 'easeOut'
        }} className="text-balance text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl" data-magicpath-id="9" data-magicpath-path="PortfolioHeroSection.tsx">
            End-to-end product design and branding.
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
        }} className="mt-4 text-pretty text-xl text-zinc-700 sm:text-2xl" data-magicpath-id="10" data-magicpath-path="PortfolioHeroSection.tsx">
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
        }} className="mt-6 max-w-2xl text-zinc-600" data-magicpath-id="11" data-magicpath-path="PortfolioHeroSection.tsx">
            6+ years designing for startups and scale-ups. Available for select
            collaborations and advisory.
          </motion.p>

          {/* Center orb */}
          <SortableContainer dndKitId="fff730ff-4142-4b0d-ab20-9fc6e4898506" containerType="regular" prevTag="motion.div" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.15
        }} className="relative mx-auto mt-10 h-16 w-16 sm:h-20 sm:w-20" aria-hidden data-magicpath-id="12" data-magicpath-path="PortfolioHeroSection.tsx">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-300 via-emerald-300 to-amber-200 blur-lg opacity-70" data-magicpath-id="13" data-magicpath-path="PortfolioHeroSection.tsx" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-cyan-200 via-emerald-200 to-yellow-200 shadow-inner" data-magicpath-id="14" data-magicpath-path="PortfolioHeroSection.tsx" />
          </SortableContainer>

          {/* Greeting bubble */}
          <SortableContainer dndKitId="b31832b8-b7d9-4640-be9c-984026957289" containerType="regular" prevTag="motion.div" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.2
        }} className="mt-10 rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur" data-magicpath-id="15" data-magicpath-path="PortfolioHeroSection.tsx">
            <SortableContainer dndKitId="eab58ba5-dc61-4035-a611-bc3bce95ff17" containerType="regular" prevTag="div" className="flex items-center gap-3" data-magicpath-id="16" data-magicpath-path="PortfolioHeroSection.tsx">
              <SortableContainer dndKitId="e722cd83-0b47-4cb1-a856-4b0bcf538434" containerType="regular" prevTag="div" className="relative" data-magicpath-id="17" data-magicpath-path="PortfolioHeroSection.tsx">
                <img src="https://i.pravatar.cc/80?img=13" alt="Your avatar" className="size-9 rounded-full border border-zinc-200 object-cover" data-magicpath-id="18" data-magicpath-path="PortfolioHeroSection.tsx" />
                <span className="absolute -right-0 -bottom-0 inline-block size-3 rounded-full bg-emerald-500 ring-2 ring-white" data-magicpath-id="19" data-magicpath-path="PortfolioHeroSection.tsx" />
              </SortableContainer>
              <p className="text-sm text-zinc-700" data-magicpath-id="20" data-magicpath-path="PortfolioHeroSection.tsx">
                Hi, I’m <span className="font-semibold" data-magicpath-id="21" data-magicpath-path="PortfolioHeroSection.tsx">Your Name</span>. Nice
                to meet you. What’s up?
              </p>
            </SortableContainer>
          </SortableContainer>

          {/* CTA and social */}
          <SortableContainer dndKitId="8e79d884-7407-4e80-bb35-b2913ca3b9b9" containerType="regular" prevTag="motion.div" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.25
        }} className="mt-8 flex flex-wrap items-center gap-3" data-magicpath-id="22" data-magicpath-path="PortfolioHeroSection.tsx">
            <a href="#work" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-id="23" data-magicpath-path="PortfolioHeroSection.tsx">
              View projects
              <ArrowRight className="size-4" aria-hidden data-magicpath-id="24" data-magicpath-path="PortfolioHeroSection.tsx" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-id="25" data-magicpath-path="PortfolioHeroSection.tsx">
              Contact
            </a>

            <div className="mx-1 hidden h-5 w-px bg-zinc-200 sm:block" aria-hidden data-magicpath-id="26" data-magicpath-path="PortfolioHeroSection.tsx" />

            <SortableContainer dndKitId="9085143c-0dce-451c-b756-e4aba3fbfdf8" containerType="collection" prevTag="ul" className="flex items-center gap-2" data-magicpath-id="27" data-magicpath-path="PortfolioHeroSection.tsx">
              {social.map(s => <li key={s.label} data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-id="28" data-magicpath-path="PortfolioHeroSection.tsx">
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="PortfolioHeroSection.tsx">
                    <s.icon className="size-4" aria-hidden data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="PortfolioHeroSection.tsx" />
                    <span className="hidden sm:inline" data-magicpath-uuid={(s as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="31" data-magicpath-path="PortfolioHeroSection.tsx">{s.label}</span>
                  </a>
                </li>)}
            </SortableContainer>
          </SortableContainer>
        </SortableContainer>
      </SortableContainer>

      {/* Decorative side initials */}
      <SortableContainer dndKitId="9df97042-3466-4568-b6a3-52e04ec96741" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="32" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="33" data-magicpath-path="PortfolioHeroSection.tsx">
          PRT
        </span>
      </SortableContainer>
      <SortableContainer dndKitId="116eb570-cec2-43f8-887f-4e376b571a61" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="34" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="35" data-magicpath-path="PortfolioHeroSection.tsx">
          FOL
        </span>
      </SortableContainer>
    </SortableContainer>;
};