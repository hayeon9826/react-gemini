import React from "react";
import * as styles from "./ChatList.module.css";
import { useChatStore } from "../../store/chatStore";

const ChatList: React.FC = () => {
  const messages = useChatStore((state) => state.messages);

  return (
    <div className={styles.chatList}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.chatMessage} ${
            message.role === "user" ? styles.sent : ""
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
