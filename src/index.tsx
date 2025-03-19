import React from "react";
import { createRoot } from "react-dom/client";

const App: React.FC = () => {
  return <div>Welcome to the Gemini API Chat App!</div>;
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
