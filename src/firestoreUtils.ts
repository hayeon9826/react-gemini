import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { Message } from "./store/chatStore";

/**
 * 주어진 uid와 threadId에 해당하는 채팅 스레드의 메시지 배열을 Firestore에 저장합니다.
 * 경로: chatThreads/{uid}/threads/{threadId}
 * @param uid - 현재 사용자의 uid
 * @param threadId - 채팅 스레드의 ID
 * @param messages - 저장할 메시지 배열
 */
export async function saveThreadMessages(
  uid: string,
  threadId: number,
  messages: Message[]
) {
  // 사용자 별 문서 하위의 threads 서브컬렉션에 저장
  const threadDocRef = doc(db, "chatThreads", uid, "threads", String(threadId));
  await setDoc(threadDocRef, { messages }, { merge: true });
}

/**
 * 현재 사용자의 uid에 해당하는 채팅 스레드를 구독합니다.
 * 경로: chatThreads/{uid}/threads
 * @param uid - 현재 로그인한 사용자의 uid (빈 문자열이 아니어야 합니다)
 * @param callback - 구독 콜백 함수
 */
export const subscribeToChatThreads = (
  uid: string,
  callback: (threads: Record<number, Message[]>) => void
) => {
  if (!uid) {
    throw new Error("유효한 uid가 필요합니다.");
  }
  // uid가 있을 경우 "chatThreads/{uid}/threads"로 경로 구성
  const colRef = collection(db, "chatThreads", uid, "threads");
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const threads: Record<number, Message[]> = {};
    snapshot.forEach((doc) => {
      threads[Number(doc.id)] = doc.data().messages || [];
    });
    callback(threads);
  });
  return unsubscribe;
};

export interface ChatThread {
  id: number;
  title: string;
}

/**
 * 전체 스레드 데이터를 받아 최신 5개의 스레드(문서)를 추출하는 유틸 함수
 * 각 스레드의 제목은 첫 번째 user 메시지의 text(없으면 첫 메시지의 text, 없으면 "Untitled Chat")로 설정합니다.
 * @param threads - 전체 스레드 데이터 (Record<number, Message[]>)
 * @returns 최신 스레드 배열 (ChatThread[])
 */
export const getLatestChatThreads = (
  threads: Record<number, Message[]>
): ChatThread[] => {
  const threadArray: ChatThread[] = Object.keys(threads)
    .map((key) => {
      const id = Number(key);
      const msgs = threads[id];
      let title = "Untitled Chat";
      let uid = "";
      if (msgs && msgs.length > 0) {
        const userMsg = msgs.find((msg) => msg.role === "user");
        if (userMsg) {
          title = userMsg.text;
          uid = userMsg.uid; // 첫번째 user 메시지의 uid
        } else {
          title = msgs[0].text || "Untitled Chat";
          uid = msgs[0].uid || "";
        }
      }
      return { id, title, uid };
    })
    .sort((a, b) => b.id - a.id) // 최신 순 정렬 (id 내림차순)
    .slice(0, 5); // 최신 5개만 선택
  return threadArray;
};

/**
 * 주어진 uid의 채팅 스레드 서브컬렉션에서 모든 문서를 조회하여,
 * 가장 큰 thread id에 1을 더한 새로운 thread id를 반환합니다.
 * 만약 해당 컬렉션에 문서가 없다면 1을 반환합니다.
 * 경로: chatThreads/{uid}/threads
 */
export async function getNextThreadId(uid: string): Promise<number> {
  if (!uid) {
    throw new Error("유효한 uid가 필요합니다.");
  }
  const colRef = collection(db, "chatThreads", uid, "threads");
  const snapshot = await getDocs(colRef);
  const threadIds: number[] = [];
  snapshot.forEach((doc) => {
    const id = Number(doc.id);
    if (!isNaN(id)) {
      threadIds.push(id);
    }
  });
  return threadIds.length > 0 ? Math.max(...threadIds) + 1 : 1;
}

export interface Thread {
  id: number;
  question: string;
  answer: string;
  uid: string;
  updatedAt?: any;
}

// 모든 스레드 가져오기
export const getAllChatThreads = (
  threads: Record<number, Message[]>
): Thread[] => {
  const threadArray: Thread[] = Object.keys(threads)
    .map((key) => {
      const id = Number(key);
      const msgs = threads[id];
      let question = "질문이 없습니다";
      let answer = "답변이 없습니다";
      let uid = "";
      let updatedAt;
      if (msgs && msgs.length > 0) {
        const userMsg = msgs.find((msg) => msg.role === "user");
        if (userMsg) {
          question = userMsg.text;
          uid = userMsg.uid;
        } else {
          question = msgs[0].text;
          uid = msgs[0].uid || "";
        }
        const assistantMsg = msgs.find((msg) => msg.role === "assistant");
        if (assistantMsg) {
          answer = assistantMsg.text;
        }
      }
      return { id, question, answer, uid, updatedAt };
    })
    .sort((a, b) => b.id - a.id); // 최신 순 정렬 (id 내림차순)
  return threadArray;
};
