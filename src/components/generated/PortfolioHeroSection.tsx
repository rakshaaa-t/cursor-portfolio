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
    mpid: "ab001cc3-ecae-4858-be57-e0c1ea6dc2b0"
  }, {
    label: 'Work',
    href: '#work',
    mpid: "b2a80de9-ce29-4070-8862-c40822693e6c"
  }, {
    label: '0–1 Process',
    href: '#process',
    mpid: "5eaad735-8918-4466-a134-b17970739fc1"
  }, {
    label: 'Design Vault',
    href: '#vault',
    mpid: "dcd697d2-2b52-4dfa-9363-d6429e16a00c"
  }, {
    label: 'Vibe Coded',
    href: '#vibe',
    mpid: "f11ddcb8-c517-483b-85dc-844c7e1a22d7"
  }] as any[];
  const social = [{
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: Mail,
    mpid: "9e6a9dd1-4557-4fb0-84ec-6b94d35e5006"
  }, {
    label: 'GitHub',
    href: 'https://github.com/',
    icon: Github,
    mpid: "dbc0e92e-d310-4619-95a5-fc89337f10da"
  }, {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: Linkedin,
    mpid: "c792f0ab-3395-4398-bce1-da679bedb6ef"
  }, {
    label: 'Resume',
    href: '#resume',
    icon: Download,
    mpid: "c3a07563-8ed9-4935-8de6-6330b760a440"
  }] as any[];

  // @return
  return <SortableContainer dndKitId="4538ac97-ca2b-4407-bf1a-2cee76e756c7" containerType="regular" prevTag="section" aria-label="Portfolio hero" className="relative isolate overflow-hidden bg-gradient-to-b from-white to-zinc-50 text-zinc-900" data-magicpath-id="0" data-magicpath-path="PortfolioHeroSection.tsx">
      {/* Subtle pixel-like backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{
      backgroundImage: 'radial-gradient(rgba(24,24,27,0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} data-magicpath-id="1" data-magicpath-path="PortfolioHeroSection.tsx" />

      {/* Top nav pill */}
      <SortableContainer dndKitId="a5e45a23-e67a-46e2-9eae-0387a2e9d386" containerType="regular" prevTag="div" className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-center px-4 pt-6 sm:px-6 lg:px-8" data-magicpath-id="2" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="4e48c083-a67c-42a9-b2fd-d472c08c5f28" containerType="regular" prevTag="nav" aria-label="Primary" className="mx-0 flex items-center gap-4" data-magicpath-id="3" data-magicpath-path="PortfolioHeroSection.tsx">
          <SortableContainer dndKitId="978755f6-d452-4624-b671-251f31cff453" containerType="collection" prevTag="div" className="relative flex items-center rounded-[32px] border border-zinc-800/70 bg-zinc-900 px-6 py-4 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.45)]" data-magicpath-id="4" data-magicpath-path="PortfolioHeroSection.tsx">
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
      <SortableContainer dndKitId="da630dba-a9bd-4f16-a132-fc0bc2f9b36f" containerType="regular" prevTag="div" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20" data-magicpath-id="11" data-magicpath-path="PortfolioHeroSection.tsx">
        <SortableContainer dndKitId="9cfb4099-31ee-4dc0-ad98-9d7dd3965e60" containerType="regular" prevTag="div" className="mx-auto max-w-3xl text-center" data-magicpath-id="12" data-magicpath-path="PortfolioHeroSection.tsx">
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
          <SortableContainer dndKitId="dc19f70e-816a-4990-8de5-f34a2e6c7d99" containerType="regular" prevTag="motion.div" initial={{
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
          <SortableContainer dndKitId="0c820124-ff20-46a2-8e6b-4fc51b0fe844" containerType="regular" prevTag="motion.div" initial={{
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
            <SortableContainer dndKitId="d60216ef-0d62-40bc-ad10-2eff14df6e22" containerType="regular" prevTag="div" className="flex items-center justify-center gap-3" data-magicpath-id="20" data-magicpath-path="PortfolioHeroSection.tsx">
              <SortableContainer dndKitId="d66d3dcb-aa7c-4f73-8693-246e8f675061" containerType="regular" prevTag="div" className="relative" data-magicpath-id="21" data-magicpath-path="PortfolioHeroSection.tsx">
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
          <SortableContainer dndKitId="5f9fb5d2-14ef-4280-9c1f-15d0b63e5f6e" containerType="regular" prevTag="motion.div" initial={{
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

            <SortableContainer dndKitId="04ee3faa-845e-4922-acf8-85bf1edb5ae1" containerType="collection" prevTag="ul" className="flex items-center justify-center gap-2" data-magicpath-id="31" data-magicpath-path="PortfolioHeroSection.tsx">
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
      <SortableContainer dndKitId="6f4d9ad9-52a3-441a-b136-371a05f68d5b" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="36" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="37" data-magicpath-path="PortfolioHeroSection.tsx">
          PRT
        </span>
      </SortableContainer>
      <SortableContainer dndKitId="cb9ae4b8-3663-4336-b998-e13f3e0d08da" containerType="regular" prevTag="div" aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex" data-magicpath-id="38" data-magicpath-path="PortfolioHeroSection.tsx">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900" data-magicpath-id="39" data-magicpath-path="PortfolioHeroSection.tsx">
          FOL
        </span>
      </SortableContainer>
    </SortableContainer>;
};