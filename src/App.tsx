import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import MyPage from "./pages/MyPage";
import SignInPage from "./pages/SignInPage";
import "./global.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chats/:id" element={<ChatDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/signIn" element={<SignInPage />} />
      </Routes>
    </Router>
  );
};

export default App;
