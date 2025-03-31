import React, { useEffect, useState } from "react";
import * as styles from "./Sidebar.module.css";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLatestChatThreads,
  subscribeToChatThreads,
} from "../../firestoreUtils";

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
    // Firestore 구독을 시작하고, 최신 5개 스레드 목록을 업데이트
    const unsubscribe = subscribeToChatThreads((threads) => {
      const latestThreads = getLatestChatThreads(threads);
      setChatList(latestThreads);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.navItem} onClick={() => navigate("/")}>
        New Chat
      </div>
      <div className={styles.navItem} onClick={() => navigate(`/chats`)}>
        Chat List
      </div>
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
