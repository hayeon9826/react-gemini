import React from "react";
import { useParams } from "react-router-dom";
import ChatList from "../components/ChatList/ChatList";
import Header from "../components/Header/Header";
import ChatInput from "../components/ChatInput/ChatInput";
import Sidebar from "../components/Sidebar/Sidebar";

const ChatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("current id: ", id);

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
        <ChatList />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatDetailPage;
