import express from "express";
import bodyParser from "body-parser";
import chatRouter from "./routes/chat";
import geminiStreamRouter from "./routes/geminiStream";

const app = express();
const port = process.env.PORT || 3001;

app.use("/api", geminiStreamRouter);
//  JSON 파싱이 필요한 라우터는 body-parser 이후에 마운트
app.use(bodyParser.json());
app.use("/api", chatRouter);

// GET 테스트
app.get("/api/hello", (req, res) => {
  res.json({ message: "hello react" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
