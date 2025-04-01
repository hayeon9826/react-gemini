import React from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./ThreadList.module.css";

export interface Thread {
  id: number;
  question: string;
  answer: string;
}

interface ThreadListProps {
  threads: Thread[];
}

const ThreadList: React.FC<ThreadListProps> = ({ threads }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {threads.map((item) => (
        <div
          key={item.id}
          className={styles.threadItem}
          onClick={() => navigate(`/chats/${item.id}`)}
        >
          <div className={styles.question}>{item.question}</div>
          <div className={styles.answer}>
            {item.answer ? item.answer : "답변이 없습니다"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
