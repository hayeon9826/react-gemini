import React from "react";
import * as styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../store/modalStore";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  return (
    <div className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        Gemini React Chatbot
      </div>
      <div className={styles.profile} onClick={openModal}>
        Profile
      </div>
    </div>
  );
};

export default Header;
