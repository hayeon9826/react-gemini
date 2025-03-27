import React from "react";
import * as styles from "./Sidebar.module.css";
import cn from "classnames";

const Sidebar: React.FC = () => {
  const chatList = [
    { id: 1, title: "Lorem ipsum dolor sit amet" },
    { id: 2, title: "consectetur adipiscing elit" },
    { id: 3, title: "Vivamus nunc nisl, tempus ut diam" },
    { id: 4, title: "Cras ultricies finibus" },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.navItem}>New Chat</div>
      <div className={styles.navItem}>Chat List</div>
      {chatList?.map((item, index) => (
        <div
          key={item?.id}
          className={cn(styles.chatList, { [styles.active]: index === 0 })}
        >
          {item?.title}
        </div>
      ))}
      <div className={styles.navItem}>Profile</div>
    </div>
  );
};

export default Sidebar;
