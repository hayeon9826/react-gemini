import React from "react";
import * as styles from "./ChatList.module.css";

interface Message {
  id: number;
  text: string;
  sent: boolean;
}

const fakeMessages: Message[] = [
  { id: 1, text: "Hello! How can I help you today?", sent: false },
  { id: 2, text: "I'm looking for information on Gemini API.", sent: true },
  { id: 3, text: "Sure, here are some details...", sent: false },
];

const ChatList: React.FC = () => {
  return (
    <div className={styles.chatList}>
      {fakeMessages.map((message) => (
        <div
          key={message.id}
          className={`${styles.chatMessage} ${message.sent ? styles.sent : ""}`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
