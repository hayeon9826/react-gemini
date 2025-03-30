import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

// 메시지 인터페이스 (클라이언트에서 전달하는 메시지)
export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

// Gemini API가 기대하는 대화 내역 형식
interface HistoryEntry {
  role: "user" | "model";
  parts: { text: string }[];
}

// 모델 매개변수 인터페이스
export interface GenerationConfig {
  maxOutputTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  candidateCount: number;
}

/**
 * 멀티턴 대화를 지원하도록 전체 대화 내역과 모델 매개변수를 포함해 Gemini API를 호출합니다.
 * @param prompt - 현재 사용자 입력
 * @param messages - 이전 대화 내역 (ChatMessage 배열)
 * @param modelParameters - 모델 호출에 사용할 매개변수 (GenerationConfig)
 * @returns 생성된 응답 텍스트
 */
export async function getGeminiResponse(
  prompt: string,
  messages?: ChatMessage[],
  modelParameters?: GenerationConfig
): Promise<string> {
  // 이전 대화 내역을 Gemini가 기대하는 형식으로 변환
  const history: HistoryEntry[] =
    messages?.map((msg: ChatMessage) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })) || [];

  // 현재 입력을 history에 추가
  history.push({ role: "user", parts: [{ text: prompt }] });

  // 대화 세션 생성
  const chat = genAI.chats.create({
    model: "gemini-2.0-flash",
    history,
    config: modelParameters,
  });

  try {
    // sendMessage 호출 시, generationConfig는 모델 매개변수를 포함하도록 전달 (타입이 맞지 않는다면 cast)
    const response = await chat.sendMessage({
      message: prompt,
    });
    return response.text!;
  } catch (error) {
    console.error("Error in Gemini API:", error);
    throw error;
  }
}

/**
 * 스트리밍 응답을 위한 함수
 * @param prompt - 현재 사용자 입력
 * @param onText - 스트림으로 받은 텍스트를 처리하는 콜백 함수
 */
export async function streamGeminiResponse(
  prompt: string,
  onText: (text: string) => Promise<void> | void
): Promise<void> {
  const chat = genAI.chats.create({
    model: "gemini-2.0-flash",
    history: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      maxOutputTokens: 2048,
      temperature: 0.3,
      topP: 0.1,
      topK: 1,
      candidateCount: 1,
    },
  });

  try {
    const stream = await chat.sendMessageStream({
      message: prompt,
    });

    for await (const chunk of stream) {
      const chunkText: string = chunk.text!;
      await onText(chunkText);
    }
  } catch (error) {
    console.error("Error in streamGeminiResponse:", error);
    throw error;
  }
}
