import React from "react";
import ReactDOM from "react-dom/client";
import { VisaProvider } from "./context/VisaContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VisaProvider>
      <App />
    </VisaProvider>
  </React.StrictMode>
);
