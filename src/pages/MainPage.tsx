import React, { useEffect, useState } from "react";
import ChatInput from "../components/ChatInput/ChatInput";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Main from "../components/Main/Main";
import { getNextThreadId } from "../firestoreUtils";

const MainPage: React.FC = () => {
  const [newThreadId, setNewThreadId] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const nextId = await getNextThreadId();
      setNewThreadId(nextId);
    })();
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
