import React, { useEffect, useRef } from "react";
import * as styles from "./ChatList.module.css";
import { useChatStore } from "../../store/chatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatListProps {
  threadId: number;
}

const MarkdownComponents = {
  code({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const ChatList: React.FC<ChatListProps> = ({ threadId }) => {
  const threads = useChatStore((state) => state.threads);
  const messages = threads[threadId] || [];
  const loading = false; // 필요에 따라 로딩 상태 추가
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {message.text}
            </ReactMarkdown>
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
