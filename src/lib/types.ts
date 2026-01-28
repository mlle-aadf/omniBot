
export interface AIModel {
  id: string;
  name: string;
  queryFn: (prompt: string, responseLength?: ResponseLength) => Promise<AIResponse>;
}

export interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

export type ViewLayout = "columns" | "rows";

export type ResponseLength = "brief" | "balanced" | "detailed";

export interface Task {
  name: string;
  description: string;
}

export const responseLengthPrompts: Record<ResponseLength, string> = {
  brief: "Respond in 75 words or less. Be concise and direct.",
  balanced: "Respond in 200 words or less. Be clear and thorough.",
  detailed: "Respond in 400 words or less. Provide comprehensive detail with examples."
};
