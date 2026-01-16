import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ReciboProvider } from "./context/ReciboContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ReciboProvider>
        <App />
      </ReciboProvider>
    </BrowserRouter>
  </StrictMode>
);
