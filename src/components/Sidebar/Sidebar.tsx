import React, { useEffect, useState } from "react";
import * as styles from "./Sidebar.module.css";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLatestChatThreads,
  subscribeToChatThreads,
} from "../../firestoreUtils";
import { AiOutlineMenu } from "react-icons/ai";
import useAuth from "../../hooks/useAuth";
import { useModalStore } from "../../store/modalStore";

interface ChatThread {
  id: number;
  title: string;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chatList, setChatList] = useState<ChatThread[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentId = parseInt(id ?? "");
  const { uid } = useAuth();
  const { openModal } = useModalStore();

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToChatThreads(uid, (threads) => {
      const latestThreads = getLatestChatThreads(threads);
      setChatList(latestThreads);
    });
    return () => unsubscribe();
  }, [uid]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={cn(styles.sidebar, { [styles.collapsed]: isCollapsed })}>
      <div className={styles.menuIcon} onClick={toggleSidebar}>
        <AiOutlineMenu className={styles.menuIconCenter} />
      </div>

      {!isCollapsed && (
        <>
          <div className={styles.navItem} onClick={() => navigate("/")}>
            New Chat
          </div>
          <div className={styles.navItem} onClick={() => navigate(`/threads`)}>
            Thread List
          </div>
          {chatList.map((item) => (
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
          <div
            className={cn(styles.navItem, styles["mt-lg"])}
            onClick={openModal}
          >
            Profile
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
