import { AIResponse, ResponseLength, responseLengthPrompts } from "@/lib/types";

// Configuration mapping internal IDs to Puter model identifiers
export const MODEL_CONFIG: Record<string, string> = {
  'claude-haiku': 'anthropic/claude-haiku-4-5',
  'claude-sonnet': 'anthropic/claude-sonnet-4-6',
  'gemini-flash-lite': 'google/gemini-3.1-flash-lite-preview',
  'gemini-flash': 'google/gemini-3-flash-preview',
  'gpt-nano': 'openai/gpt-5.4-nano',
  'gpt-mini': 'openai/gpt-5.4-mini',
  'qwen-flash': 'qwen/qwen3.5-flash-02-23',
  'qwen-27b': 'qwen/qwen3.5-27b',
  'deepseek': 'deepseek/deepseek-v3.2',
  'deepseek-special': 'deepseek/deepseek-v3.2-speciale',
  'mistral-small': 'mistralai/mistral-small-2603',
  'devstral': 'mistralai/devstral-2512',
  'olmo-instruct': 'allenai/olmo-3.1-32b-instruct',
  'olmo-think': 'allenai/olmo-3.1-32b-think',
  'nemotron': 'nvidia/nemotron-3-nano-30b-a3b',
  'trinity': 'arcee-ai/trinity-large-preview:free',
  'minimax': 'minimax/minimax-m2.7',
  'seed': 'bytedance-seed/seed-2.0-mini',
  'glm': 'z-ai/glm-4.7-flash',
};

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

export async function queryModel(
  modelId: string,
  prompt: string,
  responseLength?: ResponseLength
): Promise<AIResponse> {
  try {
    ensurePuter();

    const puterModelId = MODEL_CONFIG[modelId];
    if (!puterModelId) {
      throw new Error(`Unknown model ID: ${modelId}`);
    }

    const fullPrompt = buildPromptWithLength(prompt, responseLength);

    // Puter's chat API signature: chat(message, options)
    const response = await window.puter.ai.chat(fullPrompt, {
      model: puterModelId,
    });

    console.log(`${modelId} Response:`, response);

    // Standardize response extraction
    let content: string | undefined;

    // Different models might return slightly different structures via Puter,
    // though Puter aims to normalize. Handling known variations:
    if (response?.message?.content) {
      if (Array.isArray(response.message.content)) {
        // Claude might return an array of content blocks
        content = response.message.content[0]?.text;
      } else {
        content = response.message.content;
      }
    }

    if (!content) {
      // Fallback or specific check for other structures if needed
      console.warn(`Unexpected response structure for ${modelId}:`, response);
      throw new Error("Invalid response structure");
    }

    return {
      model: modelId, // Returning internal ID or we could look up the name
      response: content,
    };
  } catch (error) {
    console.error(`${modelId} Error:`, error);
    // Return error state instead of throwing, so Promise.allSettled isn't needed strictly for individual failures if we handle at this level?
    // The previous implementation utilized Promise.allSettled at the call site and threw here. 
    // I will stick to throwing to let the caller manage the failure state explicitly.
    throw error;
  }
}