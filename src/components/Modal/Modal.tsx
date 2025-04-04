import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useModalStore } from "../../store/modalStore";
import useAuth from "../../hooks/useAuth";
import * as styles from "./Modal.module.css";

const Modal: React.FC = () => {
  const { user } = useAuth();
  const { isModalOpen, closeModal } = useModalStore();
  const auth = getAuth();

  if (!isModalOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
      closeModal(); // 로그아웃 후 모달도 닫음
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  // Firebase Auth에서 제공하는 metadata
  const creationTime = user?.metadata?.creationTime || "정보 없음";
  const lastSignInTime = user?.metadata?.lastSignInTime || "정보 없음";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 상단 헤더 영역 */}
        <header className={styles.modalHeader}>
          <span className={styles.modalTitle}>프로필</span>
          <button className={styles.closeIcon} onClick={closeModal}>
            ✕
          </button>
        </header>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 정보 섹션 */}
        <div className={styles.profileContent}>
          <div className={styles.profileRow}>
            <span className={styles.label}>이메일</span>
            <span className={styles.value}>{user?.email}</span>
          </div>
          <div className={styles.profileRow}>
            <span className={styles.label}>생성 날짜</span>
            <span className={styles.value}>{creationTime}</span>
          </div>
          <div className={styles.profileRow}>
            <span className={styles.label}>최근 로그인</span>
            <span className={styles.value}>{lastSignInTime}</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 로그아웃 버튼 */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          이 기기에서 로그아웃
        </button>
      </div>
    </div>
  );
};

export default Modal;
