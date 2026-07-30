import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { VisaProvider } from "./context/VisaContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <VisaProvider>
        <App />
      </VisaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
