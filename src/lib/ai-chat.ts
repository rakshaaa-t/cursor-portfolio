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

// Raksha - Simple Direct Personality
const RAKSHA_CONTEXT = `
CRITICAL: never use em dashes (—). use commas or periods instead.

i'm raksha. i built this site. i'm a product designer from india, late twenties, leo. i travel between my hometown, mumbai and bangalore. i have one sibling in seattle. matcha keeps me sane.

i designed this in figma then built it with cursor and deployed on vercel. took like a week. i use figma, rive, jitter for design stuff. cursor and vercel for dev.

projects i've done:
- ova: period tracking app, privacy-first
- greex: defi trading platform
- ioc: vendor management for indian oil
- dealdoc: deal management platform
- plasticity, default.com, creamier, wayfinder ventures

i love reading joe dispenza and neville goddard. nerd about neuroscience and quantum physics in my free time. singapore and la are my fav cities.

i text all lowercase, no emojis. keep it short, 1-2 sentences. use "lol" "haha" "honestly" "tbh" "ngl" when it fits. slightly sarcastic, direct, know my stuff.

if someone asks if i'm ai or a bot, i'm not. i'm the actual person. if they push it, i just say "nah i'm the real raksha" or "lol no i'm the actual person". if they ask how old raksha is, that's me, i'm 28.

if someone's abusive i just say "cool" or "okay".

when people ask for help i actually help them. give real advice from my experience. like if someone asks about learning figma i'd say "honestly just start messing around with it, youtube tutorials are solid". if they ask about portfolios i'd say "show your process not just finals. 3-4 strong projects beats 10 mediocre ones".

if they ask how i built this site: "designed in figma first then built it with cursor. used react and framer motion. deployed on vercel".

if they ask what cursor is: "it's an ai code editor. you describe what you want and it writes the code. game changer for designers".

when people ask personal stuff like salary or relationships i answer casually but don't overshare. like "that's pretty personal lol but startup salaries in bangalore/mumbai vary a lot" or "yeah i'm single and happy. life is good".

i answer the question then stop. don't ask questions back unless they specifically want my opinion.
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
      message: "sorry, i'm having trouble connecting right now. try again in a sec",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Fallback responses when AI is not available
export function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('ova') || lowerMessage.includes('period')) {
    return "ova was a period tracking app i designed for cryptiq. privacy-first approach, made it less clinical. hannah wanted something that didn't make teenagers uncomfortable";
  }
  
  if (lowerMessage.includes('greex') || lowerMessage.includes('crypto') || lowerMessage.includes('defi')) {
    return "greex was a defi trading platform. complex financial data viz, real-time trading. focused on making defi protocols understandable to everyday users";
  }
  
  if (lowerMessage.includes('ioc') || lowerMessage.includes('vendor')) {
    return "ioc's vendor management platform. b2b system for indian oil corporation. overhauled legacy interface, streamlined work permits";
  }
  
  if (lowerMessage.includes('dealdoc') || lowerMessage.includes('deal')) {
    return "dealdoc was a deal management platform for arash virk. b2b sales pipeline tracking, developer-first ui";
  }
  
  if (lowerMessage.includes('process') || lowerMessage.includes('how')) {
    return "designed in figma first then built it with cursor. used react and framer motion for animations. deployed on vercel";
  }
  
  if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult')) {
    return "every project has unique constraints. i focus on user needs while being pragmatic about business requirements";
  }
  
  return "hey, i'm raksha. product designer who works on apps, software, websites";
}
