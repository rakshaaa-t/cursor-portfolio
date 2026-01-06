import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Container, Theme } from './settings/types';
// %IMPORT_STATEMENT
import { PortfolioHeroSection } from './components/generated/PortfolioHeroSection'
import { GreexCaseStudy } from './components/generated/GreexCaseStudy'
import { OvaCaseStudy } from './components/generated/OvaCaseStudy'
import { IOCCaseStudy } from './components/generated/IOCCaseStudy'
import { DealdocCaseStudy } from './components/generated/DealdocCaseStudy'
import { AIPortfolioCaseStudy } from './components/generated/AIPortfolioCaseStudy'
import { ShadcnExample } from './components/ui/example'
import { MotionTest } from './components/test/MotionTest'

let theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
let container: Container = 'none';

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHeroSection />} />
      <Route path="/greex" element={<GreexCaseStudy />} />
      <Route path="/ova" element={<OvaCaseStudy />} />
      <Route path="/ioc" element={<IOCCaseStudy />} />
      <Route path="/dealdoc" element={<DealdocCaseStudy />} />
      <Route path="/ai-portfolio" element={<AIPortfolioCaseStudy />} />
      <Route path="/examples" element={<ShadcnExample />} />
      <Route path="/motion-test" element={<MotionTest />} />
    </Routes>
  );
}

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  const content = (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );

  if (container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {content}
      </div>
    );
  } else {
    return content;
  }
}

export default App;
