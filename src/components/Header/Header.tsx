import React from "react";
import * as styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        Gemini React Chatbot
      </div>
      <div className={styles.profile} onClick={() => navigate("/profile")}>
        Profile
      </div>
    </div>
  );
};

export default Header;
