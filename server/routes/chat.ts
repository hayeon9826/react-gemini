import express from "express";
import { getGeminiResponse } from "../utils/gemini";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await getGeminiResponse(prompt);
    console.log("gemini response: ", response);
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
