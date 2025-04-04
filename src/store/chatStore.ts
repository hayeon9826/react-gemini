import { create } from "zustand";
import { saveThreadMessages } from "../firestoreUtils";

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  uid: string;
}

interface ChatState {
  loading: boolean;
  messages: Message[];
  threads: Record<number, Message[]>;
  setThreadMessages: (
    uid: string,
    threadId: number,
    messages: Message[]
  ) => void;
  setThreads: (threads: Record<number, Message[]>) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  threads: {}, // 초기값을 빈 객체로 설정
  loading: false,
  setThreadMessages: (uid: string, threadId: number, messages: Message[]) =>
    set((state) => {
      // Firestore에 스레드 데이터를 저장
      saveThreadMessages(uid, threadId, messages);
      return { threads: { ...state.threads, [threadId]: messages } };
    }),
  setThreads: (threads: Record<number, Message[]>) => set({ threads }),
  setLoading: (loading: boolean) => set({ loading }),
}));
