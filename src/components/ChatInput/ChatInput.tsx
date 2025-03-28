import React, { useState } from "react";
import * as styles from "./ChatInput.module.css";
import { AiOutlineSend } from "react-icons/ai";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return; // 빈 메시지 방지

    console.log("Sending message:", message);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Chat API Response:", data);

      // TODO: 추후에는 여기서 Recoil이나 전역 상태에 응답 저장, 화면 표시 등을 할 수 있음
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setMessage("");
    }
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
