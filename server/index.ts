import express from "express";
import chatRouter from "./routes/chat";
import geminiStreamRouter from "./routes/geminiStream";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;

app.use("/api", geminiStreamRouter);
app.use("/api", chatRouter);

// GET 테스트
app.get("/api/hello", (req, res) => {
  res.json({ message: "hello react" });
});

// /api로 시작하는 경로는 건너뛰고, 그 외의 요청에 대해서만 정적 파일을 제공하도록 커스텀 미들웨어를 사용합니다.
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  return express.static(path.join(__dirname, "../"))(req, res, next);
});
// 클라이언트 사이드 라우팅을 위한 catch-all 라우트
app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
