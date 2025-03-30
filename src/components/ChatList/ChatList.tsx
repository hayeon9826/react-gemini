import React, { useEffect, useRef } from "react";
import * as styles from "./ChatList.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "../../store/chatStore";
import { MarkdownCodeBlock } from "./MarkdownCodeBlock";

const ChatList: React.FC = () => {
  const messages = useChatStore((state) => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loading = useChatStore((state) => state.loading);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log(messages);

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
            <div className={`${styles.markdown}`}>
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
