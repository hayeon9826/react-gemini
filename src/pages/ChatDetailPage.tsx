import React from "react";
import { useParams } from "react-router-dom";

const ChatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  console.log(id, "<<???");

  return (
    <div>
      <h1>채팅 상세 페이지</h1>
      <p>채팅 ID: {id}</p>
    </div>
  );
};

export default ChatDetailPage;
