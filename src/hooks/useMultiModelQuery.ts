import { useState, useCallback, useRef } from "react";
import { usePuter } from "@/hooks/usePuter";
import { queryModel } from "@/lib/ai-clients";
import { AIResponse, ResponseLength } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface UseMultiModelQueryProps {
    prompt: string;
    selectedModels: string[];
    responseLength: ResponseLength;
    availableModels: { id: string; name: string }[];
}

export function useMultiModelQuery({
    prompt,
    selectedModels,
    responseLength,
    availableModels
}: UseMultiModelQueryProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [responses, setResponses] = useState<AIResponse[]>([]);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const { isPuterReady, error: puterError } = usePuter();
    const { toast } = useToast();

    // Keep track of the latest responses to support partial updates if we decide to go that route later,
    // but for now sticking to the existing pattern of setting all at once.

    const stopQuery = useCallback(() => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setIsLoading(false);
            toast({
                title: "Query Stopped",
                description: "AI query has been stopped",
            });
        }
    }, [abortController, toast]);

    const queryAllModels = useCallback(async () => {
        if (!isPuterReady) {
            toast({
                title: "Error",
                description: "Puter API is not ready yet. Please wait...",
                variant: "destructive",
            });
            return;
        }

        if (puterError) {
            toast({
                title: "Error",
                description: "Failed to initialize Puter API. Please refresh the page.",
                variant: "destructive",
            });
            return;
        }

        if (!prompt.trim()) {
            toast({
                title: "Error",
                description: "Please enter a prompt",
                variant: "destructive",
            });
            return;
        }

        if (selectedModels.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one AI model",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setResponses([]); // Clear previous results

        // Create new controller
        const controller = new AbortController();
        setAbortController(controller);

        try {
            // Execute queries sequentially with a small delay to avoid Puter rate limits
            const results: PromiseSettledResult<Awaited<ReturnType<typeof queryModel>>>[] = [];
            
            for (let i = 0; i < selectedModels.length; i++) {
                if (controller.signal.aborted) {
                    // Fill remaining with rejection
                    for (let j = i; j < selectedModels.length; j++) {
                        results.push({ status: "rejected", reason: "Aborted" });
                    }
                    break;
                }
                
                try {
                    const result = await queryModel(selectedModels[i], prompt, responseLength);
                    results.push({ status: "fulfilled", value: result });
                } catch (error) {
                    results.push({ status: "rejected", reason: error });
                }
                
                // Small delay between requests to avoid rate limiting (except after last)
                if (i < selectedModels.length - 1 && !controller.signal.aborted) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            if (controller.signal.aborted) {
                return;
            }

            const formattedResponses: AIResponse[] = results.map((result, index) => {
                const modelId = selectedModels[index];
                const modelName = availableModels.find(m => m.id === modelId)?.name || "Unknown";

                if (result.status === "fulfilled") {
                    // The queryModel returns model: modelId. We might want to inject the display name here
                    // or handle it in the UI. The UI currently expects 'model' to be the name?
                    // Looking at previous MultiAIQuery: 
                    // `formattedResponses... return { model: modelName ... }`
                    // So let's override the model field with the display name for consistency with UI.
                    return {
                        ...result.value,
                        model: modelName
                    };
                } else {
                    return {
                        model: modelName,
                        response: "",
                        error: "Failed to get response",
                    };
                }
            });

            setResponses(formattedResponses);

        } catch (error) {
            if (!controller.signal.aborted) {
                console.error("Query Error:", error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred during queries.",
                    variant: "destructive",
                });
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false);
                setAbortController(null);
            }
        }
    }, [prompt, selectedModels, responseLength, isPuterReady, puterError, availableModels, toast]);

    return {
        isLoading,
        responses,
        queryAllModels,
        stopQuery,
        isPuterReady, // exposing this just in case
        setResponses // exposing setter might be useful for clearing
    };
}
