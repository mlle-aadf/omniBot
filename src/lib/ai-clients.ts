import { AIResponse, ResponseLength, responseLengthPrompts } from "@/lib/types";

// Configuration mapping internal IDs to Puter model identifiers
export const MODEL_CONFIG: Record<string, string> = {
  gpt4: 'gpt-4o-mini',
  gemini: 'gemini-2.0-flash',
  claude: 'claude-sonnet-4.5', 
  deepseek: 'deepseek-chat',
  grok: 'x-ai/grok-2', 
  llama: 'meta-llama/llama-3.1-405b-instruct:free',
  mistral: 'mistral-large-latest',
  gemma: 'google/gemma-2-27b-it',
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