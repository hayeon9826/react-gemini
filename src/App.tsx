import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import SignupPage from "./pages/SignupPage";
import { ToastContainer } from "react-toastify";
import "./global.css";
import TestPage from "./pages/TestPage";
import ThreadListPage from "./pages/ThreadListPage";
import useAuth from "./hooks/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import * as styles from "./Spinner.module.css";
import Modal from "./components/Modal/Modal";

const App: React.FC = () => {
  const { user, loading } = useAuth();

  console.log("Firebase API Key: ", process.env.REACT_APP_FIREBASE_API_KEY);
  console.log("NODE_ENV: ", process.env.NODE_ENV);

  return (
    <main>
      {loading ? (
        <div className={styles.spinner} />
      ) : (
        <Router>
          <Routes>
            {/* 로그인/회원가입 페이지는 항상 접근 가능 */}
            <Route path="/register" element={<SignupPage />} />
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
      <Modal />
    </main>
  );
};

export default App;
