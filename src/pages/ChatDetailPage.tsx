// src/pages/ChatDetailPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import ChatList from "../components/ChatList/ChatList";
import ChatInput from "../components/ChatInput/ChatInput";
import { subscribeToChatThreads } from "../firestoreUtils";
import { useChatStore } from "../store/chatStore";
import useAuth from "../hooks/useAuth";

const ChatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const threadId = parseInt(id ?? "0", 10);
  const setThreads = useChatStore((state) => state.setThreads);
  const navigate = useNavigate();
  const { uid } = useAuth();

  useEffect(() => {
    if (!uid) return; // uid가 없으면 구독하지 않음
    // Firestore의 "chatThreads" 컬렉션을 구독하여 전체 스레드 데이터를 실시간으로 업데이트합니다.
    const unsubscribe = subscribeToChatThreads(uid, (threads) => {
      // 구독으로 받은 전체 threads 객체를 store에 업데이트합니다.
      setThreads(threads);
    });
    return () => unsubscribe();
  }, [setThreads, uid]);

  // threadId가 유효하지 않으면 기본 페이지로 이동
  useEffect(() => {
    if (isNaN(threadId) || threadId === 0) {
      navigate("/");
    }
  }, [threadId, navigate]);

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
        <ChatList threadId={threadId} />
        <ChatInput threadId={threadId} />
      </div>
    </div>
  );
};

export default ChatDetailPage;
