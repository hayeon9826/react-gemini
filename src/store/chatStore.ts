import { create } from "zustand";

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages: Message[]) => set({ messages }),
}));
