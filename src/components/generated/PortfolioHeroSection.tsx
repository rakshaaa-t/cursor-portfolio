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
    mpid: "7c75f043-1f19-4352-b2ed-23eb26b3deb6"
  }, {
    label: 'Work',
    href: '#work',
    mpid: "b45aa679-764b-4312-af07-790dd508f737"
  }, {
    label: '0–1 Process',
    href: '#process',
    mpid: "0e3f463c-67c7-4c21-bbd2-88b63de18657"
  }, {
    label: 'Design Vault',
    href: '#vault',
    mpid: "8e99d7eb-fa40-4f1f-bfc8-aae48c0906d0"
  }, {
    label: 'Vibe Coded',
    href: '#vibe',
    mpid: "68ef06fa-636d-442a-a882-ed3d9d9d823f"
  }] as any[];
  const social = [{
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: Mail,
    mpid: "736dddee-e5de-4b8e-a3d1-9ef80bbf4f3c"
  }, {
    label: 'GitHub',
    href: 'https://github.com/',
    icon: Github,
    mpid: "fb8019f6-3867-4d19-aa01-0052db852db4"
  }, {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: Linkedin,
    mpid: "56dceced-7988-41fe-8ace-0bbbd809c5a2"
  }, {
    label: 'Resume',
    href: '#resume',
    icon: Download,
    mpid: "7a1a8aa6-833c-4631-bd14-3d53b00eb955"
  }] as any[];

  // @return
  return <SortableContainer dndKitId="4bd74ecc-a139-4486-aa09-42253c3b3f82" containerType="regular" prevTag="section" aria-label="Portfolio hero" className="relative isolate overflow-hidden bg-gradient-to-b from-white to-zinc-50 text-zinc-900" data-magicpath-id="0" data-magicpath-path="PortfolioHeroSection.tsx">
      {/* Subtle pixel-like backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{
      backgroundImage: 'radial-gradient(rgba(24,24,27,0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} data-magicpath-id="1" data-magicpath-path="PortfolioHeroSection.tsx" />

      {/* Top nav pill */}
      <SortableContainer dndKitId="50ca4df9-4756-4b86-b190-c664dd431b54" containerType="regular" prevTag="div" className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-center px-4 pt-6 sm:px-6 lg:px-8" data-magicpath-id="2" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="9b4851e9-7a04-42cc-8018-3542e5800035" containerType="regular" prevTag="nav" aria-label="Primary" className="mx-0 flex items-center gap-4" data-magicpath-id="3" data-magicpath-path="PortfolioHeroSection.tsx">
          <SortableContainer dndKitId="fd58d552-d36e-45d8-a367-68d46bd6445d" containerType="collection" prevTag="div" className="relative flex items-center rounded-[32px] border border-zinc-800/70 bg-zinc-900 px-6 py-4 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.45)]" data-magicpath-id="4" data-magicpath-path="PortfolioHeroSection.tsx">
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
      <SortableContainer dndKitId="da4cc793-b53a-4e12-846b-25ea6214ea72" containerType="regular" prevTag="div" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20" data-magicpath-id="11" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="9189d1d3-f41e-4cdb-b1ea-c6bfb35ef326" containerType="regular" prevTag="div" className="mx-auto max-w-3xl text-center" data-magicpath-id="12" data-magicpath-path="PortfolioHeroSection.tsx">
          <motion.h1 data-magicpath-motion-tag="motion.h1" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          ease: 'easeOut'
        }} className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{
          fontSize: "44px",
          width: "877px",
          maxWidth: "877px",
          color: "#283FE4"
        }} data-magicpath-id="13" data-magicpath-path="PortfolioHeroSection.tsx">
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
          <SortableContainer dndKitId="2f75250d-3ba4-4c71-a8cf-52eacf136576" containerType="regular" prevTag="motion.div" initial={{
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
          <SortableContainer dndKitId="a8aad160-f598-4a2d-abc7-66c59319b6cc" containerType="regular" prevTag="motion.div" initial={{
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
            <SortableContainer dndKitId="78aecee8-9241-4b48-9c41-1de65123fbbc" containerType="regular" prevTag="div" className="flex items-center justify-center gap-3" data-magicpath-id="20" data-magicpath-path="PortfolioHeroSection.tsx">
              <SortableContainer dndKitId="e340ae2e-c5cd-481f-b6d7-421f9abfe304" containerType="regular" prevTag="div" className="relative" data-magicpath-id="21" data-magicpath-path="PortfolioHeroSection.tsx">
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
          <SortableContainer dndKitId="3270ae43-1de3-4040-9319-2b99e0c3e24f" containerType="regular" prevTag="motion.div" initial={{
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

            <SortableContainer dndKitId="058f60c6-9b3d-4133-88eb-c44834314614" containerType="collection" prevTag="ul" className="flex items-center justify-center gap-2" data-magicpath-id="31" data-magicpath-path="PortfolioHeroSection.tsx">
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
      <SortableContainer dndKitId="9d267bd8-377c-43a3-9062-8cffad0daf2b" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="36" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="37" data-magicpath-path="PortfolioHeroSection.tsx">
          PRT
        </span>
      </SortableContainer>
      <SortableContainer dndKitId="91820f21-286a-42ed-8618-1548944c623b" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="38" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="39" data-magicpath-path="PortfolioHeroSection.tsx">
          FOL
        </span>
      </SortableContainer>
    </SortableContainer>;
};