// Hidden configuration for Raksha's portfolio
// This file contains the API key and settings that users won't see

export const AI_CONFIG = {
  // Replace this with your actual OpenAI API key
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY || 'sk-proj-your-openai-key-here',
  
  // AI is always enabled for users
  ENABLED: true,
  
  // Model settings
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  
  // Fallback when API fails
  USE_FALLBACK: true
};

// Instructions for updating the API key:
// 1. Replace 'sk-proj-your-openai-key-here' with your actual API key
// 2. Commit and push the changes
// 3. The website will automatically redeploy with the new key
