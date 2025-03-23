import React from "react";
import * as styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>Gemini React Chatbot</div>
      <div className={styles.profile}>Profile</div>
    </div>
  );
};

export default Header;
