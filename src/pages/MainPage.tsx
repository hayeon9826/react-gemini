import React, { useEffect, useState } from "react";
import ChatInput from "../components/ChatInput/ChatInput";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Main from "../components/Main/Main";

const MainPage: React.FC = () => {
  const [newThreadId, setNewThreadId] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("chatThreads");
    if (stored) {
      const threads = JSON.parse(stored) as Record<string, any>;
      const keys = Object.keys(threads);
      if (keys.length > 0) {
        const threadIds = keys.map((key) => Number(key));
        const maxId = Math.max(...threadIds);
        setNewThreadId(maxId + 1);
      } else {
        setNewThreadId(1);
      }
    } else {
      setNewThreadId(1);
    }
  }, []);

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
        <Main />
        <ChatInput threadId={newThreadId} />
      </div>
    </div>
  );
};

export default MainPage;
