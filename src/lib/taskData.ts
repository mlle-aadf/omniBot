import { AIModel } from './types';

export interface Task {
  id: string;
  name: string;
  description: string;
}

export const tasks: Task[] = [
  { id: 'chat',      name: 'Chat',      description: 'Everyday Q&A, quick answers, conversations.' },
  { id: 'write',     name: 'Write',     description: 'Create blog posts, stories, emails, marketing copy.' },
  { id: 'analyze',   name: 'Analyze',   description: 'Math, logic, summarization, breaking down complex info.' },
  { id: 'translate', name: 'Translate', description: 'Convert text between languages accurately.' },
  { id: 'brainstorm',name: 'Brainstorm',description: 'Generate ideas, explore possibilities, creative problem-solving.' },
];

// Maps task ID to recommended model IDs
export const taskModelMapping: Record<string, string[]> = {
  chat:      ['gpt-nano', 'gemini-flash-lite', 'claude-haiku', 'nemotron', 'qwen-flash', 'glm'],
  write:     ['claude-sonnet', 'qwen-27b', 'mistral-small', 'gpt-mini', 'olmo-instruct'],
  analyze:   ['olmo-think', 'claude-sonnet', 'gpt-mini', 'deepseek-special', 'devstral'],
  translate: ['deepseek', 'qwen-flash', 'glm', 'seed', 'mistral-small'],
  brainstorm:['claude-sonnet', 'gemini-flash', 'qwen-27b', 'minimax', 'mistral-small'],
};