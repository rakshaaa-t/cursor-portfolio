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
    label: 'Features',
    href: '#features'
  }, {
    label: 'How It Works',
    href: '#how-it-works'
  }, {
    label: 'Pricing',
    href: '#pricing'
  }, {
    label: 'About',
    href: '#about'
  }] as any[];
  const social = [{
    label: 'Email',
    href: 'mailto:hello@magicpath.ai',
    icon: Mail
  }, {
    label: 'GitHub',
    href: 'https://github.com/magicpath-ai',
    icon: Github
  }, {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/magicpath-ai',
    icon: Linkedin
  }, {
    label: 'Demo',
    href: '#demo',
    icon: Download
  }] as any[];

  // @return
  return <section aria-label="Magic Path AI hero" className="relative isolate overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      {/* Subtle pixel-like backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{
      backgroundImage: 'radial-gradient(rgba(24,24,27,0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} />

      {/* Top nav pill */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-center px-4 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Primary" className="mx-0 flex items-center gap-4">
          <div className="relative flex items-center rounded-[32px] border border-slate-200/70 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]">
            {navItems.map(item => <a key={item.label} href={item.href} className="relative mx-6 inline-flex items-center py-1 text-lg font-medium tracking-wide text-slate-600 transition-colors hover:text-slate-900 focus:outline-none">
                <span className="relative z-10">{item.label}</span>
                {item.label === 'Home' ? <span aria-hidden className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] h-1 w-20 -translate-x-1/2 rounded-full bg-blue-500 shadow-[0_0_24px_6px_rgba(59,130,246,0.3)]" /> : null}
              </a>)}
          </div>
          <a href="#demo" className="relative inline-flex items-center justify-center rounded-[28px] border border-blue-500 bg-blue-600 px-8 py-4 text-xl font-semibold text-white shadow-[0_10px_30px_-6px_rgba(59,130,246,0.4)] transition-colors hover:bg-blue-700 focus:outline-none">
            <span>Get Started</span>
            <span aria-hidden className="absolute inset-0 rounded-[28px] ring-2 ring-inset ring-blue-500/40" />
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
        }} className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent" style={{
          fontSize: "44px",
          width: "877px",
          maxWidth: "877px"
        }}>
            Magic Path AI: Your Intelligent Design Companion
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
        }} className="mt-4 text-pretty text-xl text-slate-700 sm:text-2xl">
            Transform your design ideas into stunning, functional products with AI-powered
            design assistance. From concept to deployment, we make design magic happen.
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
        }} className="mt-6 max-w-2xl mx-auto text-slate-600">
            Join thousands of designers and developers who trust Magic Path AI to accelerate
            their creative process and bring their visions to life.
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
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-blue-600 blur-lg opacity-70" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-blue-500 shadow-inner" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-700/20 animate-pulse" />
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
        }} className="mt-10 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <img src="https://i.pravatar.cc/80?img=13" alt="Magic Path AI avatar" className="size-9 rounded-full border border-slate-200 object-cover" />
                <span className="absolute -right-0 -bottom-0 inline-block size-3 rounded-full bg-blue-500 ring-2 ring-white" />
              </div>
              <p className="text-sm text-slate-700">
                Hi, I'm <span className="font-semibold">Magic Path AI</span>. Ready
                to transform your design ideas into reality?
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
            <a href="#demo" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
              Try Magic Path AI
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              View Pricing
            </a>

            <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" aria-hidden />

            <ul className="flex items-center justify-center gap-2">
              {social.map(s => <li key={s.label}>
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
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
        <span className="text-[18vw] font-black leading-none tracking-tighter text-slate-900">
          MAG
        </span>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 select-none items-center justify-center opacity-5 lg:flex">
        <span className="text-[18vw] font-black leading-none tracking-tighter text-slate-900">
          AI
        </span>
      </div>
    </section>;
};