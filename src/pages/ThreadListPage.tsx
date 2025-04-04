import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import {
  getAllChatThreads,
  subscribeToChatThreads,
  Thread,
} from "../firestoreUtils";

import ThreadList from "../components/ThreadList/ThreadList";
import useAuth from "../hooks/useAuth";

const ThreadListPage: React.FC = () => {
  const [threadList, setsThreadList] = useState<Thread[]>([]);
  const { uid } = useAuth();

  useEffect(() => {
    if (!uid) return;
    // Firestore 구독을 시작하고, 전체 스레드 목록을 업데이트
    const unsubscribe = subscribeToChatThreads(uid, (threads) => {
      const allThreads = getAllChatThreads(threads);
      setsThreadList(allThreads);
    });
    return () => unsubscribe();
  }, [uid]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Header />
        <ThreadList threads={threadList} />
      </div>
    </div>
  );
};

export default ThreadListPage;
