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

    // 프롬프트 리셋
    setInput("");

    // 어시스턴트의 스트리밍 응답을 받을 자리 확보
    const placeholderAssistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: "",
    };

    setThreadMessages(threadId, [
      ...updatedMessages,
      placeholderAssistantMessage,
    ]);

    // payload에 전체 대화 내역과 모델 매개변수를 포함
    const payload = {
      prompt: input,
      messages: [...updatedMessages],
      modelParameters: {
        maxOutputTokens: 2048,
        temperature: 0.3,
        topP: 0.1,
        topK: 1,
        candidateCount: 1,
      },
    };

    const fetchStreamData = async () => {
      try {
        const headerConfig = {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        };

        const response = await fetch("/api/gemini-stream", {
          method: "POST",
          headers: headerConfig,
          body: JSON.stringify(payload),
        });

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (reader) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const rawData = line.slice(6).trim();
              if (rawData === "[DONE]") break;
              try {
                const data = JSON.parse(rawData);
                // 업데이트: 마지막 어시스턴트 메시지에 스트리밍 텍스트 누적
                const currentThread =
                  useChatStore.getState().threads[threadId] || [];
                const updatedThread = currentThread.map((msg, idx) => {
                  if (
                    idx === currentThread.length - 1 &&
                    msg.role === "assistant"
                  ) {
                    return { ...msg, text: msg.text + data.text };
                  }
                  return msg;
                });

                setThreadMessages(threadId, updatedThread);
              } catch (err) {
                console.error("JSON parsing error:", err);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error sending message (stream):", error);
        const errorMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          text: "문제가 생겼습니다. 다시 시도해주세요",
        };
        setThreadMessages(threadId, [...updatedMessages, errorMsg]);
      } finally {
        setInput("");
        setLoading(false);
        // 루트 페이지에서 새 스레드 생성 시 채팅 상세 페이지로 라우팅
        if (location.pathname === "/") {
          navigate(`/chats/${threadId}`);
        }
      }
    };

    fetchStreamData();
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
