import React from "react";
import * as styles from "./Main.module.css";

const Main: React.FC = () => {
  return (
    <div className={styles.main}>
      <div className={styles.text}>Hello, user</div>
    </div>
  );
};

export default Main;
