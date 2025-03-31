import { create } from "zustand";

interface StreamState {
  abortController: AbortController | null;
  setAbortController: (controller: AbortController | null) => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  abortController: null,
  setAbortController: (controller) => set({ abortController: controller }),
}));
