/// <reference types="vite/client" />

interface Puter {
    ai: {
        chat: (response: string, options?: { model?: string; stream?: boolean }) => Promise<any>;
    };
}

interface Window {
    puter: Puter;
}
