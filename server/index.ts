import path from "path";
import express from "express";
import bodyParser from "body-parser";
import chatRouter from "./routes/chat";
import geminiStreamRouter from "./routes/geminiStream";

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use("/api", chatRouter);
app.use("/api", geminiStreamRouter);

// GET 테스트
app.get("/api/hello", (req, res) => {
  res.json({ message: "hello react" });
});

// 정적 파일 제공 (클라이언트 빌드 결과물)
app.use(express.static(path.join(__dirname, "../dist")));

// 모든 요청에 대해 index.html 반환 (클라이언트 사이드 라우팅 지원)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
