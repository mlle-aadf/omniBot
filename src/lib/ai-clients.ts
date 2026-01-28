import { ResponseLength, responseLengthPrompts } from "@/lib/types";

export interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { model?: string; stream?: boolean }) => Promise<any>;
      };
    };
  }
}

const ensurePuter = () => {
  if (!window.puter) {
    throw new Error('Puter is not initialized');
  }
};

const buildPromptWithLength = (prompt: string, responseLength?: ResponseLength): string => {
  if (!responseLength) return prompt;
  const instruction = responseLengthPrompts[responseLength];
  return `${instruction}\n\n${prompt}`;
};

export async function queryOpenAI(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'gpt-4o-mini' ,
    });

    console.log("OpenAI Response:", response);

    const content = response.message?.content;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "GPT-4o Mini",
      response: content,
    };
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
}

export async function queryGemini(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'gemini-2.0-flash'
    });

    console.log("Gemini Response:", response);

    const content = response.message?.content;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "Gemini",
      response: content,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function queryClaude(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'claude-3-5-sonnet' 
    });

    console.log("Claude Response:", response);

    const content = response.message?.content[0].text;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "Claude",
      response: content,
    };
  } catch (error) {
    console.error("Claude Error:", error);
    throw error;
  }
}

export async function queryDeepseek(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'deepseek-chat' 
    });

    console.log("Deepseek Response:", response);

    const content = response.message?.content;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "Deepseek",
      response: content,
    };
  } catch (error) {
    console.error("Deepseek Error:", error);
    throw error;
  }
}

export async function queryGrok(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'grok-beta' 
    });

    console.log("Grok Response:", response);

    const content = response.message?.content;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "Grok",
      response: content,
    };
  } catch (error) {
    console.error("Grok Error:", error);
    throw error;
  }
}

export async function queryLlama(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo' 
    });

    console.log("Llama Response:", response);

    const content = response.message?.content;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "Llama",
      response: content,
    };
  } catch (error) {
    console.error("Llama Error:", error);
    throw error;
  }
}

export async function queryMistral(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'mistral-large-latest' 
    });

    console.log("Mistral Response:", response);

    const content = response.message?.content;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "Mistral",
      response: content,
    };
  } catch (error) {
    console.error("Mistral Error:", error);
    throw error;
  }
}

export async function queryGemma(prompt: string, responseLength?: ResponseLength): Promise<AIResponse> {
  try {
    ensurePuter();
    const fullPrompt = buildPromptWithLength(prompt, responseLength);
    const response = await window.puter.ai.chat(fullPrompt, {
      model: 'google/gemma-2-27b-it' 
    });

    console.log("Gemma Response:", response);

    const content = response.message?.content;
    if (!content) {
      throw new Error("Invalid response structure");
    }

    return {
      model: "Gemma",
      response: content,
    };
  } catch (error) {
    console.error("Gemma Error:", error);
    throw error;
  }
}

// Simple in-memory cache for responses
const responseCache = new Map<string, AIResponse>();

export async function queryCachedAI(
  prompt: string, 
  queryFn: (prompt: string, responseLength?: ResponseLength) => Promise<AIResponse>,
  responseLength?: ResponseLength
): Promise<AIResponse> {
  const cacheKey = `${queryFn.name}-${prompt}-${responseLength}`;
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }

  const response = await queryFn(prompt, responseLength);
  responseCache.set(cacheKey, response);
  return response;
}

// https://docs.puter.com/prompt.md