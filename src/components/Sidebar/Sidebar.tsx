import React, { useEffect, useState } from "react";
import * as styles from "./Sidebar.module.css";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";

interface ChatThread {
  id: number;
  title: string;
}

const Sidebar: React.FC = () => {
  const [chatList, setChatList] = useState<ChatThread[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentId = parseInt(id ?? "");

  useEffect(() => {
    const stored = localStorage.getItem("chatThreads");
    if (stored) {
      // chatThreads는 { "1": Message[], "2": Message[], ... } 형태입니다.
      const threadsObj = JSON.parse(stored) as Record<number, any[]>;
      const threads: ChatThread[] = Object.keys(threadsObj)
        .map((id) => {
          const threadId = Number(id);
          const messages = threadsObj[threadId];
          let title = "Untitled Chat";
          if (messages && messages.length > 0) {
            // 우선, role이 "user"인 메시지가 있으면 그 텍스트를 제목으로 사용
            const userMsg = messages.find((msg) => msg.role === "user");
            title = userMsg
              ? userMsg.text
              : messages[0].text || "Untitled Chat";
          }
          return { id: threadId, title };
        })
        .sort((a, b) => b.id - a.id) // 최신 스레드가 위에 오도록 정렬
        .slice(0, 5); // 최신 5개 스레드만 표시
      setChatList(threads);
    }
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.navItem} onClick={() => navigate("/")}>
        New Chat
      </div>
      <div className={styles.navItem}>Chat List</div>
      {chatList.map((item, index) => (
        <div
          key={item.id}
          className={cn(styles.chatList, {
            [styles.active]: item.id === currentId,
          })}
          onClick={() => navigate(`/chats/${item.id}`)}
        >
          {item.title}
        </div>
      ))}
      <div className={styles.navItem} onClick={() => navigate("/profile")}>
        Profile
      </div>
    </div>
  );
};

export default Sidebar;
