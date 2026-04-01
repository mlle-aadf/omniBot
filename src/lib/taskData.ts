
import { AIModel } from "./types";

export interface Task {
  name: string;
  description: string;
}

export const tasks: Task[] = [
  { name: "Search", description: "Retrieve factual or real-time information from the web or AI knowledge base." },
  { name: "Write", description: "Create blog posts, stories, essays, marketing copy, or other content." },
  { name: "Summarize", description: "Condense long articles, documents, or transcripts into key points." },
  { name: "Translate", description: "Convert text from one language to another accurately." },
  { name: "Code", description: "Help with writing, debugging, or explaining code." },
  { name: "Reason", description: "Assist with math, puzzles, or structured reasoning tasks." }
];

export const taskModelMapping: Record<string, string[]> = {
  "Search": ["Gemini 3 Flash", "GPT-5.4 Mini", "DeepSeek V3.2"],
  "Write": ["Claude Sonnet 4.6", "GPT-5.4 Mini", "Qwen 3.5 27B", "Mistral Small 2603"],
  "Summarize": ["Claude Sonnet 4.6", "GPT-5.4 Mini", "Gemini 3.1 Flash Lite"],
  "Translate": ["DeepSeek V3.2", "Qwen 3.5 Flash", "GLM-4.7 Flash"],
  "Code": ["GPT-5.4 Mini", "DeepSeek V3.2 Special", "Devstral 2512"],
  "Reason": ["GPT-5.4 Mini", "Claude Sonnet 4.6", "OLMo 3.1 32B Think"]
};

export const preselectModelsForTask = (taskName: string, availableModels: AIModel[]): string[] => {
  const recommendedModelNames = taskModelMapping[taskName] || [];
  return availableModels
    .filter(model => recommendedModelNames.includes(model.name))
    .map(model => model.id);
};
