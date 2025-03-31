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
 * 주어진 threadId에 해당하는 채팅 스레드의 메시지 배열을 Firestore에 저장합니다.
 * @param threadId - 채팅 스레드의 ID
 * @param messages - 저장할 메시지 배열
 */
export async function saveThreadMessages(
  threadId: number,
  messages: Message[]
) {
  // Firestore 문서 ID는 threadId를 문자열로 사용
  const threadDocRef = doc(db, "chatThreads", String(threadId));
  // setDoc은 merge 옵션을 사용하여 기존 데이터와 병합할 수 있습니다.
  await setDoc(threadDocRef, { messages }, { merge: true });
}

/**
 * Firestore의 "chatThreads" 컬렉션에서 실시간으로 데이터를 구독합니다.
 * 각 문서의 ID는 threadId(문자열)로 저장되며, 문서 데이터는 { messages: Message[] } 형식입니다.
 * @param callback - 스레드 데이터를 업데이트할 콜백 함수
 * @returns 구독 취소 함수 (unsubscribe)
 */
export const subscribeToChatThreads = (
  callback: (threads: Record<number, Message[]>) => void
) => {
  const colRef = collection(db, "chatThreads");
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const threads: Record<number, Message[]> = {};
    snapshot.forEach((doc) => {
      // Firestore 문서 ID는 문자열이므로 숫자로 변환
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
      if (msgs && msgs.length > 0) {
        // 우선, role이 "user"인 메시지가 있으면 그 텍스트를 제목으로 사용
        const userMsg = msgs.find((msg) => msg.role === "user");
        title = userMsg ? userMsg.text : msgs[0].text || "Untitled Chat";
      }
      return { id, title };
    })
    .sort((a, b) => b.id - a.id) // 최신 순 정렬 (id 내림차순)
    .slice(0, 5); // 최신 5개만 선택
  return threadArray;
};

/**
 * Firestore의 "chatThreads" 컬렉션에서 모든 문서를 조회하여,
 * 가장 큰 thread id에 1을 더한 새로운 thread id를 반환합니다.
 * 만약 컬렉션에 문서가 없다면 1을 반환합니다.
 */
export async function getNextThreadId(): Promise<number> {
  const colRef = collection(db, "chatThreads");
  const snapshot = await getDocs(colRef);
  const threadIds: number[] = [];
  snapshot.forEach((doc) => {
    const id = Number(doc.id);
    if (!isNaN(id)) {
      threadIds.push(id);
    }
  });
  if (threadIds.length > 0) {
    return Math.max(...threadIds) + 1;
  } else {
    return 1;
  }
}
