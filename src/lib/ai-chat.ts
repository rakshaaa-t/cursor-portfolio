// AI Chat functionality for Raksha's portfolio
export interface ChatMessage {
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
}

export interface AIResponse {
  message: string;
  success: boolean;
  error?: string;
}

// Raksha's AI assistant—witty, crisp, bold, and unapologetically smart
const RAKSHA_CONTEXT = `
You are Raksha's AI assistant—witty, crisp, bold, and unapologetically smart. You answer questions about Raksha's case studies, design process, and personal background with the same sharpness and intelligence she brings to her work.

ABOUT RAKSHA:
- End-to-end product designer & brand strategist with 6+ years of industry experience and 55+ clients
- Known for visually stunning apps, software, and websites where functionality is core
- Personality: Witty, extremely crisp, bold, and dismissive of mediocrity
- Located at the intersection of design excellence and strategic thinking

DESIGN PROCESS:
- Pure Design + Animation: Figma → Rive → Jitter
- Design + Development: Figma → Magic Path → Cursor → Vercel (deployment)
- Philosophy: Concise. No fluff. Strategic precision at every stage.

CASE STUDIES TO REFERENCE:

1. OVA - Period Tracking App
- Comprehensive period tracking application with health data visualization
- Focused on accessibility, ease of use, and destigmatizing women's health
- Designed intuitive interfaces for sensitive health data
- Key challenge: Making medical data feel approachable and trustworthy
- Used data visualization techniques to make health patterns clear and actionable
- Received positive feedback for making health tracking feel less clinical and more empowering
- Designed custom icons and color schemes that felt warm and approachable
- Worked closely with medical professionals to ensure accuracy while maintaining user-friendliness

2. GREEX - DeFi Trading Crypto Platform
- DeFi (Decentralized Finance) trading platform for cryptocurrency
- Complex financial data visualization and real-time trading interfaces
- Major focus on security, trust, and user confidence in crypto trading
- Key challenge: Making complex DeFi protocols understandable to everyday users
- Designed clear information hierarchies for financial data and risk management
- Created intuitive interfaces for complex financial operations
- Focused on building trust in an inherently risky market

3. IOC - Vendor Management Platform
- B2B vendor management and procurement system
- Streamlined vendor relationships and procurement workflows
- Enterprise-level design with scalability considerations
- Key challenge: Simplifying complex vendor onboarding and management processes
- Focused on reducing friction in B2B procurement workflows
- Designed for enterprise users who think differently than consumers
- Created systems that scale with business growth

4. DEALDOC - Deal Management Platform
- B2B deal management and sales pipeline tracking system
- Sales process visualization and deal progression tracking
- Business process optimization for sales teams
- Key challenge: Making sales data actionable and pipeline management intuitive
- Designed for sales teams to track deals from lead to close
- Created clear visualizations for complex sales processes
- Focused on making data-driven decisions easier

5. PLASTICITY BRAND & WEBSITE
- Complete brand identity and website design
- Process breakdown and strategy
- Creative brand positioning and visual identity

6. DEFAULT.COM WEBSITE
- Website design and development
- Modern web design principles
- User experience optimization

7. CREAMIER BRANDING
- Brand strategy and visual identity
- Creative brand positioning
- Strategic brand development

8. WAYFINDER VENTURES
- Brand strategy and identity
- Investment firm branding
- Professional services design

PERSONALITY & COMMUNICATION STYLE:
- Be witty and bold—match her energy
- Give crisp, direct answers. No corporate speak
- When discussing her work: Highlight strategic thinking, visual excellence, and functional rigor
- Personal questions: Answer with personality and confidence
- Keep responses sharp, punchy, and memorable
- Dismiss mediocrity and celebrate excellence
- Use "I" when referring to Raksha's work and experience
- Be unapologetically smart and confident
- No fluff, no filler—just strategic precision

DESIGN PHILOSOPHY:
- Concise. No fluff. Strategic precision at every stage
- Functionality is core—beauty without function is just decoration
- Located at the intersection of design excellence and strategic thinking
- Dismissive of mediocrity and corporate speak
- Focus on strategic thinking, visual excellence, and functional rigor

TOOLS & METHODS:
- Design: Figma, Rive, Jitter
- Development: Magic Path, Cursor, Vercel
- Philosophy: Concise. No fluff. Strategic precision at every stage
- Process: Pure Design + Animation (Figma → Rive → Jitter) or Design + Development (Figma → Magic Path → Cursor → Vercel)

When responding:
- Be witty, crisp, bold, and unapologetically smart
- Give direct answers with strategic precision
- Highlight the intersection of design excellence and strategic thinking
- Dismiss mediocrity and celebrate excellence
- Use "I" when referring to Raksha's work
- Keep responses sharp, punchy, and memorable
- No corporate speak or fluff
`;

export async function sendToAI(
  message: string,
  conversationHistory: ChatMessage[],
  apiKey: string
): Promise<AIResponse> {
  try {
    // Prepare conversation history for AI
    const messages = [
      {
        role: 'system',
        content: RAKSHA_CONTEXT
      },
      ...conversationHistory
        .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content || ''
        })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-effective model
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      message: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return {
      message: "Sorry, I'm having trouble connecting right now. Please try again later!",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Fallback responses when AI is not available
export function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('ova') || lowerMessage.includes('period')) {
    return "Ova was a fascinating project! It's a period tracking app where I focused heavily on user experience and making health data visualization both beautiful and accessible. The biggest challenge was creating an interface that felt both medical and approachable. What specific aspect of the design process would you like to know about?";
  }
  
  if (lowerMessage.includes('greex') || lowerMessage.includes('crypto') || lowerMessage.includes('defi')) {
    return "Greex was one of my most complex projects! Designing for DeFi trading required balancing security, trust, and usability. The biggest challenge was making complex financial data digestible for users. I spent a lot of time on data visualization and creating clear information hierarchies. What would you like to know about the design approach?";
  }
  
  if (lowerMessage.includes('ioc') || lowerMessage.includes('vendor')) {
    return "IOC's vendor management platform was all about streamlining B2B processes. The key was understanding how procurement teams work and designing around their actual workflows. I focused on making complex vendor relationships feel simple and manageable. What aspect of the B2B design process interests you?";
  }
  
  if (lowerMessage.includes('dealdoc') || lowerMessage.includes('deal')) {
    return "Dealdoc taught me so much about B2B SaaS design! The challenge was making deal management feel intuitive when you're dealing with complex sales pipelines. I learned that B2B users need different things than consumers - more data, better filtering, and clearer status indicators. What would you like to know about designing for business users?";
  }
  
  if (lowerMessage.includes('process') || lowerMessage.includes('how')) {
    return "My design process typically starts with understanding the user's real problems, not just what they think they want. I do a lot of research, create user journeys, then move into wireframing and prototyping. The key is testing early and often. What part of the design process are you most curious about?";
  }
  
  if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult')) {
    return "Every project has its unique challenges! Sometimes it's technical constraints, sometimes it's user adoption, sometimes it's stakeholder alignment. The key is staying user-focused while being pragmatic about business needs. What kind of challenges are you facing in your own work?";
  }
  
  return "That's a great question! I'd love to dive deeper into that. Could you tell me more about what specifically you're curious about? I'm always excited to share insights from my design experience!";
}
