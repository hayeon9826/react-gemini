import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import TestPage from "./TestPage";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
  // root.render(<TestPage />);
}
