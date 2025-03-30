"use client";

import React, { useState } from "react";
import * as styles from "./ChatInput.module.css";
import { AiOutlineSend } from "react-icons/ai";
import { useChatStore, Message } from "../../store/chatStore";

const ChatInput: React.FC = () => {
  const [input, setInput] = useState("");
  const addMessage = useChatStore((state) => state.addMessage);
  const setLoading = useChatStore((state) => state.setLoading);
  const loading = useChatStore((state) => state.loading);

  const handleSend = async () => {
    if (!input.trim()) return;

    console.log("Sending message:", input);

    // 사용자 메시지 생성 및 전역 상태에 추가
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };
    addMessage(userMessage);

    // 요청 시작: 로딩 상태 활성화
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // API가 기대하는 형식에 맞게 prompt로 전달 (멀티턴 대화 시엔 전체 context를 보내도 됨)
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
      // 요청 종료: 로딩 상태 해제 및 입력창 초기화
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatInputWrapper}>
      <textarea
        className={styles.chatInput}
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <button
        className={styles.sendButton}
        onClick={handleSend}
        disabled={loading}
      >
        <AiOutlineSend className={styles.sendIcon} />
      </button>
    </div>
  );
};

export default ChatInput;
