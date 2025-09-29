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
    href: '#home'
  }, {
    label: 'Work',
    href: '#work'
  }, {
    label: '0–1 Process',
    href: '#process'
  }, {
    label: 'Design Vault',
    href: '#vault'
  }, {
    label: 'Vibe Coded',
    href: '#vibe'
  }] as any[];
  const social = [{
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: Mail
  }, {
    label: 'GitHub',
    href: 'https://github.com/',
    icon: Github
  }, {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: Linkedin
  }, {
    label: 'Resume',
    href: '#resume',
    icon: Download
  }] as any[];

  // @return
  return <section aria-label="Portfolio hero" className="relative isolate overflow-hidden bg-gradient-to-b from-white to-zinc-50 text-zinc-900">
      {/* Subtle pixel-like backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{
      backgroundImage: 'radial-gradient(rgba(24,24,27,0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} />

      {/* Top nav pill */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-center px-4 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Primary" className="mx-0 flex items-center gap-4">
          <div className="relative flex items-center rounded-[32px] border border-zinc-800/70 bg-zinc-900 px-6 py-4 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.45)]">
            {navItems.map(item => <a key={item.label} href={item.href} className="relative mx-6 inline-flex items-center py-1 text-lg font-medium tracking-wide text-zinc-400 transition-colors hover:text-white focus:outline-none">
                <span className="relative z-10">{item.label}</span>
                {item.label === 'Home' ? <span aria-hidden className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] h-1 w-20 -translate-x-1/2 rounded-full bg-[oklch(0.6_0.2_264)] shadow-[0_0_24px_6px_oklch(0.6_0.2_264_/_55%)]" /> : null}
              </a>)}
          </div>
          <a href="#contact" className="relative inline-flex items-center justify-center rounded-[28px] border border-[oklch(0.6_0.2_264)] bg-zinc-900 px-8 py-4 text-xl font-semibold text-white shadow-[0_10px_30px_-6px_oklch(0.6_0.2_264_/_45%),inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors hover:text-white focus:outline-none">
            <span>Say Hi !</span>
            <span aria-hidden className="absolute inset-0 rounded-[28px] ring-2 ring-inset ring-[oklch(0.6_0.2_264)]/40" />
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1 initial={{
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
        }}>
            End-To-End Product design and Branding. Visually stunning apps, softwares and wesbites with functionality at it’s core.
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.05
        }} className="mt-4 text-pretty text-xl text-zinc-700 sm:text-2xl">
            I craft visually rich apps, websites, and brand systems anchored in
            clarity, performance, and accessibility—turning ideas into products
            people love to use.
          </motion.p>

          <motion.p initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.1
        }} className="mt-6 max-w-2xl mx-auto text-zinc-600">
            6+ years designing for startups and scale-ups. Available for select
            collaborations and advisory.
          </motion.p>

          {/* Center orb */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.15
        }} className="relative mx-auto mt-10 h-16 w-16 sm:h-20 sm:w-20" aria-hidden>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-300 via-emerald-300 to-amber-200 blur-lg opacity-70" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-cyan-200 via-emerald-200 to-yellow-200 shadow-inner" />
          </motion.div>

          {/* Greeting bubble */}
          <motion.div initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.2
        }} className="mt-10 mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <img src="https://i.pravatar.cc/80?img=13" alt="Your avatar" className="size-9 rounded-full border border-zinc-200 object-cover" />
                <span className="absolute -right-0 -bottom-0 inline-block size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <p className="text-sm text-zinc-700">
                Hi, I’m <span className="font-semibold">Your Name</span>. Nice
                to meet you. What’s up?
              </p>
            </div>
          </motion.div>

          {/* CTA and social */}
          <motion.div initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.25
        }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#work" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">
              View projects
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">
              Contact
            </a>

            <div className="mx-1 hidden h-5 w-px bg-zinc-200 sm:block" aria-hidden />

            <ul className="flex items-center justify-center gap-2">
              {social.map(s => <li key={s.label}>
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">
                    <s.icon className="size-4" aria-hidden />
                    <span className="hidden sm:inline">{s.label}</span>
                  </a>
                </li>)}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Decorative side initials */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900">
          PRT
        </span>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-zinc-900">
          FOL
        </span>
      </div>
    </section>;
};