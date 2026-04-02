import { AIModel } from './types';

export const availableModels: AIModel[] = [
  // US Premium
  { id: 'claude-sonnet',    name: 'Claude Sonnet 4.6',      provider: 'Anthropic',  origin: 'US', tier: 'premium', speed: 'mid',  specialties: ['write', 'analyze', 'brainstorm'] },
  { id: 'gpt-mini',         name: 'GPT-5.4 Mini',           provider: 'OpenAI',     origin: 'US', tier: 'premium', speed: 'fast', specialties: ['chat', 'write', 'analyze'] },
  { id: 'gemini-flash',     name: 'Gemini 3 Flash',         provider: 'Google',     origin: 'US', tier: 'premium', speed: 'fast', specialties: ['chat', 'brainstorm'] },

  // US Fast
  { id: 'claude-haiku',     name: 'Claude Haiku 4.5',       provider: 'Anthropic',  origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat', 'write'] },
  { id: 'gemini-flash-lite',name: 'Gemini 3.1 Flash Lite',  provider: 'Google',     origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'gpt-nano',         name: 'GPT-5.4 Nano',           provider: 'OpenAI',     origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat'] },
  { id: 'nemotron',         name: 'Nemotron 3 Nano',        provider: 'NVIDIA',     origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat'] },

  // US Open
  { id: 'olmo-instruct',    name: 'OLMo 3.1 32B',           provider: 'AI2',        origin: 'US', tier: 'open',    speed: 'mid',  specialties: ['chat', 'write'] },
  { id: 'olmo-think',       name: 'OLMo 3.1 32B Think',     provider: 'AI2',        origin: 'US', tier: 'open',    speed: 'slow', specialties: ['analyze'] },
  { id: 'trinity',          name: 'Trinity Large',           provider: 'Arcee AI',   origin: 'US', tier: 'open',    speed: 'mid',  specialties: ['chat'] },

  // CN
  { id: 'deepseek',         name: 'DeepSeek V3.2',          provider: 'DeepSeek',   origin: 'CN', tier: 'open',    speed: 'mid',  specialties: ['chat', 'analyze', 'translate'] },
  { id: 'deepseek-special', name: 'DeepSeek V3.2 Special',  provider: 'DeepSeek',   origin: 'CN', tier: 'open',    speed: 'slow', specialties: ['analyze'] },
  { id: 'qwen-flash',       name: 'Qwen 3.5 Flash',         provider: 'Alibaba',    origin: 'CN', tier: 'open',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'qwen-27b',         name: 'Qwen 3.5 27B',           provider: 'Alibaba',    origin: 'CN', tier: 'open',    speed: 'mid',  specialties: ['write', 'translate'] },
  { id: 'glm',              name: 'GLM-4.7 Flash',          provider: 'Zhipu',      origin: 'CN', tier: 'open',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'seed',             name: 'Seed 2.0 Mini',           provider: 'ByteDance',  origin: 'CN', tier: 'open',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'minimax',          name: 'MiniMax M2.7',            provider: 'MiniMax',    origin: 'CN', tier: 'open',    speed: 'mid',  specialties: ['chat', 'brainstorm'] },

  // FR / EU
  { id: 'mistral-small',    name: 'Mistral Small 2603',     provider: 'Mistral',    origin: 'FR', tier: 'premium', speed: 'mid',  specialties: ['write', 'translate'] },
  { id: 'devstral',         name: 'Devstral 2512',          provider: 'Mistral',    origin: 'FR', tier: 'open',    speed: 'mid',  specialties: ['analyze'] },
];