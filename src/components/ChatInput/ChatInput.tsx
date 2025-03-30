"use client";

import React, { useState } from "react";
import * as styles from "./ChatInput.module.css";
import { AiOutlineSend } from "react-icons/ai";
import { useChatStore, Message } from "../../store/chatStore";
import { useNavigate, useLocation } from "react-router-dom";

interface ChatInputProps {
  threadId: number;
}

const ChatInput: React.FC<ChatInputProps> = ({ threadId }) => {
  const [input, setInput] = useState("");
  const { threads, setThreadMessages, setLoading, loading } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 스레드의 메시지 배열 (없으면 빈 배열)
  const currentThreadMessages = threads[threadId] || [];

  const handleSend = async () => {
    if (!input.trim()) return;
    console.log("Sending message:", input);

    // 사용자 메시지 생성
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    // 스레드에 사용자 메시지 추가
    const updatedMessages = [...currentThreadMessages, userMessage];
    setThreadMessages(threadId, updatedMessages);

    // 로딩 상태 활성화
    setLoading(true);

    // payload에 전체 대화 내역과 모델 매개변수를 포함
    const payload = {
      prompt: input,
      messages: updatedMessages,
      modelParameters: {
        maxOutputTokens: 2048,
        temperature: 0.3,
        topP: 0.1,
        topK: 1,
        candidateCount: 1,
      },
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Chat API Response:", data);

      // 어시스턴트 메시지 생성
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.response,
      };

      // 스레드에 어시스턴트 메시지 추가
      setThreadMessages(threadId, [...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: "문제가 생겼습니다. 다시 시도해주세요",
      };
      setThreadMessages(threadId, [...updatedMessages, errorMsg]);
    } finally {
      setInput("");
      setLoading(false);
      // 현재 경로가 루트("/")라면, 새 스레드 상세 페이지로 라우팅
      if (location.pathname === "/") {
        navigate(`/chats/${threadId}`);
      }
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
