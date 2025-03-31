import React, { useEffect, useRef } from "react";
import * as styles from "./ChatList.module.css";
import { useChatStore } from "../../store/chatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownCodeBlock } from "./MarkdownCodeBlock";

interface ChatListProps {
  threadId: number;
}

const ChatList: React.FC<ChatListProps> = ({ threadId }) => {
  const threads = useChatStore((state) => state.threads);
  const messages = threads[threadId] || [];
  const loading = useChatStore((state) => state.loading);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatList}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.chatMessage} ${
            message.role === "user" ? styles.sent : ""
          }`}
        >
          {message.role === "assistant" ? (
            <div className={styles.markdown}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownCodeBlock}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          ) : (
            message.text
          )}
        </div>
      ))}
      {loading && <div className={`${styles.chatMessage} ${styles.loader}`} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatList;
