import express from "express";
import { getGeminiResponse } from "../utils/gemini";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    // 프론트엔드에서 전체 대화 내역과 모델 매개변수를 함께 보낸다고 가정합니다.
    const { prompt, messages, modelParameters } = req.body;
    console.log("Received messages:", messages);
    console.log("Model parameters:", modelParameters);

    const response = await getGeminiResponse(prompt, messages, modelParameters);
    console.log("Gemini response:", response);
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
