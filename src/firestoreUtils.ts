import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
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
