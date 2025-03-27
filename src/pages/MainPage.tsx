import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import ChatList from "../components/ChatList/ChatList";
import ChatInput from "../components/ChatInput/ChatInput";
import "../global.css";

const MainPage: React.FC = () => {
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

export default MainPage;
