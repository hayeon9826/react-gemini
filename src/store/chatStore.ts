import { create } from "zustand";
import { saveThreadMessages } from "../firestoreUtils";

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

interface ChatState {
  loading: boolean;
  messages: Message[];
  threads: Record<number, Message[]>;
  setThreadMessages: (threadId: number, messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  threads: JSON.parse(localStorage.getItem("chatThreads") || "{}") as Record<
    number,
    Message[]
  >,
  loading: false,
  setThreadMessages: (threadId: number, messages: Message[]) =>
    set((state) => {
      // const updatedThreads = { ...state.threads, [threadId]: messages };
      // localStorage.setItem("chatThreads", JSON.stringify(updatedThreads));
      saveThreadMessages(threadId, messages);
      return { threads: { ...state.threads, [threadId]: messages } };
    }),
  setLoading: (loading: boolean) => set({ loading }),
}));
