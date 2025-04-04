import React from "react";
import * as styles from "./Main.module.css";
import useAuth from "../../hooks/useAuth";

const Main: React.FC = () => {
  const { user } = useAuth();

  const getNickname = (email?: string | null) => {
    if (!email) return "user";

    return email?.split("@")?.[0];
  };

  return (
    <div className={styles.main}>
      <div className={styles.text}>Hello, {getNickname(user?.email)}</div>
    </div>
  );
};

export default Main;
