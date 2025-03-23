import React, { useState } from "react";
import * as styles from "./ChatInput.module.css";
import { AiOutlineSend } from "react-icons/ai";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div className={styles.chatInputWrapper}>
      <textarea
        className={styles.chatInput}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className={styles.sendButton} onClick={handleSend}>
        <AiOutlineSend className={styles.sendIcon} />
      </button>
    </div>
  );
};

export default ChatInput;
