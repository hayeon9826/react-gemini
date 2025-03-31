import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import MyPage from "./pages/MyPage";
import SignInPage from "./pages/SignInPage";
import { ToastContainer } from "react-toastify";
import "./global.css";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chats/:id" element={<ChatDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signIn" element={<SignInPage />} />
        </Routes>
      </Router>
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        closeOnClick={false}
      />
    </>
  );
};

export default App;
