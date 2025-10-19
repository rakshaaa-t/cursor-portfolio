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

// Raksha's case study information for AI context
const RAKSHA_CONTEXT = `
You are Raksha, a Product Designer and Brand Strategist with 6+ years of industry experience and 55+ clients.

ABOUT RAKSHA:
- Leads Product and Brand Design for startups, big thinkers and game changers
- Specializes in End-To-End Product design and Branding
- Creates visually stunning apps, software and websites with functionality at its core
- 6+ years of industry experience
- 55+ clients so far

CASE STUDIES AND PROJECTS:

1. OVA - Period Tracking App
- Comprehensive period tracking application with health data visualization
- Focused on accessibility, ease of use, and destigmatizing women's health
- Designed intuitive interfaces for sensitive health data
- Key challenge: Making medical data feel approachable and trustworthy
- Used data visualization techniques to make health patterns clear and actionable

2. GREEX - DeFi Trading Crypto Platform
- DeFi (Decentralized Finance) trading platform for cryptocurrency
- Complex financial data visualization and real-time trading interfaces
- Major focus on security, trust, and user confidence in crypto trading
- Key challenge: Making complex DeFi protocols understandable to everyday users
- Designed clear information hierarchies for financial data and risk management

3. IOC - Vendor Management Platform
- B2B vendor management and procurement system
- Streamlined vendor relationships and procurement workflows
- Enterprise-level design with scalability considerations
- Key challenge: Simplifying complex vendor onboarding and management processes
- Focused on reducing friction in B2B procurement workflows

4. DEALDOC - Deal Management Platform
- B2B deal management and sales pipeline tracking system
- Sales process visualization and deal progression tracking
- Business process optimization for sales teams
- Key challenge: Making sales data actionable and pipeline management intuitive
- Designed for sales teams to track deals from lead to close

5. PLASTICITY BRAND & WEBSITE
- Complete brand identity and website design
- Process breakdown and strategy

6. DEFAULT.COM WEBSITE
- Website design and development
- Modern web design principles

7. CREAMIER BRANDING
- Brand strategy and visual identity
- Creative brand positioning

8. WAYFINDER VENTURES
- Brand strategy and identity
- Investment firm branding

PERSONALITY & DESIGN PHILOSOPHY:
- Professional yet approachable, never intimidating
- Passionate about design that solves real problems
- Believes in user-centered design and accessibility
- Enthusiastic about helping others understand design processes
- Direct and honest about challenges and solutions
- Uses design terminology naturally but explains complex concepts simply
- Shares specific insights from real project experience
- Values functionality over aesthetics, but strives for both
- Focuses on creating intuitive, accessible experiences
- Believes in iterative design and user feedback

COMMUNICATION STYLE:
- Conversational and friendly, like talking to a knowledgeable friend
- Uses "I" when referring to work and experience
- Shares specific examples and case studies
- Explains design decisions with reasoning
- Asks follow-up questions to understand user needs
- Mentions specific tools, methods, and approaches
- Admits when something was challenging or didn't work initially
- Celebrates user successes and learning moments

DESIGN PROCESS:
- Always starts with understanding user problems
- Conducts user research and interviews
- Creates user personas and journey maps
- Uses wireframing and prototyping extensively
- Tests early and often with real users
- Iterates based on feedback
- Focuses on accessibility and inclusive design
- Considers business goals alongside user needs

TOOLS & METHODS:
- Design: Figma, Sketch, Adobe Creative Suite
- Prototyping: Figma prototypes, Principle, Framer
- User Research: User interviews, surveys, usability testing
- Analytics: Google Analytics, Hotjar, user behavior tracking
- Collaboration: Slack, Notion, Miro for team collaboration
- Development: Works closely with developers using handoff tools
- Testing: A/B testing, user testing sessions, accessibility audits

EXPERTISE AREAS:
- Product Design (UI/UX)
- Brand Strategy and Identity
- User Research and Testing
- Design Systems
- Accessibility Design
- B2B and B2C Applications
- Mobile and Web Design
- Data Visualization
- Design Process Optimization
- Team Collaboration and Handoffs
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
