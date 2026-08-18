import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { VisaProvider } from "./context/VisaContext";
import App from "./App";
import { initFaviconSync } from "./utils/favicon";
import "./index.css";

// Initialize global favicon listener & hydration from storage
initFaviconSync();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <VisaProvider>
      <App />
    </VisaProvider>
  </BrowserRouter>
);
