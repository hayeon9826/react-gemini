"use client";

import React, { useState } from "react";
import * as styles from "./ChatInput.module.css";
import { AiOutlineSend } from "react-icons/ai";
import { useChatStore, Message } from "../../store/chatStore";

const ChatInput: React.FC = () => {
  const [input, setInput] = useState("");
  const addMessage = useChatStore((state) => state.addMessage);

  const handleSend = async () => {
    if (!input.trim()) return; // 빈 메시지 방지

    console.log("Sending message:", input);

    // 사용자 메시지 생성 및 전역 상태에 추가
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };
    addMessage(userMessage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 프론트엔드에서 API가 기대하는 형식에 맞게 전달하거나, 단순히 prompt로 보내는 방식
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Chat API Response:", data);

      // 서버 응답(어시스턴트 메시지) 생성 및 전역 상태에 추가
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.response,
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: "문제가 생겼습니다. 다시 시도해주세요",
      };
      addMessage(errorMsg);
    } finally {
      setInput("");
    }
  };

  return (
    <div className={styles.chatInputWrapper}>
      <textarea
        className={styles.chatInput}
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className={styles.sendButton} onClick={handleSend}>
        <AiOutlineSend className={styles.sendIcon} />
      </button>
    </div>
  );
};

export default ChatInput;
