import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import applicationsRouter from "./routes/applications.js";
import authRouter from "./routes/auth.js";
import financeRouter from "./routes/finance.js";
import walletRouter from "./routes/wallet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Healthcheck endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API v1 Routes
app.use("/api/v1/applications", applicationsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/finance", financeRouter);
app.use("/api/v1/wallet", walletRouter);

app.listen(PORT, () => {
  console.log(`⚡ Phantom Visa OS Backend running on http://localhost:${PORT}`);
});
