import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import MyPage from "./pages/MyPage";
import SignupPage from "./pages/SignupPage";
import { ToastContainer } from "react-toastify";
import "./global.css";
import TestPage from "./pages/TestPage";
import ThreadListPage from "./pages/ThreadListPage";
import useAuth from "./hooks/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  const { user, loading } = useAuth();
  console.log(user, loading);
  console.log(!!user);

  return (
    <main>
      {loading ? (
        <div>loading</div>
      ) : (
        <Router>
          <Routes>
            {/* 로그인/회원가입 페이지는 항상 접근 가능 */}
            <Route path="/signIn" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* 보호된 라우트 */}
            <Route
              path="/*"
              element={
                <PrivateRoute isAuthenticated={!!user}>
                  <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/threads" element={<ThreadListPage />} />
                    <Route path="/chats/:id" element={<ChatDetailPage />} />
                    <Route path="/profile" element={<MyPage />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      )}
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
    </main>
  );
};

export default App;
