import { create } from "zustand";

/**
 * 모달 상태를 관리하는 Zustand 스토어
 */
interface ModalState {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
