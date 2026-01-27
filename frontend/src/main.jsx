import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ReceiptProvider>
        <App />
      </ReceiptProvider>
    </BrowserRouter>
  </StrictMode>,
);
